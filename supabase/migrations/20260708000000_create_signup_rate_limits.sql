create table if not exists public.signup_rate_limits (
  id bigint generated always as identity primary key,
  ip_address text not null,
  created_at timestamptz not null default now()
);

create index if not exists signup_rate_limits_ip_created_at_idx
  on public.signup_rate_limits (ip_address, created_at);

alter table public.signup_rate_limits enable row level security;
