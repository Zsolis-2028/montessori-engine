'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{
      maxWidth: 600,
      margin: '80px auto',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        Montessori Engine
      </h1>

      <p style={{ fontSize: 18, marginBottom: 30, color: '#555' }}>
        A simple, modern tool for teachers to manage classrooms, students, and daily progress.
      </p>

      <Link href="/login">
        <button style={{
          padding: '12px 20px',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 16
        }}>
          Login
        </button>
      </Link>
    </div>
  )
}
