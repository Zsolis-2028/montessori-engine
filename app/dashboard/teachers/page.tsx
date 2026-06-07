"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Classroom = {
  id: string;
  name: string;
};

type Teacher = {
  id: string;
  name: string;
  classroom_id: string | null;
  created_at?: string;
  classrooms?: {
    name: string;
  } | null;
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [classroomId, setClassroomId] = useState("");

  async function loadTeachers() {
    const { data, error } = await supabase
      .from("teachers")
      .select("id, name, classroom_id, created_at, classrooms(name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading teachers:", error);
      return;
    }

    setTeachers((data as Teacher[]) || []);
  }

  async function loadClassrooms() {
    const { data, error } = await supabase
      .from("classrooms")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error loading classrooms:", error);
      return;
    }

    setClassrooms(data || []);
  }

  useEffect(() => {
    async function loadData() {
      await Promise.all([loadTeachers(), loadClassrooms()]);
      setLoading(false);
    }

    loadData();
  }, []);

  function startAdd() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(teacher: Teacher) {
    setEditingId(teacher.id);
    setName(teacher.name || "");
    setClassroomId(teacher.classroom_id || "");
    setShowForm(true);
  }

  async function saveTeacher(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a teacher name.");
      return;
    }

    if (!classroomId) {
      alert("Please select a classroom.");
      return;
    }

    const teacherData = {
      name: name.trim(),
      classroom_id: classroomId,
    };

    if (editingId) {
      const { error } = await supabase
        .from("teachers")
        .update(teacherData)
        .eq("id", editingId);

      if (error) {
        console.error("Error updating teacher:", error);
        alert("Could not update teacher.");
        return;
      }
    } else {
      const { error } = await supabase.from("teachers").insert(teacherData);

      if (error) {
        console.error("Error adding teacher:", error);
        alert("Could not add teacher.");
        return;
      }
    }

    resetForm();
    await loadTeachers();
  }

  async function deleteTeacher(teacher: Teacher) {
    const confirmed = confirm(
      `Are you sure you want to delete ${teacher.name}?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("teachers")
      .delete()
      .eq("id", teacher.id);

    if (error) {
      console.error("Error deleting teacher:", error);
      alert("Could not delete teacher.");
      return;
    }

    await loadTeachers();
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setClassroomId("");
  }

  if (loading) {
    return <p style={{ padding: 24 }}>Loading teachers...</p>;
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ margin: 0 }}>Teachers</h1>

        <p style={{ color: "#64748b" }}>
          Add, edit, and assign teachers to classrooms.
        </p>

        <button
          onClick={startAdd}
          style={{
            padding: "10px 14px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Add Teacher
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={saveTeacher}
          style={{
            background: "white",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            display: "grid",
            gap: 12,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            {editingId ? "Edit Teacher" : "Add Teacher"}
          </h2>

          <label>Teacher Name</label>
          <input
            placeholder="Teacher name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: 10,
              border: "1px solid #cbd5e1",
              borderRadius: 8,
            }}
          />

          <label>Classroom</label>
          <select
            value={classroomId}
            onChange={(e) => setClassroomId(e.target.value)}
            style={{
              padding: 10,
              border: "1px solid #cbd5e1",
              borderRadius: 8,
            }}
          >
            <option value="">Select a classroom</option>
            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button
              type="submit"
              style={{
                padding: "10px 14px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {editingId ? "Update Teacher" : "Save Teacher"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: "10px 14px",
                background: "#e5e7eb",
                color: "#111827",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {teachers.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          <p>No teachers yet.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              style={{
                background: "white",
                borderRadius: 16,
                padding: 20,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                border: "1px solid #e2e8f0",
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                {teacher.name || "Unnamed Teacher"}
              </h2>

              <p>
                <strong>Classroom:</strong>{" "}
                {teacher.classrooms?.name || "Not assigned"}
              </p>

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button
                  onClick={() => startEdit(teacher)}
                  style={{
                    padding: "8px 12px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTeacher(teacher)}
                  style={{
                    padding: "8px 12px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}