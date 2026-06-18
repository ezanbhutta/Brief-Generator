-- Migration 003 — track which brief each assignment uses so we never
-- serve the same brief twice once it's in the sheet.

alter table public.assignments
  add column if not exists brief_id text;

create index if not exists assignments_brief_idx on public.assignments (brief_id);
