'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { getCurrentSchoolProfile, type UserRole } from '@/lib/supabase/profile'
import styles from './dashboard.module.css'
import {
  SparkleIcon,
  BookmarkIcon,
  PersonIcon,
  GraduationCapIcon,
  BuildingIcon,
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

  const cards = [
    {
      title: 'Generate Activity',
      description: 'Create a Montessori lesson idea using age, domain, and material.',
      path: '/activities',
      icon: SparkleIcon,
      variant: 'gold' as const,
    },
    {
      title: 'My Activities',
      description: 'View saved AI-generated lessons and reuse them later.',
      path: '/dashboard/my-activities',
      icon: BookmarkIcon,
      variant: 'default' as const,
    },
    {
      title: 'Students',
      description: 'Manage student records and classroom assignments.',
      path: '/dashboard/students',
      icon: PersonIcon,
      variant: 'default' as const,
    },
    ...(isAdmin
      ? [
          {
            title: 'Teachers',
            description: 'Manage teacher records and classroom assignments.',
            path: '/dashboard/teachers',
            icon: GraduationCapIcon,
            variant: 'admin' as const,
          },
        ]
      : []),
    {
      title: 'Classrooms',
      description: 'Manage Montessori classroom groups.',
      path: '/dashboard/classrooms',
      icon: BuildingIcon,
      variant: 'default' as const,
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
              Teacher tools for Montessori lesson planning, saved activities,
              classroom records, and future observation notes.
            </p>

            <div
              style={{
                marginTop: 18,
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: 10,
                padding: 14,
                color: '#92400e',
              }}
            >
              <strong>Demo Tester Note:</strong>

              <p style={{ marginTop: 8, marginBottom: 0 }}>
                This is an early pilot version. Please use fake/demo student names only.
                Do not enter private student information yet.
              </p>

              <ul style={{ marginTop: 10, marginBottom: 0 }}>
                <li>Generate one activity</li>
                <li>Save the activity</li>
                <li>Open My Activities</li>
                <li>Export the activity as a PDF</li>
                <li>Send feedback on what was useful, confusing, or missing</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.cardGrid}>
          {cards.map((card) => {
            const Icon = card.icon
            const isGold = card.variant === 'gold'
            const isAdminCard = card.variant === 'admin'
            const ink = isGold ? 'var(--color-navy)' : 'var(--color-navy)'

            return (
              <button
                key={card.title}
                onClick={() => router.push(card.path)}
                style={{
                  position: 'relative',
                  textAlign: 'left',
                  background: isGold ? 'var(--color-gold)' : 'var(--color-card)',
                  border: isAdminCard
                    ? '2px solid var(--color-gold)'
                    : '1px solid var(--color-border)',
                  borderRadius: 14,
                  padding: 20,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }}
              >
                {isAdminCard && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: '#fdf6e3',
                      color: 'var(--color-navy)',
                      border: '1px solid var(--color-gold)',
                      borderRadius: 999,
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    <LockIcon size={11} />
                    Admin
                  </span>
                )}

                <div style={{ color: ink }}>
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
