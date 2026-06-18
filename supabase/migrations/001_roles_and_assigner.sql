-- Migration 001 — add roles to roster, add assigner to assignments.
-- Run this once in the Supabase SQL editor if you already ran schema.sql.

alter table public.designers
  add column if not exists role text not null default 'designer';

alter table public.designers
  drop constraint if exists designers_role_check;
alter table public.designers
  add constraint designers_role_check check (role in ('designer', 'assigner'));

create index if not exists designers_role_idx on public.designers (role);

alter table public.assignments
  add column if not exists assigner_id   text,
  add column if not exists assigner_name text;
