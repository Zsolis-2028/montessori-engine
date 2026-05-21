'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
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

  if (loading) return <p style={{ fontFamily: 'sans-serif', padding: 20 }}>Loading...</p>

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      <button
        onClick={async () => {
          await supabase.auth.signOut()
          router.push('/login')
        }}
        style={{
          padding: 10,
          background: '#e00',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          marginTop: 20,
        }}
      >
        Logout
      </button>
    </div>
  )
}
