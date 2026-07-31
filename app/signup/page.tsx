'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { colors } from '@/lib/theme'
import { TopBar } from '@/components/TopBar'
import { Turnstile } from '@/components/Turnstile'
import { sanitizeInput } from '@/lib/sanitize'

// Public site key. When unset (e.g. before you've configured Turnstile),
// the CAPTCHA is skipped so signup keeps working; it activates automatically
// once this env var and the matching secret in Supabase are set.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

type PlanType = 'organization' | 'individual'

export default function SignupPage() {
  const router = useRouter()
  const [planType, setPlanType] = useState<PlanType>('organization')
  const [name, setName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaKey, setCaptchaKey] = useState(0)

  const captchaEnabled = Boolean(TURNSTILE_SITE_KEY)

  function resetCaptcha() {
    setCaptchaToken('')
    setCaptchaKey((k) => k + 1)
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (captchaEnabled && !captchaToken) {
      setError('Please complete the verification below.')
      return
    }

    setLoading(true)
    setError('')

    const { data, error: fnError } = await supabase.functions.invoke('create-school-profile', {
      body: {
        name: sanitizeInput(name).slice(0, 150),
        schoolName: sanitizeInput(schoolName).slice(0, 150),
        email,
        password,
        captchaToken: captchaToken || undefined,
        planType,
      },
    })

    if (fnError || !data?.success) {
      setError(data?.error ?? fnError?.message ?? 'Signup failed. Please try again.')
      setLoading(false)
      if (captchaEnabled) resetCaptcha()
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

          <div style={{ marginBottom: 22 }}>
            <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: colors.navy, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              I am signing up as a...
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(
                [
                  {
                    value: 'organization' as const,
                    title: 'School or Organization',
                    subtitle: 'Unlimited teachers & classrooms',
                    price: '$200',
                  },
                  {
                    value: 'individual' as const,
                    title: 'Individual / Personal Use',
                    subtitle: 'Educators, homeschoolers & caregivers',
                    price: '$29',
                  },
                ]
              ).map((option) => {
                const selected = planType === option.value
                return (
                  <label
                    key={option.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '14px 16px',
                      border: `2px solid ${selected ? colors.gold : colors.border}`,
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: selected ? 'rgba(245,200,0,0.08)' : colors.card,
                      transition: 'border-color 0.15s ease, background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span
                        aria-hidden
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: `2px solid ${selected ? colors.navy : colors.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {selected && (
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors.navy }} />
                        )}
                      </span>
                      <input
                        type="radio"
                        name="planType"
                        value={option.value}
                        checked={selected}
                        onChange={() => setPlanType(option.value)}
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                      />
                      <span>
                        <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700, color: colors.navy }}>
                          {option.title}
                        </span>
                        <span style={{ display: 'block', fontSize: 12.5, color: colors.textMuted, marginTop: 1 }}>
                          {option.subtitle}
                        </span>
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: colors.navy,
                        background: selected ? colors.gold : colors.bg,
                        padding: '4px 10px',
                        borderRadius: 999,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {option.price}/mo
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

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

            <label>
              {planType === 'individual' ? 'Workspace name' : 'School name'}
            </label>
            <input
              type="text"
              placeholder={
                planType === 'individual'
                  ? 'e.g. Smith Family Homeschool'
                  : 'Sunrise Montessori'
              }
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

            {captchaEnabled && TURNSTILE_SITE_KEY && (
              <Turnstile
                key={captchaKey}
                siteKey={TURNSTILE_SITE_KEY}
                onToken={setCaptchaToken}
              />
            )}

            <button
              type="submit"
              disabled={loading || (captchaEnabled && !captchaToken)}
              style={{
                padding: 10,
                background: colors.gold,
                color: colors.navy,
                border: 'none',
                borderRadius: 4,
                cursor:
                  loading || (captchaEnabled && !captchaToken)
                    ? 'not-allowed'
                    : 'pointer',
                marginTop: 10,
                fontWeight: 600,
                opacity: loading || (captchaEnabled && !captchaToken) ? 0.7 : 1,
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
