-- Track which pricing option a school signed up under.
-- This is separate from `plan` (trial/school/district), which gates feature
-- access. `plan_type` is purely a billing-tier label chosen at signup:
--   'organization' — School or Organization ($200/month)
--   'individual'   — Individual/Personal use ($29/month)
alter table public.schools
  add column if not exists plan_type text not null default 'organization';

alter table public.schools
  drop constraint if exists schools_plan_type_check;

alter table public.schools
  add constraint schools_plan_type_check
  check (plan_type in ('organization', 'individual'));

-- Backfill any existing rows that predate the default.
update public.schools
  set plan_type = 'organization'
  where plan_type is null;
