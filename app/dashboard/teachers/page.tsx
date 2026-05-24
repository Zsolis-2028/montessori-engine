"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [classroomId, setClassroomId] = useState("");

  // Load teachers
  async function loadTeachers() {
    const { data, error } = await supabase
      .from("teachers")
      .select("*, classrooms(name)")
      .order("created_at", { ascending: false });

    if (!error) setTeachers(data || []);
  }

  // Load classrooms for dropdown
  async function loadClassrooms() {
    const { data, error } = await supabase
      .from("classrooms")
      .select("*")
      .order("name", { ascending: true });

    if (!error) setClassrooms(data || []);
  }

  useEffect(() => {
    Promise.all([loadTeachers(), loadClassrooms()]).then(() =>
      setLoading(false)
    );
  }, []);

  // Start editing
  function startEdit(teacher: any) {
    setEditing(teacher);
    setName(teacher.name);
    setClassroomId(teacher.classroom_id);
  }

  // Save teacher (insert or update)
  async function saveTeacher() {
    if (!name || !classroomId) return;

    if (editing) {
      await supabase
        .from("teachers")
        .update({
          name,
          classroom_id: classroomId,
        })
        .eq("id", editing.id);
    } else {
      await supabase.from("teachers").insert({
        name,
        classroom_id: classroomId,
      });
    }

    setName("");
    setClassroomId("");
    setEditing(null);
    loadTeachers();
  }

  // Delete teacher
  async function deleteTeacher(id: number) {
    await supabase.from("teachers").delete().eq("id", id);
    loadTeachers();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teachers</h1>

      {/* Form */}
      <div className="mb-6 space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Teacher name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2 w-full"
          value={classroomId}
          onChange={(e) => setClassroomId(e.target.value)}
        >
          <option value="">Select classroom</option>
          {classrooms.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={saveTeacher}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editing ? "Update Teacher" : "Add Teacher"}
        </button>

        {editing && (
          <button
            onClick={() => {
              setEditing(null);
              setName("");
              setClassroomId("");
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {teachers.map((t) => (
          <div
            key={t.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-gray-600">
                Classroom: {t.classrooms?.name || "Unknown"}
              </p>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => startEdit(t)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTeacher(t.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
