"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getCurrentSchoolProfile } from "@/lib/supabase/profile";
import { colors } from "@/lib/theme";
import { TopBar } from "@/components/TopBar";

type Classroom = {
  id: string;
  name: string;
  created_at?: string;
};

export default function ClassroomsPage() {
  const router = useRouter();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");

  async function loadClassrooms(forSchoolId: string) {
    const { data, error } = await supabase
      .from("classrooms")
      .select("*")
      .eq("school_id", forSchoolId)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error loading classrooms:", error);
      alert("Could not load classrooms.");
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

      setSchoolId(profile.schoolId);
      setIsAdmin(profile.role === "school_admin");
      await loadClassrooms(profile.schoolId);
      setLoading(false);
    }

    loadData();
  }, [router]);

  function startAdd() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(classroom: Classroom) {
    setEditingId(classroom.id);
    setName(classroom.name || "");
    setShowForm(true);
  }

  async function saveClassroom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a classroom name.");
      return;
    }

    if (!schoolId) {
      alert("Your school profile is missing. Please contact an admin.");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("classrooms")
        .update({ name: name.trim() })
        .eq("id", editingId);

      if (error) {
        console.error("Error updating classroom:", error);
        alert("Could not update classroom.");
        return;
      }
    } else {
      const { error } = await supabase
        .from("classrooms")
        .insert({ name: name.trim(), school_id: schoolId });

      if (error) {
        console.error("Error adding classroom:", error);
        alert("Could not add classroom.");
        return;
      }
    }

    resetForm();
    await loadClassrooms(schoolId);
  }

  async function deleteClassroom(classroom: Classroom) {
    if (!schoolId) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${classroom.name}?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("classrooms")
      .delete()
      .eq("id", classroom.id);

    if (error) {
      console.error("Error deleting classroom:", error);
      alert("Could not delete classroom. Make sure no students or teachers are assigned to it.");
      return;
    }

    await loadClassrooms(schoolId);
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setName("");
  }

  if (loading) {
    return <p style={{ padding: 24 }}>Loading classrooms...</p>;
  }

  if (profileError) {
    return <p style={{ padding: 24 }}>{profileError}</p>;
  }

  return (
    <div style={{ minHeight: "100vh", background: colors.bg }}>
    <TopBar />
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
        <h1 style={{ margin: 0, color: colors.navy }}>Classrooms</h1>

        <p style={{ color: "#64748b" }}>
          Add, edit, and manage classroom groups.
        </p>

        <button
          onClick={startAdd}
          style={{
            padding: "10px 14px",
            background: colors.gold,
            color: colors.navy,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add Classroom
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={saveClassroom}
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
            {editingId ? "Edit Classroom" : "Add Classroom"}
          </h2>

          <label>Classroom Name</label>
          <input
            placeholder="Classroom name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: 10,
              border: "1px solid #cbd5e1",
              borderRadius: 8,
            }}
          />

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
              {editingId ? "Update Classroom" : "Save Classroom"}
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

      {classrooms.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          <p>No classrooms yet.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              style={{
                background: "white",
                borderRadius: 16,
                padding: 20,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                border: "1px solid #e2e8f0",
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                {classroom.name || "Unnamed Classroom"}
              </h2>

              <p style={{ color: "#64748b" }}>
                Classroom group
              </p>

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button
                  onClick={() => startEdit(classroom)}
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

                {isAdmin && (
                  <button
                    onClick={() => deleteClassroom(classroom)}
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
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}