"use client";

import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { colors } from "@/lib/theme";
import { TopBar } from "@/components/TopBar";
import styles from "../markdown.module.css";

export default function ActivityGenerator() {
  const router = useRouter();

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
      setOutput(data?.activity || "No activity returned.");
    }

    setLoading(false);
  };

  const saveActivity = async () => {
    if (!output) {
      alert("Generate an activity first.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to save activities.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("school_id")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile?.school_id) {
      console.error("Profile error:", profileError);
      alert("Your school profile is missing. Please contact an admin.");
      return;
    }

    const { error } = await supabase.from("activities").insert({
      user_id: user.id,
      school_id: profile.school_id,
      domain,
      material,
      age_range: ageRange,
      generated_activity: output,
    });

    if (error) {
      console.error("Save error:", error);
      alert("Error saving activity.");
      return;
    }

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
              font-size: 14px;
            }

            .content h1, .content h2, .content h3, .content h4 {
              margin: 18px 0 6px;
            }

            .content ul, .content ol {
              padding-left: 22px;
              line-height: 1.6;
            }

            .content p {
              line-height: 1.6;
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

          <div class="content">${renderToStaticMarkup(<ReactMarkdown>{output}</ReactMarkdown>)}</div>

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
    <div style={{ minHeight: "100vh", background: colors.bg }}>
      <TopBar />
      <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ color: colors.navy }}>Activity Generator</h1>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            padding: "10px 14px",
            background: "#e5e7eb",
            color: "#111827",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>

        <button
          onClick={() => router.push("/dashboard/my-activities")}
          style={{
            padding: "10px 14px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          My Activities
        </button>
      </div>

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
            background: colors.gold,
            color: colors.navy,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            marginTop: 8,
            fontWeight: 600,
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

          <div className={styles.markdown}>
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
        </>
      )}
      </div>
    </div>
  );
}