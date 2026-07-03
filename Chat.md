# Brand Brief Generator — Build Log

A full narrative of the conversation that built and evolved the Brand Brief
Generator: a Next.js 16 app that generates brand briefs for designers, backed
by Supabase, with a designer/assigner roster and an assignment sheet.

Live app: `brief-generator-ten.vercel.app` · Repo: `ezanbhutta/Brief-Generator`

---

## Where it started

The app began as a brief generator with a catalog of hand-written briefs stored
as JSON files under `data/catalog/`, a paragraph-format brief display, and a
roster/sheet workflow kept in `localStorage`. The first requests in this session
were about **changing the whole system**:

1. **Move to Supabase** — "Put the data in a database then, also the data of the
   briefs as well. Time to change the system, I will use Supabase."
2. **Restyle to a new design language** — the user attached their existing
   "HaseebMadeIt / CSR Reports" system (light lavender background, white cards
   with violet-tinted borders, Inter + JetBrains Mono, lucide icons) and said:
   "I want this feeling totally, forget the old style."
3. **Pre-load the designer roster** with 11 real logo designers.

---

## Phase 1 — Restyle + Supabase backend

- **Full visual overhaul** to the HaseebMadeIt design: `#FAFAFE` bg, `#7229FF`
  violet, rounded-xl cards, Inter + JetBrains Mono, lucide-react icons, tight
  uppercase labels. Rebuilt nav, generator, brief display, roster, sheet, and
  the assign modal. The old cream/Instrument-Serif editorial look was dropped.
- **Supabase migration** — briefs, designers, and assignments moved out of JSON
  files / localStorage into Postgres tables (`briefs`, `designers`,
  `assignments`). New API routes under `/api/roster` and `/api/sheet` use the
  service-role key server-side. An idempotent seed script loads the catalog and
  pre-fills the 11-designer roster.
- **The setup walkthrough** — the user created a Supabase account and I walked
  them step-by-step through project creation, running `schema.sql`, grabbing the
  Project URL + `service_role` key (caught them pasting the `anon` key by
  mistake — decoded the JWT to prove it said `"role":"anon"`), wiring
  `.env.local`, and running `npm run seed`. Result: **650 briefs + 11 designers**
  seeded.

## Phase 2 — Deploy + the git snags

- Walked through adding the two env vars to Vercel (the UI had moved env vars
  inside each environment).
- The first PR merge only captured one of three commits, so the deployed roster
  page was stale. Diagnosed it, rebased the missing commits onto main, and
  shipped a follow-up PR.

## Phase 3 — Roster, assigner, and dashboard

- **Dashboard homepage** — KPI grid (industries / briefs / styles) fed by a new
  `/api/stats`, stepped generator sections.
- **Assigner roster** — added a second roster (Assigners) alongside Designers.
  The assign flow now requires **both** a designer and an assigner plus a due
  date. Reworked the roster page into side-by-side editable tables with inline
  rename (click a name → edit → Enter to save), optimistic add/rename/remove, a
  toast system, and a confirm dialog on every destructive action.
- Removed the CSR roster after the user decided against it, and pulled the
  designer-count card off the homepage.

## Phase 4 — UX polish

- **Sheet search + filters** — a search box (matches brand / designer / assigner
  / industry / style) plus designer and style dropdowns. Removed the
  Overdue/Today/Soon badges.
- **Click a sheet row → open the full brief** in a modal, with the assignment
  metadata (due date, designer, assigner) at the top and a copy button.
- **Never repeat a used brief** — briefs marked "I'm using this" get their
  `brief_id` recorded; the picker permanently excludes them. Fixed a fallback
  bug where an exhausted small cell would eventually re-serve a used brief;
  `usedIds` is now a hard constraint, and an exhausted cell returns a clear
  message instead of a duplicate.

## Phase 5 — Brief formats

- **Multiple formats** — the user wanted a different-looking brief each time.
  Built six templates (Designer Brief, Founder Memo, Strategy Note, Strategy
  Deck, Brand Story, Full Brief) combining three visual formats (paragraph,
  cards, editorial) with distinct section orderings. The picker never repeats
  the previous template *or* the previous visual format.
- **Trimmed sections** — removed "Why This Name", Voice & Tone (Do's/Don'ts),
  Logo Direction, and Typography from the display and copy.
- **No more thin briefs** — a later fix made every template carry 12–15 sections
  so no brief can render as one line. The user rightly pointed out: "A brief is
  always a detailed note for the brand."

## Phase 6 — Catalog growth

A long series of "more 25 briefs" requests grew the hand-written catalog, always
raising the bar on brand-name meaningfulness — names rooted in real cultural,
historical, geographic, or trade anchors (Cafezinho House, Vauban Architects,
Drummond Private Office, Bicerin & Co, Brouwerij De Klok, and many more).

## Phase 7 — The two-agent brainstorm pipeline

The user asked to **set up two agents that discuss and brainstorm, then conclude
which unique name, format, and brief to save**. Built a continuous pipeline:

- **Agent A (Proposer)** generates 3 culturally-anchored brand-name candidates
  per cell (5 styles × 3 = 15 per industry, with the anchor explained).
- **Agent B (Decider)** critiques every candidate, rejects trademark-risky
  names, picks the winner or counter-proposes, and writes the final briefs.

Run across **20 rounds**, this added ~100 brand-new industries (dental,
insurance, logistics, events, chocolate, agriculture, construction, dance,
flowers, distillery, dairy, optometry, vet, museum, watches, tea, bookstore,
theater, vinyl, stationery, furniture, shoes, eyewear, antiques, map,
skateboarding, tattoo, comics, perfume, plant-shop, and many more). The
trademark guardrail caught dozens of risky picks (Lloyd's, Valrhona, Glashütte,
Borsalino, MIT Mystery Hunt) before they hit the catalog. Two schema deviations
(non-standard style buckets) were caught at integration and remapped.

## Phase 8 — Quality fixes

- **100 focused real-estate briefs** — five research agents (one per style) each
  wrote 20 detailed, sub-segment-specific briefs (iBuyer, industrial/logistics,
  senior living, multifamily, REITs, ultra-luxury, land/ranch, PropTech, etc.)
  with real competitors and 2025 market context. Real estate went 15 → 115.
- **Brand-name / body mismatch fix** — the user spotted a brief titled
  "Hartsfield Realty" whose description said "Home Later". Scanned all 150
  catalog files with a two-signal detector and found **19 briefs** across 11
  industries with the same bug (a body written for one name, `brandName` later
  renamed without updating the prose). Fixed all 19 by making the body match the
  title. 0 mismatches remained.

## Phase 9 — The pending-request queue

The user asked: **when a keyword or style errors as "already used", save it, and
fulfill those first on the next command.** Built exactly that:

- When the generator hits `cell-exhausted` (every brief for an industry+style is
  on the sheet), it logs the exact cell. Unknown typed keywords are logged too.
- Both live in the existing `pending_industries` table (cells encoded as
  `industry:style`) — no new SQL migration needed.
- `npm run pending` prints the queue: exhausted cells and unknown keywords,
  hottest first.

Then, on the next two "make 25 briefs" commands, I checked the queue first and
fulfilled the real requests:

- **Art & Galleries** (25 briefs) — fulfilled the top pending keyword "Art
  Industry" (typed 2×). Sub-segments from contemporary galleries to freeport
  storage, with real competitors (Gagosian, Artsy, Art Basel, Crozier).
- **Packaging & Print** (25 briefs) — fulfilled the pending "Plastic covers"
  keyword, homed in a flexible-films/laminates cell. Real 2025 context (PPWR/EPR,
  mono-material recyclability, PFAS bans).

Noise keywords (brand names typed as industries, already-covered ones) were
cleaned from the queue as part of the workflow.

---

## Final state

- **~1700 briefs across 152 industries**, all in Supabase.
- Full HaseebMadeIt design system.
- Designer + Assigner rosters, inline-editable, backed by Supabase.
- Assignment sheet with search, filters, and click-to-open full briefs.
- Six brief templates that never repeat back-to-back; every one a full document.
- Used briefs never re-served.
- A pending-request queue that captures exhausted cells + unknown keywords and
  gets filled first on the next request.

## Architecture notes

- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind, Supabase
  (`@supabase/supabase-js`), lucide-react, Inter + JetBrains Mono.
- **Data**: `data/catalog/*.json` is the source of truth; `npm run seed` loads
  it into the `briefs` table. `lib/industries.ts` holds the industry registry
  and resolver (exact → alias → fuzzy).
- **Server-only Supabase** via the service-role key in `lib/supabase.ts`; the
  browser never sees it. All DB access goes through `/api/*` routes.
- **Scripts**: `npm run seed` (load catalog + designers), `npm run pending`
  (print the request queue).
- **Setup**: see `SUPABASE_SETUP.md`.

---

*Built collaboratively over one long session. Every catalog brief traces its
brand name to a real cultural, historical, geographic, or trade anchor, and
every design/data change shipped as its own reviewed, squash-merged PR.*
