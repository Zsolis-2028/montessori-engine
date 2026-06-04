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

  if (loading) return <p style={{ padding: 24 }}>Loading activities...</p>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>My Activities</h1>

      <button onClick={() => router.push("/activities")}>
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
                borderRadius: 8,
                padding: 16,
                background: "#fff",
              }}
            >
              <h2>{activity.material || "Untitled Activity"}</h2>

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