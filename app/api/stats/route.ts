import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { INDUSTRIES } from "@/lib/industries";
import { STYLES } from "@/lib/generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const [briefs, designers, assignments] = await Promise.all([
      supabase.from("briefs").select("id", { count: "exact", head: true }),
      supabase.from("designers").select("id", { count: "exact", head: true }),
      supabase.from("assignments").select("id", { count: "exact", head: true }),
    ]);
    return NextResponse.json({
      industries: INDUSTRIES.length,
      styles: STYLES.length,
      briefs: briefs.count ?? 0,
      designers: designers.count ?? 0,
      assignments: assignments.count ?? 0,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load stats." },
      { status: 500 },
    );
  }
}
