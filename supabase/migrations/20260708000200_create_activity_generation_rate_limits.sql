create table if not exists public.activity_generation_rate_limits (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists activity_generation_rate_limits_user_created_at_idx
  on public.activity_generation_rate_limits (user_id, created_at);

alter table public.activity_generation_rate_limits enable row level security;
