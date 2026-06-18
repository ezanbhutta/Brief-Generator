-- Migration 004 — track industries users typed that don't have briefs yet.
-- I'll query this table next time you ask for new briefs and prioritize the
-- top-requested industries.

create table if not exists public.pending_industries (
  id                  text primary key,
  label               text not null,
  normalized          text not null unique,
  request_count       integer not null default 1,
  first_requested_at  timestamptz not null default now(),
  last_requested_at   timestamptz not null default now()
);

create index if not exists pending_industries_count_idx
  on public.pending_industries (request_count desc);

alter table public.pending_industries enable row level security;
