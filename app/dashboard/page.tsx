'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import {
  getCurrentSchoolProfile,
  type UserRole,
  type SchoolPlan,
} from '@/lib/supabase/profile'
import styles from './dashboard.module.css'
import {
  SparkleIcon,
  BookmarkIcon,
  ProgressIcon,
  ReportIcon,
  LockIcon,
} from './icons'

function getInitials(email?: string | null) {
  if (!email) return '?'
  return email.split('@')[0].slice(0, 2).toUpperCase()
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [plan, setPlan] = useState<SchoolPlan>('trial')
  const [loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
        return
      }

      setUser(data.user)

      const profile = await getCurrentSchoolProfile()

      if (profile.status === 'missing-profile') {
        setProfileError(
          'Your school profile is missing. Please contact an admin.'
        )
      } else if (profile.status === 'ok') {
        setRole(profile.role)
        setSchoolName(profile.schoolName)
        setPlan(profile.plan)
      }

      setLoading(false)
    }

    loadUser()
  }, [router])

  const isAdmin = role === 'school_admin'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const hasSchoolPlan = plan === 'school' || plan === 'district'

  // ── Paid-feature gating (TEMPORARILY OFF) ────────────────────────────────
  // Progress Tracking and Reports are open to EVERYONE for now, because there
  // is no billing or trial-expiry system yet — locking features we can't charge
  // for or enforce would only give early users less value.
  //
  // WHEN YOU LAND YOUR FIRST PAYING CUSTOMER, do all three of these together:
  //   1. Flip GATE_PAID_FEATURES to true (re-locks the cards below by plan).
  //   2. Add the same plan check to app/dashboard/progress/page.tsx and
  //      app/dashboard/reports/page.tsx (redirect non-paid plans to /dashboard).
  //   3. Hide the Progress/Reports links in components/TopBar.tsx for non-paid plans.
  // (Also decide by then whether the $29 Individual plan includes these.)
  const GATE_PAID_FEATURES = false
  const lockPaid = GATE_PAID_FEATURES && !hasSchoolPlan

  type DashboardCard = {
    title: string
    description: string
    path: string
    icon: typeof SparkleIcon
    variant: 'gold' | 'default'
    locked?: boolean
  }

  const cards: DashboardCard[] = [
    {
      title: 'Generate Activity',
      description: 'Create a Montessori lesson idea using age, domain, and material.',
      path: '/activities',
      icon: SparkleIcon,
      variant: 'gold',
    },
    {
      title: 'My Activities',
      description: 'View saved AI-generated lessons and reuse them later.',
      path: '/dashboard/my-activities',
      icon: BookmarkIcon,
      variant: 'default',
    },
    {
      title: 'Progress Tracking',
      description: 'Track each student across Practical Life, Sensorial, Math, Language, and Cultural.',
      path: '/dashboard/progress',
      icon: ProgressIcon,
      variant: 'default',
      locked: lockPaid,
    },
    {
      title: 'Reports',
      description: 'A school-wide view of student progress and recent activity.',
      path: '/dashboard/reports',
      icon: ReportIcon,
      variant: 'default',
      locked: lockPaid,
    },
  ]

  if (loading) {
    return (
      <p style={{ fontFamily: 'sans-serif', padding: 24 }}>
        Loading...
      </p>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <header style={{ background: 'var(--color-navy)' }}>
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--color-gold)',
                display: 'inline-block',
              }}
            />
            <strong style={{ color: '#fff', fontSize: 18 }}>
              Montessori Engine
            </strong>
          </div>

          {!profileError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#cbd5e1', fontSize: 14 }}>
                {schoolName ?? 'Unknown school'}
              </span>
              <span
                style={{
                  background: 'var(--color-navy-muted)',
                  color: 'var(--color-gold)',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 999,
                }}
              >
                {isAdmin ? 'School Admin' : 'Teacher'}
              </span>
            </div>
          )}
        </div>
      </header>

      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: 24,
        }}
      >
        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 16,
            padding: 28,
            marginBottom: 24,
            display: 'flex',
            gap: 18,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              flexShrink: 0,
              borderRadius: '50%',
              background: 'var(--color-navy)',
              color: 'var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {getInitials(user?.email)}
          </div>

          <div>
            <p style={{ color: 'var(--color-navy)', margin: 0, fontSize: 18, fontWeight: 600 }}>
              Welcome, {user?.email}
            </p>

            {!profileError && (
              <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>
                {schoolName ?? 'Unknown school'} &middot;{' '}
                {isAdmin ? 'School Admin' : 'Teacher'}
              </p>
            )}

            {profileError && (
              <p style={{ color: '#b91c1c', marginTop: 4 }}>{profileError}</p>
            )}

            <p style={{ color: 'var(--color-text-muted)', maxWidth: 650 }}>
              AI tools for activity planning, observation notes, and daily planning.
            </p>

          </div>
        </div>

        <div className={styles.cardGrid}>
          {cards.map((card) => {
            const Icon = card.icon
            const isGold = card.variant === 'gold'

            if (card.locked) {
              return (
                <div
                  key={card.title}
                  style={{
                    position: 'relative',
                    textAlign: 'left',
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-gold)',
                    borderRadius: 14,
                    padding: 20,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'var(--color-gold)',
                      color: 'var(--color-navy)',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 999,
                    }}
                  >
                    <LockIcon /> School plan
                  </span>

                  <div style={{ color: 'var(--color-navy)' }}>
                    <Icon />
                  </div>

                  <h2
                    style={{
                      margin: '10px 0 0',
                      fontSize: 20,
                      color: 'var(--color-navy)',
                    }}
                  >
                    {card.title}
                  </h2>

                  <p
                    style={{
                      color: 'var(--color-text-muted)',
                      marginTop: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    {card.description}
                  </p>

                  <div
                    style={{
                      marginTop: 14,
                      padding: '10px 12px',
                      background: 'var(--color-navy)',
                      borderRadius: 10,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: 'var(--color-gold)',
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      Included with the School plan
                    </p>
                    <p
                      style={{
                        margin: '4px 0 0',
                        color: '#cbd5e1',
                        fontSize: 12,
                        lineHeight: 1.4,
                      }}
                    >
                      See every student&rsquo;s progress across all five
                      Montessori areas. Contact us to unlock it for your school.
                    </p>
                  </div>
                </div>
              )
            }

            return (
              <button
                key={card.title}
                onClick={() => router.push(card.path)}
                style={{
                  textAlign: 'left',
                  background: isGold ? 'var(--color-gold)' : 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 14,
                  padding: 20,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ color: 'var(--color-navy)' }}>
                  <Icon />
                </div>

                <h2
                  style={{
                    margin: '10px 0 0',
                    fontSize: 20,
                    color: isGold ? 'var(--color-navy)' : '#111827',
                  }}
                >
                  {card.title}
                </h2>

                <p
                  style={{
                    color: isGold ? 'var(--color-navy)' : 'var(--color-text-muted)',
                    marginTop: 8,
                    lineHeight: 1.5,
                  }}
                >
                  {card.description}
                </p>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: 24,
            padding: '12px 18px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
