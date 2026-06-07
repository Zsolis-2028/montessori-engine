'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }

      setLoading(false)
    }

    loadUser()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const cards = [
    {
      title: 'Generate Activity',
      description: 'Create a Montessori lesson idea using age, domain, and material.',
      path: '/activities',
    },
    {
      title: 'My Activities',
      description: 'View saved AI-generated lessons and reuse them later.',
      path: '/dashboard/my-activities',
    },
    {
      title: 'Students',
      description: 'Manage student records and classroom assignments.',
      path: '/dashboard/students',
    },
    {
      title: 'Teachers',
      description: 'Manage teacher records and classroom assignments.',
      path: '/dashboard/teachers',
    },
    {
      title: 'Classrooms',
      description: 'Manage Montessori classroom groups.',
      path: '/dashboard/classrooms',
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
        background: '#f8fafc',
        fontFamily: 'Arial, sans-serif',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: 28,
            marginBottom: 24,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}
        >
          <h1 style={{ margin: 0, fontSize: 32 }}>
            Montessori Engine
          </h1>

          <p style={{ color: '#475569', marginTop: 8 }}>
            Welcome, {user?.email}
          </p>

          <p style={{ color: '#64748b', maxWidth: 650 }}>
            Teacher tools for Montessori lesson planning, saved activities,
            classroom records, and future observation notes.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {cards.map((card) => (
            <button
              key={card.title}
              onClick={() => router.push(card.path)}
              style={{
                textAlign: 'left',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: 20,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20 }}>
                {card.title}
              </h2>

              <p style={{ color: '#64748b', marginTop: 8, lineHeight: 1.5 }}>
                {card.description}
              </p>
            </button>
          ))}
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