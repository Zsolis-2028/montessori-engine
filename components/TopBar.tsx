'use client'
import { colors } from '@/lib/theme'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function TopBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)
  const manageRef = useRef<HTMLDivElement>(null)

  // Primary tools shown directly in the nav.
  const navLinks = [
    { label: 'Generate', href: '/activities' },
    { label: 'Observations', href: '/observations' },
    { label: 'Daily Planner', href: '/daily-planner' },
    { label: 'My Activities', href: '/dashboard/my-activities' },
    { label: 'Progress', href: '/dashboard/progress' },
    { label: 'Reports', href: '/dashboard/reports' },
  ]

  // Setup pages grouped under a single "Manage" dropdown to keep the nav clean.
  const manageLinks = [
    { label: 'Students', href: '/dashboard/students' },
    { label: 'Classrooms', href: '/dashboard/classrooms' },
    { label: 'Teachers', href: '/dashboard/teachers' },
  ]

  const dashboardLink = { label: 'Dashboard', href: '/dashboard' }
  const manageActive = manageLinks.some((l) => pathname === l.href)

  // Close the Manage dropdown when clicking anywhere outside it.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (manageRef.current && !manageRef.current.contains(e.target as Node)) {
        setManageOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  function go(href: string) {
    router.push(href)
    setMenuOpen(false)
    setManageOpen(false)
  }

  function navBtnStyle(active: boolean): React.CSSProperties {
    return {
      padding: '8px 16px',
      borderRadius: 6,
      border: 'none',
      cursor: 'pointer',
      fontWeight: active ? 700 : 500,
      fontSize: 14,
      background: active ? colors.gold : 'transparent',
      color: active ? colors.navy : 'rgba(255,255,255,0.8)',
      whiteSpace: 'nowrap',
    }
  }

  return (
    <header style={{ background: colors.navy, padding: '14px 24px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors.gold, display: 'inline-block' }} />
          <strong style={{ color: '#fff', fontSize: 18 }}>Montessori Engine</strong>
        </div>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="desktop-nav">
          {navLinks.map((link) => (
            <button key={link.href} onClick={() => go(link.href)} style={navBtnStyle(pathname === link.href)}>
              {link.label}
            </button>
          ))}

          {/* Manage dropdown */}
          <div ref={manageRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setManageOpen((o) => !o)}
              style={{ ...navBtnStyle(manageActive), display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              Manage
              <span style={{ fontSize: 10, opacity: 0.8 }}>{manageOpen ? '▲' : '▼'}</span>
            </button>

            {manageOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  background: '#fff',
                  borderRadius: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  padding: 6,
                  minWidth: 170,
                  zIndex: 200,
                }}
              >
                {manageLinks.map((link) => {
                  const active = pathname === link.href
                  return (
                    <button
                      key={link.href}
                      onClick={() => go(link.href)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: active ? 700 : 500,
                        background: active ? colors.gold : 'transparent',
                        color: colors.navy,
                      }}
                    >
                      {link.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <button onClick={() => go(dashboardLink.href)} style={navBtnStyle(pathname === dashboardLink.href)}>
            {dashboardLink.label}
          </button>
        </nav>

        {/* Hamburger - mobile only */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'none', flexDirection: 'column', gap: 5, padding: 4 }}
        >
          <span style={{ display: 'block', width: 24, height: 2, background: '#fff' }} />
          <span style={{ display: 'block', width: 24, height: 2, background: '#fff' }} />
          <span style={{ display: 'block', width: 24, height: 2, background: '#fff' }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: colors.navy,
            padding: '8px 0',
            zIndex: 100,
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {navLinks.map((link) => (
            <button key={link.href} onClick={() => go(link.href)} style={mobileItemStyle(pathname === link.href)}>
              {link.label}
            </button>
          ))}

          <div style={{ padding: '10px 24px 4px', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            Manage
          </div>
          {manageLinks.map((link) => (
            <button key={link.href} onClick={() => go(link.href)} style={{ ...mobileItemStyle(pathname === link.href), paddingLeft: 36 }}>
              {link.label}
            </button>
          ))}

          <button onClick={() => go(dashboardLink.href)} style={mobileItemStyle(pathname === dashboardLink.href)}>
            {dashboardLink.label}
          </button>
        </nav>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  )
}

function mobileItemStyle(active: boolean): React.CSSProperties {
  return {
    display: 'block',
    width: '100%',
    padding: '12px 24px',
    background: active ? colors.gold : 'transparent',
    color: active ? colors.navy : '#fff',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: active ? 700 : 500,
    fontSize: 15,
  }
}
