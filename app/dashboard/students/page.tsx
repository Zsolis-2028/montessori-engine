'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [classrooms, setClassrooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [classroom, setClassroom] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  async function reloadStudents() {
    const { data } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    setStudents(data || [])
  }

  useEffect(() => {
    async function loadData() {
      await reloadStudents()

      const { data } = await supabase
        .from('classrooms')
        .select('*')
        .order('name', { ascending: true })

      setClassrooms(data || [])
      setLoading(false)
    }

    loadData()
  }, [])

  function startEdit(student: any) {
    setEditingId(student.id)
    setName(student.name)
    setAge(String(student.age))
    setClassroom(student.classroom)
    setShowForm(true)
  }

  async function handleSaveStudent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (editingId) {
      await supabase
        .from('students')
        .update({ name, age: Number(age), classroom })
        .eq('id', editingId)
    } else {
      await supabase
        .from('students')
        .insert({ name, age: Number(age), classroom })
    }

    resetForm()
    reloadStudents()
  }

  async function handleDeleteStudent(id: number) {
    await supabase.from('students').delete().eq('id', id)
    reloadStudents()
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setName('')
    setAge('')
    setClassroom('')
  }

  if (loading) return <p style={{ padding: 20 }}>Loading students...</p>

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 20 }}>Students</h1>

      <button onClick={() => setShowForm(true)}>Add Student</button>

      {showForm && (
        <form onSubmit={handleSaveStudent}>
          <input placeholder="Student name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />

          <select value={classroom} onChange={(e) => setClassroom(e.target.value)}>
            <option value="">Select a classroom</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <button type="submit">{editingId ? 'Update Student' : 'Save Student'}</button>
        </form>
      )}

      {students.map((s) => (
        <div key={s.id}>
          <strong>{s.name}</strong>
          <p>Age: {s.age}</p>
          <p>Classroom: {s.classroom}</p>
          <button onClick={() => startEdit(s)}>Edit</button>
          <button onClick={() => handleDeleteStudent(s.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}