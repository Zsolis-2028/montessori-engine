"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function ActivityGenerator() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [ageRange, setAgeRange] = useState("");
  const [domain, setDomain] = useState("");
  const [material, setMaterial] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateActivity = async () => {
    setLoading(true);
    setOutput("");

    // ⭐ CLEAN, SAFE PROMPT — NO INDENTATION ISSUES
    const prompt = `
Create a Montessori activity for:
Age Range: ${ageRange}
Domain: ${domain}
Material: ${material}

Include:
- Purpose
- Step-by-step presentation
- Control of error
- Points of interest
- Extensions
- Language to use with the child
`;

    const { data, error } = await supabase.functions.invoke(
      "activity-generator",
      {
        body: { prompt }
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
      data: { user }
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
      generated_activity: output
    });

    alert("Activity saved!");
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Activity Generator</h1>

      <label>Age Range</label>
      <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
        <option value="">Select</option>
        <option value="3-6">3–6</option>
        <option value="6-9">6–9</option>
      </select>

      <label>Domain</label>
      <select value={domain} onChange={(e) => setDomain(e.target.value)}>
        <option value="">Select</option>
        <option value="Practical Life">Practical Life</option>
        <option value="Sensorial">Sensorial</option>
        <option value="Math">Math</option>
        <option value="Language">Language</option>
        <option value="Cultural">Cultural</option>
      </select>

      <label>Material</label>
      <input
        type="text"
        placeholder="Pink Tower, Bead Bars, etc."
        value={material}
        onChange={(e) => setMaterial(e.target.value)}
      />

      <button onClick={generateActivity} disabled={loading}>
        {loading ? "Generating..." : "Generate Activity"}
      </button>

      {output && (
        <>
          <h2>Generated Activity</h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f4f4f4",
              padding: 12,
              borderRadius: 8
            }}
          >
            {output}
          </pre>

          <button onClick={saveActivity}>Save Activity</button>
        </>
      )}
    </div>
  );
}

