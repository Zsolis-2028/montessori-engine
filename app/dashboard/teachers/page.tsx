"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getCurrentSchoolProfile } from "@/lib/supabase/profile";

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
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [profileError, setProfileError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [classroomId, setClassroomId] = useState("");

  async function loadTeachers(forSchoolId: string) {
    const { data, error } = await supabase
      .from("teachers")
      .select("id, name, classroom_id, created_at, classrooms(name)")
      .eq("school_id", forSchoolId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading teachers:", error);
      return;
    }

    setTeachers((data as Teacher[]) || []);
  }

  async function loadClassrooms(forSchoolId: string) {
    const { data, error } = await supabase
      .from("classrooms")
      .select("*")
      .eq("school_id", forSchoolId)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error loading classrooms:", error);
      return;
    }

    setClassrooms(data || []);
  }

  useEffect(() => {
    async function loadData() {
      const profile = await getCurrentSchoolProfile();

      if (profile.status === "unauthenticated") {
        router.push("/login");
        return;
      }

      if (profile.status === "missing-profile") {
        setProfileError(
          "Your school profile is missing. Please contact an admin."
        );
        setLoading(false);
        return;
      }

      if (profile.role !== "school_admin") {
        router.push("/dashboard");
        return;
      }

      setSchoolId(profile.schoolId);
      await Promise.all([
        loadTeachers(profile.schoolId),
        loadClassrooms(profile.schoolId),
      ]);
      setLoading(false);
    }

    loadData();
  }, [router]);

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

    if (!schoolId) {
      alert("Your school profile is missing. Please contact an admin.");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("teachers")
        .update({ name: name.trim(), classroom_id: classroomId })
        .eq("id", editingId);

      if (error) {
        console.error("Error updating teacher:", error);
        alert("Could not update teacher.");
        return;
      }
    } else {
      const { error } = await supabase.from("teachers").insert({
        name: name.trim(),
        classroom_id: classroomId,
        school_id: schoolId,
      });

      if (error) {
        console.error("Error adding teacher:", error);
        alert("Could not add teacher.");
        return;
      }
    }

    resetForm();
    await loadTeachers(schoolId);
  }

  async function deleteTeacher(teacher: Teacher) {
    if (!schoolId) return;

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

    await loadTeachers(schoolId);
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

  if (profileError) {
    return <p style={{ padding: 24 }}>{profileError}</p>;
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