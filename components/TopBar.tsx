'use client'
import { colors } from '@/lib/theme'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

export function TopBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Generate', href: '/activities' },
    { label: 'Observations', href: '/observations' },
    { label: 'Daily Planner', href: '/daily-planner' },
    { label: 'My Activities', href: '/dashboard/my-activities' },
    { label: 'Dashboard', href: '/dashboard' },
  ]

  return (
    <header style={{ background: colors.navy, padding: '14px 24px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors.gold, display: 'inline-block' }} />
          <strong style={{ color: '#fff', fontSize: 18 }}>Montessori Engine</strong>
        </div>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 14,
                  background: isActive ? colors.gold : 'transparent',
                  color: isActive ? colors.navy : 'rgba(255,255,255,0.8)',
                }}
              >
                {link.label}
              </button>
            )
          })}
        </nav>

        {/* Hamburger button - mobile only */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'none',
            flexDirection: 'column',
            gap: 5,
            padding: 4,
          }}
        >
          <span style={{ display: 'block', width: 24, height: 2, background: '#fff' }} />
          <span style={{ display: 'block', width: 24, height: 2, background: '#fff' }} />
          <span style={{ display: 'block', width: 24, height: 2, background: '#fff' }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: colors.navy,
          padding: '8px 0',
          zIndex: 100,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <button
                key={link.href}
                onClick={() => { router.push(link.href); setMenuOpen(false) }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 24px',
                  background: isActive ? colors.gold : 'transparent',
                  color: isActive ? colors.navy : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 15,
                }}
              >
                {link.label}
              </button>
            )
          })}
        </nav>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  )
}