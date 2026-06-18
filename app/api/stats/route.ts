import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { INDUSTRIES } from "@/lib/industries";
import { STYLES } from "@/lib/generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const [briefsCount, designersCount, assignmentsCount, industryKeys] = await Promise.all([
      supabase.from("briefs").select("id", { count: "exact", head: true }),
      supabase.from("designers").select("id", { count: "exact", head: true }),
      supabase.from("assignments").select("id", { count: "exact", head: true }),
      supabase.from("briefs").select("industry_key"),
    ]);

    // Count distinct industry_keys actually represented in the catalog. This
    // way, any industries added later (beyond the hand-curated list) show up
    // on the dashboard automatically.
    const distinct = new Set<string>();
    (industryKeys.data ?? []).forEach((r) => {
      const k = (r as { industry_key: string }).industry_key;
      if (k) distinct.add(k);
    });
    const industriesInCatalog = distinct.size || INDUSTRIES.length;

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
