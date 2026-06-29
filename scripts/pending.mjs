#!/usr/bin/env node
// Print the pending-work queue so the most-requested gaps get filled first.
//
// Two kinds of pending work, both stored in the pending_industries table:
//   1. Unknown industries — a keyword the user typed that has no briefs at all.
//   2. Exhausted cells — an industry+style where every brief is already on the
//      sheet (normalized stored as `industry:style`).
//
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/pending.mjs

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase
  .from("pending_industries")
  .select("label, normalized, request_count, last_requested_at")
  .order("request_count", { ascending: false });

if (error) {
  console.error("Query failed:", error.message);
  process.exit(1);
}

const cells = [];
const unknown = [];
for (const row of data ?? []) {
  if (typeof row.normalized === "string" && row.normalized.includes(":")) {
    const [industry, style] = row.normalized.split(":");
    cells.push({ industry, style, count: row.request_count, last: row.last_requested_at });
  } else {
    unknown.push({ keyword: row.label, count: row.request_count, last: row.last_requested_at });
  }
}

console.log("=== EXHAUSTED CELLS (industry + style ran out — fill these first) ===");
if (cells.length === 0) console.log("  (none)");
for (const c of cells) {
  console.log(`  [${c.count}x] ${c.industry} / ${c.style}   (last: ${c.last?.slice(0, 10)})`);
}

console.log("\n=== UNKNOWN KEYWORDS (typed, no briefs exist yet) ===");
if (unknown.length === 0) console.log("  (none)");
for (const u of unknown) {
  console.log(`  [${u.count}x] "${u.keyword}"   (last: ${u.last?.slice(0, 10)})`);
}

console.log(
  `\nTotal: ${cells.length} exhausted cell(s), ${unknown.length} unknown keyword(s).`,
);
