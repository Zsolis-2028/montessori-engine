'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { colors } from '@/lib/theme'
import { TopBar } from '@/components/TopBar'
import { sanitizeInput } from '@/lib/sanitize'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: fnError } = await supabase.functions.invoke('create-school-profile', {
      body: {
        name: sanitizeInput(name).slice(0, 150),
        schoolName: sanitizeInput(schoolName).slice(0, 150),
        email,
        password,
      },
    })

    if (fnError || !data?.success) {
      setError(data?.error ?? fnError?.message ?? 'Signup failed. Please try again.')
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('Account created — please log in.')
      setLoading(false)
      router.push('/login')
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
          <h1 style={{ marginTop: 0, marginBottom: 4, color: colors.navy }}>Create Account</h1>
          <p style={{ marginTop: 0, marginBottom: 20, color: colors.textMuted, fontSize: 14 }}>
            Start your 30-day free trial
          </p>

          <form
            onSubmit={handleSignup}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={150}
              style={{ padding: 10, border: `1px solid ${colors.border}`, borderRadius: 4 }}
            />

            <label>School Name</label>
            <input
              type="text"
              placeholder="Sunrise Montessori"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
              maxLength={150}
              style={{ padding: 10, border: `1px solid ${colors.border}`, borderRadius: 4 }}
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="jane@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: 10, border: `1px solid ${colors.border}`, borderRadius: 4 }}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: 10, border: `1px solid ${colors.border}`, borderRadius: 4 }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: 10,
                background: colors.gold,
                color: colors.navy,
                border: 'none',
                borderRadius: 4,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 10,
                fontWeight: 600,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

          <p style={{ marginTop: 16, fontSize: 13, color: colors.textMuted, textAlign: 'center' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: colors.navy, fontWeight: 600 }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
