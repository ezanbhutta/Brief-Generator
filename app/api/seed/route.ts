import { NextResponse } from "next/server";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import crypto from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

// Sync the repo's brief catalog (data/catalog/*.json) into Supabase.
// Idempotent: upserts on the deterministic brief id, so re-running is safe.
// POST /api/seed          → sync from the start
// POST /api/seed?from=N   → resume from row N (the response's nextFrom)

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TIME_BUDGET_MS = 45_000;
const CHUNK_SIZE = 200;

// Pre-seeded logo designers (HaseebMadeIt team) — same list as the CLI seed.
const DESIGNERS = [
  "Amin Ullah",
  "Rejaul Karim",
  "Abiha Imran",
  "Nimeazad",
  "M. Tariq",
  "Md Dulal",
  "Md Rashadul Haque",
  "MD ZAHID HASAN",
  "MD Rezaul",
  "Shaoor Haider",
  "Atta Razaq",
];

function briefId(industryKey: string, style: string, brandName: string, idx: number): string {
  const slug =
    brandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "brief";
  const hash = crypto
    .createHash("sha1")
    .update(`${industryKey}|${style}|${brandName}|${idx}`)
    .digest("hex")
    .slice(0, 8);
  return `${industryKey}-${style.toLowerCase()}-${slug}-${hash}`;
}

interface BriefRow {
  id: string;
  industry_key: string;
  style: string;
  brand_name: string;
  data: unknown;
}

function loadCatalogRows(): BriefRow[] {
  const catalogDir = join(process.cwd(), "data", "catalog");
  const files = readdirSync(catalogDir).filter((f) => f.endsWith(".json"));
  const rows: BriefRow[] = [];
  for (const file of files) {
    const json = JSON.parse(readFileSync(join(catalogDir, file), "utf8"));
    const industryKey = json.industry;
    if (!industryKey || !json.briefs) continue;
    for (const [style, briefs] of Object.entries(json.briefs)) {
      if (!Array.isArray(briefs)) continue;
      briefs.forEach((brief, idx) => {
        if (!brief?.brandName) return;
        rows.push({
          id: briefId(industryKey, style, brief.brandName, idx),
          industry_key: industryKey,
          style,
          brand_name: brief.brandName,
          data: brief,
        });
      });
    }
  }
  return rows;
}

async function seedDesigners(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { data: existing, error } = await supabase.from("designers").select("name");
  if (error) throw new Error(`Designer fetch failed: ${error.message}`);
  const have = new Set((existing ?? []).map((d) => (d.name as string).toLowerCase()));
  const toInsert = DESIGNERS.filter((n) => !have.has(n.toLowerCase())).map((name) => ({
    id: crypto.randomBytes(8).toString("hex"),
    name,
  }));
  if (toInsert.length === 0) return 0;
  const { error: insErr } = await supabase.from("designers").insert(toInsert);
  if (insErr) throw new Error(`Designer insert failed: ${insErr.message}`);
  return toInsert.length;
}

export async function POST(request: Request) {
  const started = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const from = Math.max(0, parseInt(searchParams.get("from") ?? "0", 10) || 0);

    const rows = loadCatalogRows();
    const supabase = getSupabaseAdmin();

    let cursor = from;
    while (cursor < rows.length && Date.now() - started < TIME_BUDGET_MS) {
      const chunk = rows.slice(cursor, cursor + CHUNK_SIZE);
      const { error } = await supabase.from("briefs").upsert(chunk, { onConflict: "id" });
      if (error) throw new Error(`Brief upsert failed at row ${cursor}: ${error.message}`);
      cursor += chunk.length;
    }

    const finished = cursor >= rows.length;
    const designersAdded = finished ? await seedDesigners() : 0;

    return NextResponse.json({
      catalogRows: rows.length,
      synced: cursor - from,
      nextFrom: finished ? null : cursor,
      done: finished,
      designersAdded,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Seed failed." },
      { status: 500 },
    );
  }
}
