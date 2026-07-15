import { supabase } from './client'

export type UserRole = 'school_admin' | 'teacher'

export type SchoolPlan = 'trial' | 'school' | 'district'

export type SchoolProfileResult =
  | {
      status: 'ok'
      userId: string
      schoolId: string
      role: UserRole
      schoolName: string | null
      plan: SchoolPlan
    }
  | { status: 'unauthenticated' }
  | { status: 'missing-profile' }

export async function getCurrentSchoolProfile(): Promise<SchoolProfileResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { status: 'unauthenticated' }
  }

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('school_id, role, schools(name, plan)')
    .eq('user_id', user.id)
    .single()

  if (error || !profile?.school_id || !profile?.role) {
    return { status: 'missing-profile' }
  }

  const school = profile.schools as unknown as {
    name: string
    plan: string | null
  } | null

  const rawPlan = school?.plan ?? 'trial'
  const plan: SchoolPlan =
    rawPlan === 'school' || rawPlan === 'district' ? rawPlan : 'trial'

  return {
    status: 'ok',
    userId: user.id,
    schoolId: profile.school_id,
    role: profile.role as UserRole,
    schoolName: school?.name ?? null,
    plan,
  }
}
