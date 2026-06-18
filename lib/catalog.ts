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
    return {
      ok: false,
      data: {
        reason: "industry-unknown",
        availableIndustries: available,
      },
    };
  }

  const totalInCell = await fetchCellCount(match.entry.key, style);
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

  // Try with excludes first; if none left, retry without.
  let row = await fetchOneBrief(match.entry.key, style, excludeIds);
  if (!row) {
    row = await fetchOneBrief(match.entry.key, style, []);
  }
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
