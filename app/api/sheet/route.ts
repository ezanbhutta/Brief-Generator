import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

interface AssignmentRow {
  id: string;
  brand_name: string;
  industry: string;
  style: string;
  designer_id: string | null;
  designer_name: string;
  assigner_id: string | null;
  assigner_name: string | null;
  brief_id: string | null;
  due_date: string | null;
  created_at: string;
}

function rowToAssignment(r: AssignmentRow) {
  return {
    id: r.id,
    briefId: r.brief_id ?? "",
    brandName: r.brand_name,
    industry: r.industry,
    style: r.style,
    designerId: r.designer_id ?? "",
    designerName: r.designer_name,
    assignerId: r.assigner_id ?? "",
    assignerName: r.assigner_name ?? "",
    dueDate: r.due_date ?? "",
    createdAt: r.created_at,
  };
}

const SELECT =
  "id, brand_name, industry, style, designer_id, designer_name, assigner_id, assigner_name, brief_id, due_date, created_at";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("assignments")
      .select(SELECT)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ assignments: (data ?? []).map(rowToAssignment) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load sheet." },
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
  const b = (body ?? {}) as Record<string, unknown>;
  const required = [
    "brandName",
    "industry",
    "style",
    "designerId",
    "designerName",
    "assignerId",
    "assignerName",
    "dueDate",
  ];
  for (const k of required) {
    if (typeof b[k] !== "string" || !(b[k] as string).trim()) {
      return NextResponse.json({ error: `${k} is required.` }, { status: 400 });
    }
  }
  try {
    const supabase = getSupabaseAdmin();
    const briefId =
      typeof b.briefId === "string" && b.briefId.trim() ? (b.briefId as string).trim() : null;
    const row = {
      id: makeId(),
      brand_name: b.brandName as string,
      industry: b.industry as string,
      style: b.style as string,
      designer_id: b.designerId as string,
      designer_name: b.designerName as string,
      assigner_id: b.assignerId as string,
      assigner_name: b.assignerName as string,
      brief_id: briefId,
      due_date: b.dueDate as string,
    };
    const { data, error } = await supabase
      .from("assignments")
      .insert(row)
      .select(SELECT)
      .single();
    if (error) throw error;
    return NextResponse.json({ assignment: rowToAssignment(data as AssignmentRow) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save assignment." },
      { status: 500 },
    );
  }
}
