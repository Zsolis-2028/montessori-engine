"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Activity = {
  id: string;
  user_id: string;
  domain: string | null;
  material: string | null;
  age_range: string | null;
  generated_activity: string | null;
  created_at: string | null;
};

export default function MyActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading activities:", error);
      } else {
        setActivities(data || []);
      }

      setLoading(false);
    }

    loadActivities();
  }, [router]);

  function escapeHtml(text: string) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function exportActivity(activity: Activity) {
    const title = activity.material || "Montessori Activity";
    const domain = activity.domain || "N/A";
    const ageRange = activity.age_range || "N/A";
    const savedDate = activity.created_at
      ? new Date(activity.created_at).toLocaleString()
      : "N/A";
    const content = activity.generated_activity || "";

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
            <p><strong>Domain:</strong> ${escapeHtml(domain)}</p>
            <p><strong>Age Range:</strong> ${escapeHtml(ageRange)}</p>
            <p><strong>Saved:</strong> ${escapeHtml(savedDate)}</p>
          </div>

          <div class="content">${escapeHtml(content)}</div>

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

  if (loading) return <p style={{ padding: 24 }}>Loading activities...</p>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>My Activities</h1>

      <button
        onClick={() => router.push("/activities")}
        style={{
          padding: "10px 14px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          marginTop: 12,
        }}
      >
        Generate New Activity
      </button>

      {activities.length === 0 ? (
        <p style={{ marginTop: 20 }}>No saved activities yet.</p>
      ) : (
        <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
          {activities.map((activity) => (
            <div
              key={activity.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 18,
                background: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                {activity.material || "Untitled Activity"}
              </h2>

              <p>
                <strong>Domain:</strong> {activity.domain || "N/A"}
              </p>

              <p>
                <strong>Age Range:</strong> {activity.age_range || "N/A"}
              </p>

              <p>
                <strong>Saved:</strong>{" "}
                {activity.created_at
                  ? new Date(activity.created_at).toLocaleString()
                  : "N/A"}
              </p>

              <button
                onClick={() => exportActivity(activity)}
                style={{
                  padding: "9px 12px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  marginTop: 8,
                  marginBottom: 12,
                }}
              >
                Export PDF
              </button>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  background: "#f4f4f4",
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 12,
                }}
              >
                {activity.generated_activity}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}