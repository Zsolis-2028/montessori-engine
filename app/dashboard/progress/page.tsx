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
  const [selectedArea, setSelectedArea] = useState<MontessoriArea>(
    MONTESSORI_AREAS[0]
  )
  const [rows, setRows] = useState<ProgressRow[]>([])
  const [savingKey, setSavingKey] = useState<string | null>(null)

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

  async function setStatus(material: string, status: ProgressStatus) {
    if (!selectedStudent || !schoolId) return

    const key = `${selectedArea}::${material}`
    setSavingKey(key)

    const current = statusByMaterial[key]

    // Clicking the already-active status clears it.
    if (current === status) {
      const { error } = await supabase
        .from('student_progress')
        .delete()
        .eq('student_id', selectedStudent)
        .eq('area', selectedArea)
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
        area: selectedArea,
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

  const selectedStudentName =
    students.find((s) => s.id === selectedStudent)?.name ?? ''

  // Summary counts across all areas for the selected student.
  const summary = useMemo(() => {
    const byArea: Record<
      string,
      { introduced: number; practicing: number; mastered: number }
    > = {}
    for (const row of rows) {
      if (!byArea[row.area]) {
        byArea[row.area] = { introduced: 0, practicing: 0, mastered: 0 }
      }
      byArea[row.area][row.status] += 1
    }
    return byArea
  }, [rows])

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

  const materials = MATERIALS_BY_AREA[selectedArea]

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
            Select a student and Montessori area, then mark each material as
            Introduced, Practicing, or Mastered.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
              marginTop: 8,
            }}
          >
            <div>
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

            <div>
              <label style={labelStyle}>Montessori Area</label>
              <select
                value={selectedArea}
                onChange={(e) =>
                  setSelectedArea(e.target.value as MontessoriArea)
                }
                style={inputStyle}
              >
                {MONTESSORI_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {students.length === 0 && (
          <div style={cardStyle}>
            <p style={{ margin: 0 }}>
              No students yet. Add students first on the Students page, then come
              back to track their progress.
            </p>
          </div>
        )}

        {selectedStudent && (
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: colors.navy }}>
              {selectedArea}
              <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                {' '}
                &middot; {selectedStudentName}
              </span>
            </h2>

            <div style={{ display: 'grid', gap: 10 }}>
              {materials.map((material) => {
                const key = `${selectedArea}::${material}`
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
                            onClick={() => setStatus(material, status)}
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
          </div>
        )}

        {selectedStudent && rows.length > 0 && (
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: colors.navy }}>
              Summary for {selectedStudentName}
            </h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {MONTESSORI_AREAS.filter((a) => summary[a]).map((area) => {
                const s = summary[area]
                const total = s.introduced + s.practicing + s.mastered
                return (
                  <div
                    key={area}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      flexWrap: 'wrap',
                    }}
                  >
                    <strong style={{ color: colors.navy }}>{area}</strong>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Pill
                        color={STATUS_COLORS.introduced}
                        label={`${s.introduced} Introduced`}
                      />
                      <Pill
                        color={STATUS_COLORS.practicing}
                        label={`${s.practicing} Practicing`}
                        dark
                      />
                      <Pill
                        color={STATUS_COLORS.mastered}
                        label={`${s.mastered} Mastered`}
                      />
                      <span style={{ color: '#94a3b8', fontSize: 13 }}>
                        {total} tracked
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
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
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: 'white',
}
