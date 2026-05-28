"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [name, setName] = useState("");

  async function loadClassrooms() {
    const { data } = await supabase.from("classrooms").select("*").order("name");
    setClassrooms(data || []);
  }

  async function addClassroom() {
    if (!name) return;
    await supabase.from("classrooms").insert({ name });
    setName("");
    loadClassrooms();
  }

  useEffect(() => {
    loadClassrooms();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Classrooms</h1>

      <input
        className="border p-2 w-full"
        placeholder="Classroom name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={addClassroom}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
      >
        Add Classroom
      </button>

      <div className="mt-6 space-y-2">
        {classrooms.map((c) => (
          <div key={c.id} className="border p-3 rounded">
            {c.name}
          </div>
        ))}
      </div>
    </div>
  );
}
