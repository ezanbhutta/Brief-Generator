# Supabase Setup

The brief catalog, designer roster, and assignment sheet all live in Supabase.
Local development talks to the same database via Next.js API routes that use
the service-role key (kept server-side).

## 1. Create the project

1. Sign in at https://supabase.com and create a new project.
2. From **Project Settings → API**, copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

> The service-role key bypasses RLS. **Never expose it to the browser.**
> Only the `app/api/*` routes and the seed script read it.

## 2. Create the tables

Open **SQL Editor → New query**, paste the contents of
[`supabase/schema.sql`](./supabase/schema.sql), and run it.

This creates:

- `briefs` — the catalog (one row per brief, JSONB payload in `data`)
- `designers` — the roster
- `assignments` — the sheet (assigned briefs)

## 3. Configure local env

Create `.env.local` in the repo root:

```bash
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

For Vercel/production: add the same two variables under **Settings →
Environment Variables**.

## 4. Seed the data

Run the seed script once. It reads every JSON file under `data/catalog/`,
inserts each brief into the `briefs` table, and pre-fills the designer
roster with the 11-person logo team.

```bash
npm run seed
```

The script is idempotent — re-runs upsert briefs by ID and skip designers
that already exist by name.

## 5. Done

Start the dev server (`npm run dev`) and:

- `/` — generates briefs from Supabase
- `/roster` — manage designers (writes to Supabase)
- `/sheet` — see assigned briefs (writes to Supabase)

If you ever want to wipe and reseed:

```sql
truncate public.briefs, public.assignments, public.designers cascade;
```

Then re-run `npm run seed`.
