"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ActivityGenerator() {
  const [ageRange, setAgeRange] = useState("");
  const [domain, setDomain] = useState("");
  const [material, setMaterial] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateActivity = async () => {
    if (!ageRange || !domain || !material.trim()) {
      alert("Please select an age range, domain, and material.");
      return;
    }

    setLoading(true);
    setOutput("");

    const prompt = `
Create a Montessori-aligned activity for:

Age Range: ${ageRange}
Domain: ${domain}
Material or Available Items: ${material}

Include:
- Activity title
- Purpose
- Developmental goal
- Step-by-step setup or presentation
- Safety notes
- What the teacher should observe
- Points of interest
- Extensions
- Language to use with the child

Important:
If the age range is infant or toddler, make the activity developmentally appropriate, simple, safe, supervised, and avoid choking hazards.
If the age range is 3-6 or 6-9, include Montessori presentation language, control of error, and follow-up work.
`;

    const { data, error } = await supabase.functions.invoke(
      "activity-generator",
      {
        body: { prompt },
      }
    );

    if (error) {
      console.error("Function error:", error);
      setOutput("Error generating activity.");
    } else {
      setOutput(data.activity);
    }

    setLoading(false);
  };

  const saveActivity = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to save activities.");
      return;
    }

    await supabase.from("activities").insert({
      user_id: user.id,
      domain,
      material,
      age_range: ageRange,
      generated_activity: output,
    });

    alert("Activity saved!");
  };

  function escapeHtml(text: string) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function exportActivity() {
    if (!output) {
      alert("Generate an activity first.");
      return;
    }

    const title = material || "Montessori Activity";
    const savedDate = new Date().toLocaleString();

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Popup blocked. Please allow popups to export this activity.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${escapeHtml(title)}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
              color: #111827;
            }

            h1 {
              font-size: 28px;
              margin-bottom: 8px;
            }

            .meta {
              background: #f3f4f6;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 24px;
            }

            .content {
              white-space: pre-wrap;
              font-size: 14px;
            }

            .footer {
              margin-top: 40px;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 12px;
            }

            @media print {
              body {
                padding: 24px;
              }
            }
          </style>
        </head>

        <body>
          <h1>${escapeHtml(title)}</h1>

          <div class="meta">
            <p><strong>Domain:</strong> ${escapeHtml(domain || "N/A")}</p>
            <p><strong>Age Range:</strong> ${escapeHtml(ageRange || "N/A")}</p>
            <p><strong>Generated:</strong> ${escapeHtml(savedDate)}</p>
          </div>

          <div class="content">${escapeHtml(output)}</div>

          <div class="footer">
            Generated with Montessori Engine
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <h1>Activity Generator</h1>

      <div style={{ display: "grid", gap: 12 }}>
        <label>Age Range</label>
        <select
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
          style={{ padding: 10 }}
        >
          <option value="">Select</option>
          <option value="0-12 months">Infant: 0–12 months</option>
          <option value="12-24 months">Toddler: 12–24 months</option>
          <option value="0-2 years">Infant/Toddler: 0–2 years</option>
          <option value="3-6">Primary: 3–6</option>
          <option value="6-9">Elementary: 6–9</option>
        </select>

        <label>Domain</label>
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          style={{ padding: 10 }}
        >
          <option value="">Select</option>
          <option value="Practical Life">Practical Life</option>
          <option value="Sensorial">Sensorial</option>
          <option value="Math">Math</option>
          <option value="Language">Language</option>
          <option value="Cultural">Cultural</option>
          <option value="Fine Motor">Fine Motor</option>
          <option value="Gross Motor">Gross Motor</option>
          <option value="Sensory">Sensory</option>
        </select>

        <label>Material / Available Items</label>
        <input
          type="text"
          placeholder="Pink Tower, Bead Bars, rice + bowls, soft blocks, etc."
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          style={{ padding: 10 }}
        />

        <button
          onClick={generateActivity}
          disabled={loading}
          style={{
            padding: 12,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          {loading ? "Generating..." : "Generate Activity"}
        </button>
      </div>

      {output && (
        <>
          <h2 style={{ marginTop: 28 }}>Generated Activity</h2>

          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button
              onClick={saveActivity}
              style={{
                padding: "10px 14px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Save Activity
            </button>

            <button
              onClick={exportActivity}
              style={{
                padding: "10px 14px",
                background: "#9333ea",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Export PDF
            </button>
          </div>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f4f4f4",
              padding: 12,
              borderRadius: 8,
            }}
          >
            {output}
          </pre>
        </>
      )}
    </div>
  );
}