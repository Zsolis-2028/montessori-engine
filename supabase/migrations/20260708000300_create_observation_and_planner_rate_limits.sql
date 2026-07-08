create table if not exists public.observation_writer_rate_limits (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists observation_writer_rate_limits_user_created_at_idx
  on public.observation_writer_rate_limits (user_id, created_at);

alter table public.observation_writer_rate_limits enable row level security;

create table if not exists public.daily_planner_rate_limits (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists daily_planner_rate_limits_user_created_at_idx
  on public.daily_planner_rate_limits (user_id, created_at);

alter table public.daily_planner_rate_limits enable row level security;
