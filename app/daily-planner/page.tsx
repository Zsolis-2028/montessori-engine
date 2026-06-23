"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase/client";
import { colors } from "@/lib/theme";
import { TopBar } from "@/components/TopBar";
import styles from "../markdown.module.css";

export default function DailyPlanner() {
  const [roomType, setRoomType] = useState("");
  const [childCount, setChildCount] = useState("");
  const [theme, setTheme] = useState("");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!roomType) {
      alert("Please select a room type.");
      return;
    }

    setLoading(true);
    setOutput("");

    const prompt = `
Create a full Montessori daily activity plan for:

Room Type: ${roomType}
Number of Children: ${childCount || "Not specified"}
Theme or Focus: ${theme || "None"}
Additional Notes: ${notes || "None"}

Structure the day as follows:

## Morning Arrival (7:30 – 9:00 AM)
[Settling activities, sensory bins, free exploration]

## Morning Work Cycle (9:00 – 10:30 AM)
[3-4 specific Montessori activities with materials and setup]

## Snack Time (10:30 – 11:00 AM)
[Practical life, self-serve snack ideas]

## Outdoor / Gross Motor (11:00 – 11:45 AM)
[Age-appropriate outdoor or movement activities]

## Lunch & Rest Prep (11:45 AM – 1:00 PM)
[Practical life routines, wind-down]

## Afternoon Work Cycle (2:30 – 3:30 PM)
[2-3 quieter activities for after rest]

## End of Day (3:30 – 5:00 PM)
[Free play, parent connection activities]

For each activity include: materials needed, setup, what to observe.
Safety note: All activities must be safe for ${roomType} — no choking hazards for under-2s.
`;

    const { data, error } = await supabase.functions.invoke("daily-planner", {
      body: { prompt },
    });

    if (error) {
      console.error("Function error:", error);
      setOutput("Error generating plan.");
    } else {
      setOutput(data?.plan || "No plan returned.");
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert("Copied to clipboard!");
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.bg }}>
      <TopBar />
      <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ color: colors.navy }}>Daily Activity Planner</h1>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>
          Generate a full Montessori day plan for your classroom.
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ fontWeight: 600, color: colors.navy }}>Room Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: "1px solid #d1d5db" }}
          >
            <option value="">Select</option>
            <option value="Infant room (0-12 months)">Infant room (0-12 months)</option>
            <option value="Young toddler room (12-24 months)">Young toddler room (12-24 months)</option>
            <option value="Older toddler room (24-36 months)">Older toddler room (24-36 months)</option>
            <option value="Mixed infant/toddler room (0-36 months)">Mixed infant/toddler room (0-36 months)</option>
            <option value="Primary classroom (3-6)">Primary classroom (3-6)</option>
            <option value="Lower Elementary (6-9)">Lower Elementary (6-9)</option>
            <option value="Upper Elementary (9-12)">Upper Elementary (9-12)</option>