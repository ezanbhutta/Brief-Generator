import type { Brief, Style } from "@/lib/generator";
import { INDUSTRIES, resolveIndustry, type IndustryEntry } from "@/lib/industries";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface BriefWithId extends Brief {
  id: string;
}

export interface PickResult {
  brief: BriefWithId;
  matchedIndustry: IndustryEntry;
  confidence: "exact" | "alias" | "fuzzy";
  fuzzyDistance?: number;
  totalInCell: number;
  catalogIsEmpty: boolean;
}

export interface NoMatchResult {
  reason: "industry-unknown" | "cell-empty" | "catalog-empty";
  matchedIndustry?: IndustryEntry;
  availableIndustries: string[];
}

export type LookupResult =
  | { ok: true; data: PickResult }
  | { ok: false; data: NoMatchResult };

interface BriefRow {
  id: string;
  industry_key: string;
  style: Style;
  brand_name: string;
  data: Brief;
}

async function fetchCellCount(industryKey: string, style: Style): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from("briefs")
    .select("id", { count: "exact", head: true })
    .eq("industry_key", industryKey)
    .eq("style", style);
  if (error) throw error;
  return count ?? 0;
}

// Log an industry the user typed that we don't have briefs for, so I can
// add real briefs for it next session.
async function logPendingIndustry(raw: string): Promise<void> {
  try {
    const label = raw.trim().slice(0, 80);
    if (!label) return;
    const normalized = label.toLowerCase().replace(/\s+/g, " ");
    const supabase = getSupabaseAdmin();
    const existing = await supabase
      .from("pending_industries")
      .select("id, request_count")
      .eq("normalized", normalized)
      .maybeSingle();
    if (existing.data) {
      await supabase
        .from("pending_industries")
        .update({
          request_count: (existing.data.request_count ?? 0) + 1,
          last_requested_at: new Date().toISOString(),
        })
        .eq("id", existing.data.id);
    } else {
      await supabase.from("pending_industries").insert({
        id: normalized.replace(/[^a-z0-9]+/g, "-").slice(0, 60) || `pending-${Date.now()}`,
        label,
        normalized,
      });
    }
  } catch {
    // Table might not exist yet (pre-migration). Silently swallow.
  }
}

// Brief ids that are already in the sheet — we never serve those again.
async function fetchUsedBriefIds(): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("assignments")
    .select("brief_id")
    .not("brief_id", "is", null);
  if (error) return [];
  return (data ?? [])
    .map((r) => (r as { brief_id: string | null }).brief_id)
    .filter((x): x is string => typeof x === "string" && x.length > 0);
}

async function fetchOneBrief(
  industryKey: string,
  style: Style,
  excludeIds: string[],
): Promise<BriefRow | null> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("briefs")
    .select("id, industry_key, style, brand_name, data")
    .eq("industry_key", industryKey)
    .eq("style", style);
  if (excludeIds.length > 0) {
    query = query.not("id", "in", `(${excludeIds.map((s) => `"${s.replace(/"/g, '\\"')}"`).join(",")})`);
  }
  // We can't ORDER BY random() in PostgREST, so fetch the candidate set and pick.
  // Limit to 50 rows: enough to give variety, small enough to be cheap.
  query = query.limit(50);
  const { data, error } = await query;
  if (error) throw error;
  if (!data || data.length === 0) return null;
  const idx = Math.floor(Math.random() * data.length);
  return data[idx] as BriefRow;
}

export async function pickBrief(
  industryInput: string,
  style: Style,
  excludeIds: string[] = [],
): Promise<LookupResult> {
  const available = INDUSTRIES.map((i) => i.key);

  const match = resolveIndustry(industryInput);
  if (!match) {
    // Record what they typed so I can add real briefs for it next session.
    void logPendingIndustry(industryInput);
    return {
      ok: false,
      data: {
        reason: "industry-unknown",
        availableIndustries: available,
      },
    };
  }

  const [totalInCell, usedIds] = await Promise.all([
    fetchCellCount(match.entry.key, style),
    fetchUsedBriefIds(),
  ]);
  if (totalInCell === 0) {
    return {
      ok: false,
      data: {
        reason: "cell-empty",
        matchedIndustry: match.entry,
        availableIndustries: available,
      },
    };
  }

  // Combine: per-browser "seen" exclusions + global "already in sheet" exclusions.
  const allExclude = Array.from(new Set([...excludeIds, ...usedIds]));

  // Try with everything excluded first. If every brief in the cell is
  // excluded, fall back to per-browser only, then to nothing.
  let row = await fetchOneBrief(match.entry.key, style, allExclude);
  if (!row) row = await fetchOneBrief(match.entry.key, style, excludeIds);
  if (!row) row = await fetchOneBrief(match.entry.key, style, []);
  if (!row) {
    return {
      ok: false,
      data: {
        reason: "cell-empty",
        matchedIndustry: match.entry,
        availableIndustries: available,
      },
    };
  }

  const brief: BriefWithId = { ...row.data, brandName: row.brand_name, id: row.id };

  return {
    ok: true,
    data: {
      brief,
      matchedIndustry: match.entry,
      confidence: match.confidence,
      fuzzyDistance: match.distance,
      totalInCell,
      catalogIsEmpty: false,
    },
  };
}

export function allIndustryLabels(): { key: string; label: string }[] {
  return INDUSTRIES.map((i) => ({ key: i.key, label: i.label }));
}
