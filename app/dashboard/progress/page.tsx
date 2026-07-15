'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getCurrentSchoolProfile } from '@/lib/supabase/profile'
import { colors } from '@/lib/theme'
import { TopBar } from '@/components/TopBar'
import {
  MONTESSORI_AREAS,
  MATERIALS_BY_AREA,
  STATUS_ORDER,
  STATUS_LABELS,
  STATUS_COLORS,
  type MontessoriArea,
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

export default function ProgressPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState('')
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [rows, setRows] = useState<ProgressRow[]>([])
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [openAreas, setOpenAreas] = useState<Record<string, boolean>>({
    [MONTESSORI_AREAS[0]]: true,
  })

  const reloadProgress = useCallback(async (studentId: string) => {
    if (!studentId) {
      setRows([])
      return
    }
    const { data, error } = await supabase
      .from('student_progress')
      .select('id, student_id, area, material, status, updated_at')
      .eq('student_id', studentId)

    if (error) {
      console.error('Error loading progress:', error)
      return
    }
    setRows((data as ProgressRow[]) || [])
  }, [])

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

      setSchoolId(profile.schoolId)
      setUserId(profile.userId)

      const { data, error } = await supabase
        .from('students')
        .select('id, name')
        .eq('school_id', profile.schoolId)
        .order('name', { ascending: true })

      if (error) {
        console.error('Error loading students:', error)
      } else {
        setStudents((data as Student[]) || [])
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  useEffect(() => {
    reloadProgress(selectedStudent)
  }, [selectedStudent, reloadProgress])

  const statusByMaterial = useMemo(() => {
    const map: Record<string, ProgressStatus> = {}
    for (const row of rows) {
      map[`${row.area}::${row.material}`] = row.status
    }
    return map
  }, [rows])

  // Per-area tallies for the collapsed header badges.
  const areaCounts = useMemo(() => {
    const map: Record<
      string,
      { introduced: number; practicing: number; mastered: number; total: number }
    > = {}
    for (const area of MONTESSORI_AREAS) {
      map[area] = { introduced: 0, practicing: 0, mastered: 0, total: 0 }
    }
    for (const row of rows) {
      if (!map[row.area]) continue
      map[row.area][row.status] += 1
      map[row.area].total += 1
    }
    return map
  }, [rows])

  async function setStatus(
    area: MontessoriArea,
    material: string,
    status: ProgressStatus
  ) {
    if (!selectedStudent || !schoolId) return

    const key = `${area}::${material}`
    setSavingKey(key)
    const current = statusByMaterial[key]

    // Clicking the already-active status clears it.
    if (current === status) {
      const { error } = await supabase
        .from('student_progress')
        .delete()
        .eq('student_id', selectedStudent)
        .eq('area', area)
        .eq('material', material)

      if (error) {
        console.error('Error clearing status:', error)
        alert('Could not update progress.')
      } else {
        await reloadProgress(selectedStudent)
      }
      setSavingKey(null)
      return
    }

    const { error } = await supabase.from('student_progress').upsert(
      {
        school_id: schoolId,
        student_id: selectedStudent,
        area,
        material,
        status,
        updated_by: userId,
      },
      { onConflict: 'student_id,area,material' }
    )

    if (error) {
      console.error('Error saving progress:', error)
      alert('Could not update progress.')
    } else {
      await reloadProgress(selectedStudent)
    }
    setSavingKey(null)
  }

  function toggleArea(area: string) {
    setOpenAreas((prev) => ({ ...prev, [area]: !prev[area] }))
  }

  const selectedStudentName =
    students.find((s) => s.id === selectedStudent)?.name ?? ''

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg }}>
        <TopBar />
        <p style={{ padding: 24 }}>Loading progress...</p>
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
          <h1 style={{ margin: 0, color: colors.navy }}>Progress Tracking</h1>
          <p style={{ color: '#64748b', marginTop: 8 }}>
            Pick a student, then open a Montessori area and mark each material as
            Introduced, Practicing, or Mastered.
          </p>

          <label style={labelStyle}>Student</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select a student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || 'Unnamed Student'}
              </option>
            ))}
          </select>
        </div>

        {students.length === 0 && (
          <div style={cardStyle}>
            <p style={{ margin: 0 }}>
              No students yet. Add students first on the Students page (under
              Manage), then come back to track their progress.
            </p>
          </div>
        )}

        {selectedStudent && (
          <div style={{ display: 'grid', gap: 12 }}>
            {MONTESSORI_AREAS.map((area) => {
              const isOpen = !!openAreas[area]
              const counts = areaCounts[area]
              const materials = MATERIALS_BY_AREA[area]
              return (
                <div key={area} style={{ ...cardStyle, marginBottom: 0, padding: 0 }}>
                  <button
                    onClick={() => toggleArea(area)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '18px 20px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                        color: colors.navy,
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>
                        {isOpen ? '▼' : '▶'}
                      </span>
                      {area}
                    </span>
                    <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {counts.total === 0 ? (
                        <span style={{ color: '#cbd5e1', fontSize: 13 }}>
                          Not started
                        </span>
                      ) : (
                        <>
                          {counts.practicing > 0 && (
                            <Pill
                              color={STATUS_COLORS.practicing}
                              label={`${counts.practicing} Practicing`}
                              dark
                            />
                          )}
                          {counts.mastered > 0 && (
                            <Pill
                              color={STATUS_COLORS.mastered}
                              label={`${counts.mastered} Mastered`}
                            />
                          )}
                          {counts.introduced > 0 && (
                            <Pill
                              color={STATUS_COLORS.introduced}
                              label={`${counts.introduced} Introduced`}
                            />
                          )}
                        </>
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 20px 18px',
                        display: 'grid',
                        gap: 10,
                      }}
                    >
                      {materials.map((material) => {
                        const key = `${area}::${material}`
                        const current = statusByMaterial[key]
                        const saving = savingKey === key
                        return (
                          <div
                            key={material}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 12,
                              padding: '10px 12px',
                              border: '1px solid #e2e8f0',
                              borderRadius: 10,
                              background: current ? '#f8fafc' : 'white',
                              flexWrap: 'wrap',
                              opacity: saving ? 0.6 : 1,
                            }}
                          >
                            <span style={{ color: colors.navy, fontWeight: 500 }}>
                              {material}
                            </span>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {STATUS_ORDER.map((status) => {
                                const active = current === status
                                return (
                                  <button
                                    key={status}
                                    onClick={() =>
                                      setStatus(area, material, status)
                                    }
                                    disabled={saving}
                                    title={
                                      active
                                        ? 'Click again to clear'
                                        : STATUS_LABELS[status]
                                    }
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: 999,
                                      border: active
                                        ? `2px solid ${STATUS_COLORS[status]}`
                                        : '1px solid #cbd5e1',
                                      background: active
                                        ? STATUS_COLORS[status]
                                        : 'white',
                                      color: active
                                        ? status === 'practicing'
                                          ? colors.navy
                                          : 'white'
                                        : '#475569',
                                      cursor: saving ? 'default' : 'pointer',
                                      fontSize: 13,
                                      fontWeight: active ? 700 : 500,
                                    }}
                                  >
                                    {STATUS_LABELS[status]}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            <p
              style={{
                color: '#94a3b8',
                fontSize: 13,
                textAlign: 'center',
                margin: '4px 0 0',
              }}
            >
              Tracking for {selectedStudentName}. Tap an active status again to
              clear it.
            </p>
          </div>
        )}
      </div>
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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#475569',
  margin: '4px 0 6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: 'white',
}
