'use client'

import Link from 'next/link'
import { colors } from '@/lib/theme'

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.navy,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: 24 }}>
        <h1 style={{ fontSize: 36, marginBottom: 20, color: '#fff' }}>
          Montessori Engine
        </h1>

        <p style={{ fontSize: 18, marginBottom: 30, color: '#cbd5e1' }}>
          A simple, modern tool for teachers to manage classrooms, students, and daily progress.
        </p>

        <Link href="/login">
          <button
            style={{
              padding: '12px 20px',
              background: colors.gold,
              color: colors.navy,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Login
          </button>
        </Link>
      </div>
    </div>
  )
}
