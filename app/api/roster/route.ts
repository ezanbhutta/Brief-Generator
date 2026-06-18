import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function isRole(s: unknown): s is "designer" | "assigner" {
  return s === "designer" || s === "assigner";
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const role = url.searchParams.get("role");
    const supabase = getSupabaseAdmin();
    let q = supabase
      .from("designers")
      .select("id, name, role")
      .order("created_at", { ascending: true });
    if (isRole(role)) q = q.eq("role", role);
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json({ designers: data ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load roster." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { name, role } = (body ?? {}) as { name?: unknown; role?: unknown };
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  const finalRole = isRole(role) ? role : "designer";
  try {
    const supabase = getSupabaseAdmin();
    const designer = { id: makeId(), name: name.trim(), role: finalRole };
    const { error } = await supabase.from("designers").insert(designer);
    if (error) throw error;
    return NextResponse.json({ designer });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to add to roster." },
      { status: 500 },
    );
  }
}
