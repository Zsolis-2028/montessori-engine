begin;

-- =========================================
-- STUDENTS
-- =========================================

do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'students'
  loop
    execute format('drop policy %I on public.students', pol.policyname);
  end loop;
end $$;

alter table public.students enable row level security;

create policy "students_select_own_school"
on public.students
for select
to authenticated
using (
  school_id in (
    select school_id
    from public.user_profiles
    where user_id = (select auth.uid())
  )
);

create policy "students_insert_own_school"
on public.students
for insert
to authenticated
with check (
  school_id in (
    select school_id
    from public.user_profiles
    where user_id = (select auth.uid())
  )
);

create policy "students_update_own_school"
on public.students
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

create policy "students_delete_school_admin_only"
on public.students
for delete
to authenticated
using (
  exists (
    select 1
    from public.user_profiles
    where user_profiles.user_id = (select auth.uid())
      and user_profiles.role = 'school_admin'
      and user_profiles.school_id = students.school_id
  )
);


-- =========================================
-- TEACHERS
-- =========================================

do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'teachers'
  loop
    execute format('drop policy %I on public.teachers', pol.policyname);
  end loop;
end $$;

alter table public.teachers enable row level security;

create policy "teachers_select_own_school"
on public.teachers
for select
to authenticated
using (
  school_id in (
    select school_id
    from public.user_profiles
    where user_id = (select auth.uid())
  )
);

create policy "teachers_insert_own_school"
on public.teachers
for insert
to authenticated
with check (
  school_id in (
    select school_id
    from public.user_profiles
    where user_id = (select auth.uid())
  )
);

create policy "teachers_update_own_school"
on public.teachers
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

create policy "teachers_delete_school_admin_only"
on public.teachers
for delete
to authenticated
using (
  exists (
    select 1
    from public.user_profiles
    where user_profiles.user_id = (select auth.uid())
      and user_profiles.role = 'school_admin'
      and user_profiles.school_id = teachers.school_id
  )
);


-- =========================================
-- CLASSROOMS
-- =========================================

do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'classrooms'
  loop
    execute format('drop policy %I on public.classrooms', pol.policyname);
  end loop;
end $$;

alter table public.classrooms enable row level security;

create policy "classrooms_select_own_school"
on public.classrooms
for select
to authenticated
using (
  school_id in (
    select school_id
    from public.user_profiles
    where user_id = (select auth.uid())
  )
);

create policy "classrooms_insert_own_school"
on public.classrooms
for insert
to authenticated
with check (
  school_id in (
    select school_id
    from public.user_profiles
    where user_id = (select auth.uid())
  )
);

create policy "classrooms_update_own_school"
on public.classrooms
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

create policy "classrooms_delete_school_admin_only"
on public.classrooms
for delete
to authenticated
using (
  exists (
    select 1
    from public.user_profiles
    where user_profiles.user_id = (select auth.uid())
      and user_profiles.role = 'school_admin'
      and user_profiles.school_id = classrooms.school_id
  )
);

commit;
