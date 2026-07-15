-- Add a subscription plan tier to schools.
-- Values used by the app: 'trial' (default), 'school', 'district'.
alter table public.schools
  add column if not exists plan text not null default 'trial';

-- Guard against unexpected values.
alter table public.schools
  drop constraint if exists schools_plan_check;

alter table public.schools
  add constraint schools_plan_check
  check (plan in ('trial', 'school', 'district'));

-- Backfill any existing rows that predate the default.
update public.schools
  set plan = 'trial'
  where plan is null;
