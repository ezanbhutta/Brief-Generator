import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Brief } from "@/lib/generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("briefs")
      .select("id, industry_key, style, brand_name, data")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Brief not found." }, { status: 404 });
    }
    const row = data as {
      id: string;
      industry_key: string;
      style: string;
      brand_name: string;
      data: Brief;
    };
    return NextResponse.json({
      brief: { ...row.data, brandName: row.brand_name, id: row.id },
      industryKey: row.industry_key,
      style: row.style,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load brief." },
      { status: 500 },
    );
  }
}
