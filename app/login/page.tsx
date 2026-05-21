'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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
    <div style={{ maxWidth: 400, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 20 }}>Login</h1>

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
          style={{ padding: 10, border: '1px solid #ccc', borderRadius: 4 }}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, border: '1px solid #ccc', borderRadius: 4 }}
        />

        <button
          type="submit"
          style={{
            padding: 10,
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            marginTop: 10,
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
    </div>
  )
}

