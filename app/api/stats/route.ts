import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { INDUSTRIES } from "@/lib/industries";
import { STYLES } from "@/lib/generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PostgREST caps a select at 1000 rows, so with a 2000-brief catalog a
// single select("industry_key") silently drops half the rows. Page
// through all of them.
async function fetchAllIndustryKeys(): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  const pageSize = 1000;
  const keys: string[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("briefs")
      .select("industry_key")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const r of data) {
      const k = (r as { industry_key: string }).industry_key;
      if (k) keys.push(k);
    }
    if (data.length < pageSize) break;
  }
  return keys;
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const [briefsCount, designersCount, assignmentsCount, industryKeys] = await Promise.all([
      supabase.from("briefs").select("id", { count: "exact", head: true }),
      supabase.from("designers").select("id", { count: "exact", head: true }),
      supabase.from("assignments").select("id", { count: "exact", head: true }),
      fetchAllIndustryKeys(),
    ]);

    // Count distinct industry_keys actually represented in the catalog. This
    // way, any industries added later (beyond the hand-curated list) show up
    // on the dashboard automatically.
    const industriesInCatalog = new Set(industryKeys).size || INDUSTRIES.length;

    return NextResponse.json({
      industries: industriesInCatalog,
      styles: STYLES.length,
      briefs: briefsCount.count ?? 0,
      designers: designersCount.count ?? 0,
      assignments: assignmentsCount.count ?? 0,
      usedBriefs: assignmentsCount.count ?? 0,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load stats." },
      { status: 500 },
    );
  }
}
