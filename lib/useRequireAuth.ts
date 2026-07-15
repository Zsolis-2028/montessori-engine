'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

// Client-side auth guard: redirects to /login if there is no active session.
// Returns false until a logged-in user is confirmed, so pages can hold their
// content behind a loading state instead of flashing it to signed-out visitors.
//
// Note: the real protection lives in the edge functions, which reject any
// request without a valid user token. This guard is for UX and to avoid
// exposing the app shell to unauthenticated visitors.
export function useRequireAuth(): boolean {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      if (!data.user) {
        router.replace('/login')
      } else {
        setReady(true)
      }
    })
    return () => {
      active = false
    }
  }, [router])

  return ready
}
