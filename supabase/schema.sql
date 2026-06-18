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
  role       text not null default 'designer' check (role in ('designer', 'assigner')),
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
  due_date      date,
  created_at    timestamptz not null default now()
);

create index if not exists assignments_due_idx on public.assignments (due_date);
create index if not exists assignments_created_idx on public.assignments (created_at);

-- Row level security: only the service-role key (used server-side) writes.
alter table public.briefs       enable row level security;
alter table public.designers    enable row level security;
alter table public.assignments  enable row level security;

-- No public policies — Next.js API routes use the service role and bypass RLS.
