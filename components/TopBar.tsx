'use client'

import { colors } from '@/lib/theme'

export function TopBar() {
  return (
    <header
      style={{
        background: colors.navy,
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
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
    </header>
  )
}
