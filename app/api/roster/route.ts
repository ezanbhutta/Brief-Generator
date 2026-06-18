import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("designers")
      .select("id, name")
      .order("created_at", { ascending: true });
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
  const { name } = (body ?? {}) as { name?: unknown };
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  try {
    const supabase = getSupabaseAdmin();
    const designer = { id: makeId(), name: name.trim() };
    const { error } = await supabase.from("designers").insert(designer);
    if (error) throw error;
    return NextResponse.json({ designer });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to add designer." },
      { status: 500 },
    );
  }
}
