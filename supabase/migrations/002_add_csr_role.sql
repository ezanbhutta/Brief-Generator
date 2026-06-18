-- Migration 002 — add CSR as a roster role.
-- Run after 001_roles_and_assigner.sql.

alter table public.designers
  drop constraint if exists designers_role_check;
alter table public.designers
  add constraint designers_role_check check (role in ('designer', 'assigner', 'csr'));
