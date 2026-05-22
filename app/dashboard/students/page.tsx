'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // form state
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [classroom, setClassroom] = useState('')

  useEffect(() => {
    async function loadStudents() {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) {
        setStudents(data || [])
      }

      setLoading(false)
    }

    loadStudents()
  }, [])

  async function handleAddStudent(e: any) {
    e.preventDefault()

    const { error } = await supabase.from('students').insert({
      name,
      age: Number(age),
      classroom
    })

    if (!error) {
      // reset form
      setShowForm(false)
      setName('')
      setAge('')
      setClassroom('')

      // reload students
      const { data } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })

      setStudents(data || [])
    }
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Loading students...</p>
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 20 }}>Students</h1>

      <button
        onClick={() => setShowForm(true)}
        style={{
          padding: 10,
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          marginBottom: 20
        }}
      >
        Add Student
      </button>

      {showForm && (
        <form
          onSubmit={handleAddStudent}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: 20,
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 6
          }}
        >
          <input
            type="text"
            placeholder="Student name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: 10, border: '1px solid #ccc', borderRadius: 4 }}
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{ padding: 10, border: '1px solid #ccc', borderRadius: 4 }}
          />

          <input
            type="text"
            placeholder="Classroom"
            value={classroom}
            onChange={(e) => setClassroom(e.target.value)}
            style={{ padding: 10, border: '1px solid #ccc', borderRadius: 4 }}
          />

          <button
            type="submit"
            style={{
              padding: 10,
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Save Student
          </button>
        </form>
      )}

      {students.length === 0 && <p>No students yet.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map((s) => (
          <li
            key={s.id}
            style={{
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            <strong>{s.name}</strong><br />
            Age: {s.age}<br />
            Classroom: {s.classroom}
          </li>
        ))}
      </ul>
    </div>
  )
}
