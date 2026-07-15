'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getCurrentSchoolProfile } from '@/lib/supabase/profile'
import { colors } from '@/lib/theme'
import { TopBar } from '@/components/TopBar'
import {
  MONTESSORI_AREAS,
  STATUS_LABELS,
  STATUS_COLORS,
  type ProgressStatus,
} from '@/lib/montessori'

type Student = {
  id: string
  name: string
}

type ProgressRow = {
  id: string
  student_id: string
  area: string
  material: string
  status: ProgressStatus
  updated_at: string
}

export default function ReportsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [rows, setRows] = useState<ProgressRow[]>([])
  const [openStudents, setOpenStudents] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function loadData() {
      const profile = await getCurrentSchoolProfile()

      if (profile.status === 'unauthenticated') {
        router.push('/login')
        return
      }

      if (profile.status === 'missing-profile') {
        setProfileError(
          'Your school profile is missing. Please contact an admin.'
        )
        setLoading(false)
        return
      }

      const { data: studentData, error: studentErr } = await supabase
        .from('students')
        .select('id, name')
        .eq('school_id', profile.schoolId)
        .order('name', { ascending: true })

      if (studentErr) {
        console.error('Error loading students:', studentErr)
      } else {
        setStudents((studentData as Student[]) || [])
      }

      const { data: progressData, error: progressErr } = await supabase
        .from('student_progress')
        .select('id, student_id, area, material, status, updated_at')
        .eq('school_id', profile.schoolId)
        .order('updated_at', { ascending: false })

      if (progressErr) {
        console.error('Error loading progress:', progressErr)
      } else {
        setRows((progressData as ProgressRow[]) || [])
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  const nameById = useMemo(() => {
    const map: Record<string, string> = {}
    for (const s of students) map[s.id] = s.name || 'Unnamed Student'
    return map
  }, [students])

  const perStudent = useMemo(() => {
    const map: Record<
      string,
      {
        introduced: number
        practicing: number
        mastered: number
        areas: Set<string>
        total: number
      }
    > = {}
    for (const s of students) {
      map[s.id] = {
        introduced: 0,
        practicing: 0,
        mastered: 0,
        areas: new Set(),
        total: 0,
      }
    }
    for (const row of rows) {
      const entry = map[row.student_id]
      if (!entry) continue
      entry[row.status] += 1
      entry.areas.add(row.area)
      entry.total += 1
    }
    return map
  }, [students, rows])

  function toggleStudent(id: string) {
    setOpenStudents((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const recent = rows.slice(0, 12)
  const totalTracked = rows.length
  const totalMastered = rows.filter((r) => r.status === 'mastered').length

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg }}>
        <TopBar />
        <p style={{ padding: 24 }}>Loading reports...</p>
      </div>
    )
  }

  if (profileError) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg }}>
        <TopBar />
        <p style={{ padding: 24 }}>{profileError}</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <TopBar />
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          fontFamily: 'Arial, sans-serif',
          padding: 24,
        }}
      >
        <div style={cardStyle}>
          <h1 style={{ margin: 0, color: colors.navy }}>Development Tracking</h1>
          <p style={{ color: '#64748b', marginTop: 8 }}>
            A school-wide view of every student&rsquo;s Montessori progress and
            recent activity.
          </p>
          <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
            <Stat label="Students" value={students.length} />
            <Stat label="Materials tracked" value={totalTracked} />
            <Stat label="Mastered" value={totalMastered} />
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, color: colors.navy }}>Student Overview</h2>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 0 }}>
            Tap a student to expand their detail.
          </p>
          {students.length === 0 ? (
            <p style={{ margin: 0 }}>
              No students yet. Add students on the Students page (under Manage) to
              begin tracking development.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {students.map((s) => {
                const d = perStudent[s.id]
                const isOpen = !!openStudents[s.id]
                const workingAreas = MONTESSORI_AREAS.filter((a) =>
                  d.areas.has(a)
                )
                return (
                  <div
                    key={s.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => toggleStudent(s.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 12,
                        padding: 16,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        flexWrap: 'wrap',
                      }}
                    >
                      <strong
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 10,
                          color: colors.navy,
                          fontSize: 16,
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>
                          {isOpen ? '▼' : '▶'}
                        </span>
                        {s.name || 'Unnamed Student'}
                      </strong>
                      <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <Pill
                          color={STATUS_COLORS.introduced}
                          label={`${d.introduced} Introduced`}
                        />
                        <Pill
                          color={STATUS_COLORS.practicing}
                          label={`${d.practicing} Practicing`}
                          dark
                        />
                        <Pill
                          color={STATUS_COLORS.mastered}
                          label={`${d.mastered} Mastered`}
                        />
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 16px 16px' }}>
                        <span
                          style={{
                            fontSize: 13,
                            color: '#64748b',
                            marginRight: 8,
                          }}
                        >
                          Working in:
                        </span>
                        {workingAreas.length === 0 ? (
                          <span style={{ fontSize: 13, color: '#94a3b8' }}>
                            No areas started yet
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              gap: 6,
                              flexWrap: 'wrap',
                            }}
                          >
                            {workingAreas.map((a) => (
                              <span
                                key={a}
                                style={{
                                  background: '#eef2ff',
                                  color: colors.navy,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  padding: '3px 9px',
                                  borderRadius: 999,
                                }}
                              >
                                {a}
                              </span>
                            ))}
                          </span>
                        )}
                        <p
                          style={{
                            margin: '10px 0 0',
                            fontSize: 13,
                            color: '#94a3b8',
                          }}
                        >
                          {d.total} material{d.total === 1 ? '' : 's'} tracked in
                          total.
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, color: colors.navy }}>Recent Activity</h2>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 0 }}>
            Latest progress updates. Saved observation notes will also appear
            here once per-student observation saving is enabled.
          </p>
          {recent.length === 0 ? (
            <p style={{ margin: 0 }}>No progress recorded yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {recent.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ color: colors.navy }}>
                    <strong>{nameById[r.student_id] ?? 'Student'}</strong>
                    <span style={{ color: '#64748b' }}>
                      {' '}
                      &middot; {r.area} &middot; {r.material}
                    </span>
                  </span>
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <Pill
                      color={STATUS_COLORS[r.status]}
                      label={STATUS_LABELS[r.status]}
                      dark={r.status === 'practicing'}
                    />
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>
                      {formatDate(r.updated_at)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, color: colors.navy }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
    </div>
  )
}

function Pill({
  color,
  label,
  dark,
}: {
  color: string
  label: string
  dark?: boolean
}) {
  return (
    <span
      style={{
        background: color,
        color: dark ? '#1a2444' : 'white',
        fontSize: 12,
        fontWeight: 600,
        padding: '4px 10px',
        borderRadius: 999,
      }}
    >
      {label}
    </span>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: 16,
  padding: 24,
  marginBottom: 24,
  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
}
