'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { colors } from '@/lib/theme'
import { TopBar } from '@/components/TopBar'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, fontFamily: 'sans-serif' }}>
      <TopBar />

      <div style={{ maxWidth: 400, margin: '50px auto', padding: '0 24px' }}>
        <div
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: 28,
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: 20, color: colors.navy }}>Login</h1>

          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: 10, border: `1px solid ${colors.border}`, borderRadius: 4 }}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: 10, border: `1px solid ${colors.border}`, borderRadius: 4 }}
            />

            <button
              type="submit"
              style={{
                padding: 10,
                background: colors.gold,
                color: colors.navy,
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                marginTop: 10,
                fontWeight: 600,
              }}
            >
              Login
            </button>
          </form>

          {error && (
            <p style={{ color: 'red', marginTop: 10 }}>
              {error}
            </p>
          )}

          <p style={{ marginTop: 16, fontSize: 13, color: colors.textMuted, textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <a href="/signup" style={{ color: colors.navy, fontWeight: 600 }}>
              Start free trial
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
