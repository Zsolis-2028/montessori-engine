-- ============================================================
-- RLS isolation test: real School A vs synthetic "Fake School B"
--
-- RAISE NOTICE output isn't visible in the Supabase SQL editor on
-- the free tier, and a DO block can't return rows to the Results
-- grid at all. So this test is a real (temporary) SQL function:
-- it's created, called once with a plain SELECT so its output
-- lands in the Results grid as a normal PASS/FAIL table, then
-- dropped. Unlike a temp table, the function is genuine catalog
-- state, so it survives even if the editor routes these three
-- statements to different pooled connections.
--
-- All the actual test data (seeded fixture rows, the temporary
-- role flip) still gets rolled back automatically: the function
-- deliberately raises an exception at the end of its work, and
-- PL/pgSQL's exception handler undoes everything via an implicit
-- savepoint before the results are returned. No real data changes
-- and nothing is left behind except the helper function itself,
-- which the final statement drops.
--
-- Run all three statements together. Read results in the Results
-- grid, not the Notices panel.
-- ============================================================

create or replace function public._rls_isolation_test()
returns table (step text, expected text, actual text, passed boolean)
language plpgsql
as $$
declare
  v_results jsonb := '[]'::jsonb;
  v_school_id_type text;
  v_real_school_id text;
  v_real_user_id text;
  v_school_b text;
  v_classroom_b_id text;
  v_teacher_b_id text;
  v_student_b_id text;
  v_student_a_id text;
  v_original_role text;
  cnt int;
  affected int;
begin
  if not exists (select 1 from public.user_profiles) then
    raise exception 'No rows in public.user_profiles yet — log into the app at least once so there is a real School A tenant to test against.';
  end if;

  -- Pull a real School A tenant + member (single row, so both values are consistent)
  select school_id::text, user_id::text
  into v_real_school_id, v_real_user_id
  from public.user_profiles
  limit 1;

  select role into v_original_role
  from public.user_profiles
  where user_id::text = v_real_user_id;

  v_results := v_results || jsonb_build_object(
    'step', 'setup: school A test context',
    'expected', 'n/a',
    'actual', format('user=%s, school_id=%s, original_role=%s', v_real_user_id, v_real_school_id, coalesce(v_original_role, '(null)')),
    'passed', null
  );

  -- Detect the real data type of school_id and build a fake School B value shaped to match
  select data_type into v_school_id_type
  from information_schema.columns
  where table_schema = 'public' and table_name = 'students' and column_name = 'school_id';

  v_results := v_results || jsonb_build_object(
    'step', 'detected school_id column type',
    'expected', 'n/a',
    'actual', coalesce(v_school_id_type, '(not found)'),
    'passed', null
  );

  if v_school_id_type = 'uuid' then
    v_school_b := '00000000-0000-0000-0000-0000000000b2';
  elsif v_school_id_type in ('integer', 'bigint', 'smallint', 'numeric') then
    v_school_b := '999999999';
  else
    v_school_b := 'fake-school-b-rls-test';
  end if;

  -- If a separate schools table exists, give Fake School B a row so any FK is satisfied
  if to_regclass('public.schools') is not null then
    execute format(
      'insert into public.schools (id, name) values (%L, %L) on conflict do nothing',
      v_school_b, 'Fake School B (RLS test)'
    );
  end if;

  -- Seed fixture rows as postgres (RLS bypassed). Inserts go through dynamic SQL so the
  -- text literal is coerced into whatever the real column type actually is.
  execute format(
    'insert into public.classrooms (name, school_id) values (%L, %L) returning id::text',
    'RLS test classroom - School B', v_school_b
  ) into v_classroom_b_id;

  execute format(
    'insert into public.teachers (name, classroom_id, school_id) values (%L, %L, %L) returning id::text',
    'RLS test teacher - School B', v_classroom_b_id, v_school_b
  ) into v_teacher_b_id;

  execute format(
    'insert into public.students (name, school_id) values (%L, %L) returning id::text',
    'RLS test student - School B', v_school_b
  ) into v_student_b_id;

  execute format(
    'insert into public.students (name, school_id) values (%L, %L) returning id::text',
    'RLS test student - School A fixture', v_real_school_id
  ) into v_student_a_id;

  -- ============================================================
  -- From here on, act as the real School A user (non-admin first)
  -- ============================================================
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', v_real_user_id, 'role', 'authenticated')::text,
    true
  );
  execute 'set local role authenticated';

  select count(*) into cnt from public.students where school_id::text = v_school_b;
  v_results := v_results || jsonb_build_object(
    'step', 'School A user selects School B students', 'expected', '0', 'actual', cnt::text, 'passed', cnt = 0
  );

  select count(*) into cnt from public.teachers where school_id::text = v_school_b;
  v_results := v_results || jsonb_build_object(
    'step', 'School A user selects School B teachers', 'expected', '0', 'actual', cnt::text, 'passed', cnt = 0
  );

  select count(*) into cnt from public.classrooms where school_id::text = v_school_b;
  v_results := v_results || jsonb_build_object(
    'step', 'School A user selects School B classrooms', 'expected', '0', 'actual', cnt::text, 'passed', cnt = 0
  );

  -- INSERT block (with-check violation raises a hard error — caught here)
  begin
    execute format(
      'insert into public.students (name, school_id) values (%L, %L)',
      'should be blocked', v_school_b
    );
    v_results := v_results || jsonb_build_object(
      'step', 'School A user inserts a School B student', 'expected', 'insert blocked', 'actual', 'insert succeeded', 'passed', false
    );
  exception when others then
    v_results := v_results || jsonb_build_object(
      'step', 'School A user inserts a School B student', 'expected', 'insert blocked', 'actual', 'blocked: ' || sqlerrm, 'passed', true
    );
  end;

  -- UPDATE block (row not visible -> 0 rows affected, no error)
  update public.students set name = 'hacked by school A' where id::text = v_student_b_id;
  get diagnostics affected = row_count;
  v_results := v_results || jsonb_build_object(
    'step', 'School A user updates a School B student', 'expected', '0', 'actual', affected::text, 'passed', affected = 0
  );

  -- DELETE as non-admin: cross-school target
  delete from public.students where id::text = v_student_b_id;
  get diagnostics affected = row_count;
  v_results := v_results || jsonb_build_object(
    'step', 'Non-admin School A user deletes a School B student', 'expected', '0', 'actual', affected::text, 'passed', affected = 0
  );

  -- DELETE as non-admin: same-school target (delete is admin-only, so this should also fail)
  delete from public.students where id::text = v_student_a_id;
  get diagnostics affected = row_count;
  v_results := v_results || jsonb_build_object(
    'step', 'Non-admin School A user deletes own-school student (admin only)', 'expected', '0', 'actual', affected::text, 'passed', affected = 0
  );

  -- ============================================================
  -- Promote the test user to school_admin (as postgres) and re-test delete
  -- ============================================================
  execute 'reset role';

  update public.user_profiles set role = 'school_admin' where user_id::text = v_real_user_id;

  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', v_real_user_id, 'role', 'authenticated')::text,
    true
  );
  execute 'set local role authenticated';

  delete from public.students where id::text = v_student_a_id;
  get diagnostics affected = row_count;
  v_results := v_results || jsonb_build_object(
    'step', 'school_admin deletes own-school student', 'expected', '1', 'actual', affected::text, 'passed', affected = 1
  );

  delete from public.students where id::text = v_student_b_id;
  get diagnostics affected = row_count;
  v_results := v_results || jsonb_build_object(
    'step', 'School A admin deletes School B student (should still be blocked)', 'expected', '0', 'actual', affected::text, 'passed', affected = 0
  );

  execute 'reset role';

  -- Intentional: force this entire function to roll back everything it did
  -- (seeded rows, role flip). Caught below, just before returning results.
  raise exception 'RLS_TEST_COMPLETE';

exception
  when others then
    if sqlerrm = 'RLS_TEST_COMPLETE' then
      v_results := v_results || jsonb_build_object(
        'step', 'cleanup',
        'expected', 'n/a',
        'actual', 'all fixture rows and the temporary role change were rolled back automatically',
        'passed', null
      );
    else
      v_results := v_results || jsonb_build_object(
        'step', 'ERROR', 'expected', 'n/a', 'actual', sqlerrm, 'passed', false
      );
    end if;

    return query
      select
        (elem ->> 'step')::text,
        (elem ->> 'expected')::text,
        (elem ->> 'actual')::text,
        (elem ->> 'passed')::boolean
      from jsonb_array_elements(v_results) with ordinality as t(elem, ord)
      order by ord;
end;
$$;

select * from public._rls_isolation_test();

drop function public._rls_isolation_test();
