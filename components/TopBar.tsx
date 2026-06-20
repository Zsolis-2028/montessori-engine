'use client'
import { colors } from '@/lib/theme'
import { useRouter, usePathname } from 'next/navigation'

export function TopBar() {
  const router = useRouter()
  const pathname = usePathname()

 const navLinks = [
  { label: 'Generate', href: '/activities' },
  { label: 'Observations', href: '/observations' },
  { label: 'My Activities', href: '/dashboard/my-activities' },
  { label: 'Dashboard', href: '/dashboard' },
]

  return (
    <header
      style={{
        background: colors.navy,
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: colors.gold,
            display: 'inline-block',
          }}
        />
        <strong style={{ color: '#fff', fontSize: 18 }}>Montessori Engine</strong>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
    </header>
  )
}