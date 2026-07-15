type IconProps = {
  size?: number
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function SparkleIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  )
}

export function BookmarkIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M6 3h12v18l-6-4-6 4V3Z" />
    </svg>
  )
}

export function PersonIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </svg>
  )
}

export function GraduationCapIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M12 4 2 9l10 5 10-5-10-5Z" />
      <path d="M6 11.5V17c0 1.4 2.7 3 6 3s6-1.6 6-3v-5.5" />
    </svg>
  )
}

export function BuildingIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M9 21v-4h6v4" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2" />
    </svg>
  )
}

export function ProgressIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 20v-6M12 20v-9M16 20v-4M20 20V8" />
    </svg>
  )
}

export function ReportIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  )
}

export function LockIcon({ size = 12 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}
