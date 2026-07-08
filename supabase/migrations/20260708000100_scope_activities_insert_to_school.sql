drop policy if exists "Teachers can insert their own activities" on public.activities;

create policy "Teachers can insert their own activities"
  on public.activities
  for insert
  to public
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.user_profiles
      where user_profiles.user_id = auth.uid()
        and user_profiles.school_id = activities.school_id
    )
  );
