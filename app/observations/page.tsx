"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { colors } from "@/lib/theme";
import { TopBar } from "@/components/TopBar";
import styles from "../markdown.module.css";

export default function ObservationWriter() {
  const router = useRouter();
  const [childAge, setChildAge] = useState("");
  const [setting, setSetting] = useState("");
  const [rawNote, setRawNote] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateObservation = async () => {
    if (!rawNote.trim()) {
      alert("Please enter your observation notes.");
      return;
    }

    setLoading(true);
    setOutput("");

    const prompt = `
Transform this raw teacher observation into a professional Montessori observation note:

Child Age: ${childAge || "Not specified"}
Setting: ${setting || "Not specified"}
Raw observation: ${rawNote}

Format the output as:
## Observation Note

**Date:** [leave blank for teacher to fill]
**Child Age:** ${childAge || "[fill in]"}
**Setting:** ${setting || "[fill in]"}

**Observation:**
[Objective, factual description of what the child did]

**Developmental Significance:**
[Brief note on what this reveals about the child's development]

**Follow-up:**
[Suggested next steps or materials to offer]
`;

    const { data, error } = await supabase.functions.invoke("observation-writer", {
      body: { prompt },
    });

    if (error) {
      console.error("Function error:", error);
      setOutput("Error generating observation note.");
    } else {
      setOutput(data?.observation || "No output returned.");
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
        <h1 style={{ color: colors.navy }}>Observation Note Writer</h1>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>
          Jot down what you saw in plain language — we'll turn it into a polished Montessori observation note.
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ fontWeight: 600, color: colors.navy }}>Child Age</label>
          <input
            type="text"
            placeholder="e.g. 3 years 4 months"
            value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: "1px solid #d1d5db" }}
          />

          <label style={{ fontWeight: 600, color: colors.navy }}>Setting</label>
          <select
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: "1px solid #d1d5db" }}
          >
            <option value="">Select</option>
            <option value="Infant/Toddler room">Infant/Toddler room</option>
            <option value="Primary (3-6)">Primary (3–6)</option>
            <option value="Elementary (6-9)">Elementary (6–9)</option>
            <option value="Outdoor environment">Outdoor environment</option>
            <option value="Snack/lunch time">Snack/lunch time</option>
            <option value="Circle time">Circle time</option>
          </select>

          <label style={{ fontWeight: 600, color: colors.navy }}>Your Raw Notes</label>
          <textarea
            placeholder="e.g. Maya spent 20 mins at the pink tower, stacking and restacking. She corrected herself when blocks wobbled without any help from me..."
            value={rawNote}
            onChange={(e) => setRawNote(e.target.value)}
            rows={6}
            style={{ padding: 10, borderRadius: 6, border: "1px solid #d1d5db", resize: "vertical" }}
          />

          <button
            onClick={generateObservation}
            disabled={loading}
            style={{
              padding: 12,
              background: colors.gold,
              color: colors.navy,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            {loading ? "Writing..." : "Write Observation Note"}
          </button>
        </div>

        {output && (
          <>
            <h2 style={{ marginTop: 28, color: colors.navy }}>Observation Note</h2>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <button
                onClick={copyToClipboard}
                style={{
                  padding: "10px 14px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Copy to Clipboard
              </button>
            </div>
            <div className={styles.markdown}>
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
}