import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { INDUSTRIES } from "@/lib/industries";
import { STYLES, type Style } from "@/lib/generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CellCount {
  total: number;
  used: number;
  remaining: number;
}

interface IndustryRow {
  key: string;
  label: string;
  total: number;
  used: number;
  remaining: number;
  styles: Record<Style, CellCount>;
}

const LABEL_BY_KEY = new Map(INDUSTRIES.map((i) => [i.key, i.label] as const));

// Fetch every (id, industry_key, style) from briefs, paging past the 1000-row
// PostgREST cap so all ~1700 rows are counted.
async function fetchAllBriefRows(): Promise<
  { id: string; industry_key: string; style: string }[]
> {
  const supabase = getSupabaseAdmin();
  const pageSize = 1000;
  const rows: { id: string; industry_key: string; style: string }[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("briefs")
      .select("id, industry_key, style")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    rows.push(...(data as typeof rows));
    if (data.length < pageSize) break;
  }
  return rows;
}

async function fetchUsedBriefIds(): Promise<Set<string>> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("assignments")
    .select("brief_id")
    .not("brief_id", "is", null);
  if (error) return new Set();
  return new Set(
    (data ?? [])
      .map((r) => (r as { brief_id: string | null }).brief_id)
      .filter((x): x is string => typeof x === "string" && x.length > 0),
  );
}

function emptyStyles(): Record<Style, CellCount> {
  return STYLES.reduce((acc, s) => {
    acc[s] = { total: 0, used: 0, remaining: 0 };
    return acc;
  }, {} as Record<Style, CellCount>);
}

export async function GET() {
  try {
    const [rows, usedIds] = await Promise.all([fetchAllBriefRows(), fetchUsedBriefIds()]);

    const byKey = new Map<string, IndustryRow>();
    for (const row of rows) {
      let ind = byKey.get(row.industry_key);
      if (!ind) {
        ind = {
          key: row.industry_key,
          label: LABEL_BY_KEY.get(row.industry_key) ?? row.industry_key,
          total: 0,
          used: 0,
          remaining: 0,
          styles: emptyStyles(),
        };
        byKey.set(row.industry_key, ind);
      }
      const isUsed = usedIds.has(row.id);
      ind.total += 1;
      if (isUsed) ind.used += 1;
      const style = (STYLES as readonly string[]).includes(row.style)
        ? (row.style as Style)
        : null;
      if (style) {
        ind.styles[style].total += 1;
        if (isUsed) ind.styles[style].used += 1;
      }
    }

    const industries = Array.from(byKey.values());
    for (const ind of industries) {
      ind.remaining = ind.total - ind.used;
      for (const s of STYLES) {
        ind.styles[s].remaining = ind.styles[s].total - ind.styles[s].used;
      }
    }

    // Alphabetical by label — the UI can re-sort.
    industries.sort((a, b) => a.label.localeCompare(b.label));

    const totals = industries.reduce(
      (acc, i) => {
        acc.total += i.total;
        acc.used += i.used;
        acc.remaining += i.remaining;
        return acc;
      },
      { total: 0, used: 0, remaining: 0 },
    );

    return NextResponse.json({
      count: industries.length,
      totals,
      industries,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load industries." },
      { status: 500 },
    );
  }
}
