#!/usr/bin/env node
// Seed Supabase from local catalog JSON + a hard-coded designer roster.
// Idempotent: re-runs skip rows that already exist (ON CONFLICT DO NOTHING).
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-supabase.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const catalogDir = join(repoRoot, "data", "catalog");

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Pre-seeded logo designers (HaseebMadeIt team).
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

function briefId(industryKey, style, brandName, idx) {
  // Stable, deterministic IDs so re-runs don't duplicate.
  const slug = brandName
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

async function seedBriefs() {
  const files = readdirSync(catalogDir).filter((f) => f.endsWith(".json"));
  const rows = [];
  for (const file of files) {
    const raw = readFileSync(join(catalogDir, file), "utf8");
    const json = JSON.parse(raw);
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

  console.log(`Seeding ${rows.length} briefs from ${files.length} files…`);
  const chunkSize = 200;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from("briefs").upsert(chunk, { onConflict: "id" });
    if (error) {
      console.error("Brief upsert error:", error.message);
      process.exit(1);
    }
    inserted += chunk.length;
    process.stdout.write(`  ${inserted}/${rows.length}\r`);
  }
  console.log(`\nBriefs done.`);
}

async function seedDesigners() {
  const { data: existing, error: e1 } = await supabase
    .from("designers")
    .select("name");
  if (e1) {
    console.error("Designer fetch error:", e1.message);
    process.exit(1);
  }
  const have = new Set((existing ?? []).map((d) => d.name.toLowerCase()));
  const toInsert = DESIGNERS.filter((n) => !have.has(n.toLowerCase())).map(
    (name) => ({
      id: crypto.randomBytes(8).toString("hex"),
      name,
    }),
  );
  if (toInsert.length === 0) {
    console.log("All designers already present.");
    return;
  }
  const { error } = await supabase.from("designers").insert(toInsert);
  if (error) {
    console.error("Designer insert error:", error.message);
    process.exit(1);
  }
  console.log(`Seeded ${toInsert.length} designers.`);
}

(async () => {
  await seedBriefs();
  await seedDesigners();
  console.log("Done.");
})();
