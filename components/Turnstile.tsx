'use client'

import { useEffect, useRef } from 'react'

// Renders a Cloudflare Turnstile widget and returns its token via onToken().
// The token is single-use; remount this component (e.g. change its `key`)
// to get a fresh one after a failed submit.

const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

type Props = {
  siteKey: string
  onToken: (token: string) => void
}

export function Turnstile({ siteKey, onToken }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Keep the latest callback without re-running the effect.
  const cb = useRef(onToken)
  cb.current = onToken

  useEffect(() => {
    let widgetId: string | undefined
    let poll: ReturnType<typeof setInterval> | undefined

    function render() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const turnstile = (window as any).turnstile
      if (!turnstile || !containerRef.current || widgetId !== undefined) return
      widgetId = turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => cb.current(token),
        'expired-callback': () => cb.current(''),
        'error-callback': () => cb.current(''),
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).turnstile) {
      render()
    } else {
      if (!document.getElementById(SCRIPT_ID)) {
        const s = document.createElement('script')
        s.id = SCRIPT_ID
        s.src = SCRIPT_SRC
        s.async = true
        s.defer = true
        document.head.appendChild(s)
      }
      poll = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).turnstile) {
          if (poll) clearInterval(poll)
          render()
        }
      }, 200)
    }

    return () => {
      if (poll) clearInterval(poll)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const turnstile = (window as any).turnstile
      if (turnstile && widgetId !== undefined) {
        try {
          turnstile.remove(widgetId)
        } catch {
          /* ignore */
        }
      }
    }
  }, [siteKey])

  return <div ref={containerRef} style={{ marginTop: 4 }} />
}
