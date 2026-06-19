'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getCurrentSchoolProfile } from '@/lib/supabase/profile'
import { colors } from '@/lib/theme'
import { TopBar } from '@/components/TopBar'

type Student = {
  id: string
  name: string
  age: number | null
  classroom: string | null
  created_at?: string
}

type Classroom = {
  id: string
  name: string
}

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [profileError, setProfileError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [classroom, setClassroom] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  async function reloadStudents(forSchoolId: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', forSchoolId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading students:', error)
      return
    }

    setStudents(data || [])
  }

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
      setIsAdmin(profile.role === 'school_admin')
      await reloadStudents(profile.schoolId)

      const { data, error } = await supabase
        .from('classrooms')
        .select('*')
        .eq('school_id', profile.schoolId)
        .order('name', { ascending: true })

      if (error) {
        console.error('Error loading classrooms:', error)
      } else {
        setClassrooms(data || [])
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  function startAdd() {
    resetForm()
    setShowForm(true)
  }

  function startEdit(student: Student) {
    setEditingId(student.id)
    setName(student.name || '')
    setAge(student.age !== null ? String(student.age) : '')
    setClassroom(student.classroom || '')
    setShowForm(true)
  }

  async function handleSaveStudent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!name.trim()) {
      alert('Please enter a student name.')
      return
    }

    if (!schoolId) {
      alert('Your school profile is missing. Please contact an admin.')
      return
    }

    const studentData = {
      name: name.trim(),
      age: age ? Number(age) : null,
      classroom: classroom || null,
    }

    if (editingId) {
      const { error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', editingId)

      if (error) {
        console.error('Error updating student:', error)
        alert('Could not update student.')
        return
      }
    } else {
      const { error } = await supabase
        .from('students')
        .insert({ ...studentData, school_id: schoolId })

      if (error) {
        console.error('Error adding student:', error)
        alert('Could not add student.')
        return
      }
    }

    resetForm()
    await reloadStudents(schoolId)
  }

  async function handleDeleteStudent(student: Student) {
    if (!schoolId) return

    const confirmed = confirm(
      `Are you sure you want to delete ${student.name}?`
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', student.id)

    if (error) {
      console.error('Error deleting student:', error)
      alert('Could not delete student.')
      return
    }

    await reloadStudents(schoolId)
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setName('')
    setAge('')
    setClassroom('')
  }

  if (loading) {
    return <p style={{ padding: 24 }}>Loading students...</p>
  }

  if (profileError) {
    return <p style={{ padding: 24 }}>{profileError}</p>
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
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <h1 style={{ margin: 0, color: colors.navy }}>Students</h1>
        <p style={{ color: '#64748b' }}>
          Add, edit, and manage student records for classroom tracking.
        </p>

        <button
          onClick={startAdd}
          style={{
            padding: '10px 14px',
            background: colors.gold,
            color: colors.navy,
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Add Student
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSaveStudent}
          style={{
            background: 'white',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            display: 'grid',
            gap: 12,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            {editingId ? 'Edit Student' : 'Add Student'}
          </h2>

          <label>Student Name</label>
          <input
            placeholder="Student name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: 10,
              border: '1px solid #cbd5e1',
              borderRadius: 8,
            }}
          />

          <label>Age</label>
          <input
            placeholder="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{
              padding: 10,
              border: '1px solid #cbd5e1',
              borderRadius: 8,
            }}
          />

          <label>Classroom</label>
          <select
            value={classroom}
            onChange={(e) => setClassroom(e.target.value)}
            style={{
              padding: 10,
              border: '1px solid #cbd5e1',
              borderRadius: 8,
            }}
          >
            <option value="">Select a classroom</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              type="submit"
              style={{
                padding: '10px 14px',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              {editingId ? 'Update Student' : 'Save Student'}
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '10px 14px',
                background: '#e5e7eb',
                color: '#111827',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {students.length === 0 ? (
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}
        >
          <p>No students yet.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {students.map((student) => (
            <div
              key={student.id}
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0',
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                {student.name || 'Unnamed Student'}
              </h2>

              <p>
                <strong>Age:</strong>{' '}
                {student.age !== null ? student.age : 'N/A'}
              </p>

              <p>
                <strong>Classroom:</strong>{' '}
                {student.classroom || 'Not assigned'}
              </p>

              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button
                  onClick={() => startEdit(student)}
                  style={{
                    padding: '8px 12px',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteStudent(student)}
                    style={{
                      padding: '8px 12px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}