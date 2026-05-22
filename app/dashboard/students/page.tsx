'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <p style={{ padding: 20 }}>Loading students...</p>
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 20 }}>Students</h1>

      {students.length === 0 && (
        <p>No students yet.</p>
      )}

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
