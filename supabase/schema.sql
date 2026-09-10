-- Brand Brief Generator — Supabase schema
-- Run this once in the Supabase SQL editor for the project.

-- ─── Briefs catalog ─────────────────────────────────────────────────
create table if not exists public.briefs (
  id           text primary key,
  industry_key text not null,
  style        text not null,
  brand_name   text not null,
  data         jsonb not null,
  created_at   timestamptz not null default now()
);

create index if not exists briefs_cell_idx on public.briefs (industry_key, style);

-- ─── Roster ─────────────────────────────────────────────────────────
create table if not exists public.designers (
  id         text primary key,
  name       text not null,
  role       text not null default 'designer' check (role in ('designer', 'assigner', 'csr')),
  created_at timestamptz not null default now()
);

create index if not exists designers_created_idx on public.designers (created_at);
create index if not exists designers_role_idx on public.designers (role);

-- ─── Assignments (the "sheet") ──────────────────────────────────────
create table if not exists public.assignments (
  id            text primary key,
  brand_name    text not null,
  industry      text not null,
  style         text not null,
  designer_id   text references public.designers(id) on delete set null,
  designer_name text not null,
  assigner_id   text,
  assigner_name text,
  brief_id      text,
  due_date      date,
  created_at    timestamptz not null default now()
);

create index if not exists assignments_due_idx on public.assignments (due_date);
create index if not exists assignments_created_idx on public.assignments (created_at);
create index if not exists assignments_brief_idx on public.assignments (brief_id);

-- ─── Pending industry / exhausted-cell requests ─────────────────────
-- Unknown keywords the user typed, and industry:style cells that ran out
-- of unused briefs (encoded as `industry:style` in normalized).
create table if not exists public.pending_industries (
  id                text primary key,
  label             text not null,
  normalized        text not null unique,
  request_count     int  not null default 1,
  last_requested_at timestamptz not null default now(),
  created_at        timestamptz not null default now()
);

-- ─── Row level security ─────────────────────────────────────────────
-- RLS is enabled with no policies: these tables are reachable only
-- through the `pgrst` edge function, which uses the service role
-- (bypasses RLS) and only exposes these four tables.
alter table public.briefs             enable row level security;
alter table public.designers          enable row level security;
alter table public.assignments        enable row level security;
alter table public.pending_industries enable row level security;
