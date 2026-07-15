-- Tracks a student's progress on individual Montessori materials.
-- One row per (student, area, material); status advances Introduced -> Practicing -> Mastered.
create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  area text not null,
  material text not null,
  status text not null check (status in ('introduced', 'practicing', 'mastered')),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, area, material)
);

create index if not exists student_progress_school_idx
  on public.student_progress (school_id);

create index if not exists student_progress_student_idx
  on public.student_progress (student_id);

alter table public.student_progress enable row level security;

-- Keep updated_at fresh on every write.
create or replace function public.set_student_progress_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists student_progress_set_updated_at on public.student_progress;
create trigger student_progress_set_updated_at
  before update on public.student_progress
  for each row execute function public.set_student_progress_updated_at();

-- RLS: users may only see/modify progress for students in their own school.
drop policy if exists "student_progress_select_own_school" on public.student_progress;
create policy "student_progress_select_own_school"
on public.student_progress
for select
to authenticated
using (
  school_id in (
    select school_id
    from public.user_profiles
    where user_id = (select auth.uid())
  )
);

drop policy if exists "student_progress_insert_own_school" on public.student_progress;
create policy "student_progress_insert_own_school"
on public.student_progress
for insert
to authenticated
with check (
  school_id in (
    select school_id
    from public.user_profiles
    where user_id = (select auth.uid())
  )
);

drop policy if exists "student_progress_update_own_school" on public.student_progress;
create policy "student_progress_update_own_school"
on public.student_progress
for update
to authenticated
using (
  school_id in (
    select school_id
    from public.user_profiles
    where user_id = (select auth.uid())
  )
)
with check (
  school_id in (
    select school_id
    from public.user_profiles
    where user_id = (select auth.uid())
  )
);

drop policy if exists "student_progress_delete_own_school" on public.student_progress;
create policy "student_progress_delete_own_school"
on public.student_progress
for delete
to authenticated
using (
  school_id in (
    select school_id
    from public.user_profiles
    where user_id = (select auth.uid())
  )
);
