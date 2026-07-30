import type { Metadata } from "next";
import Link from "next/link";
import { colors } from "@/lib/theme";
import { ResourceCTA } from "@/components/ResourceCTA";
import styles from "./resources.module.css";

export const metadata: Metadata = {
  title: "Free Montessori Resources & Guides for Teachers",
  description:
    "Practical, free guides for Montessori educators — observation examples, practical life activities, daily schedules, and progress tracking. Written for real classrooms.",
  alternates: { canonical: "/resources" },
};

const guides = [
  {
    href: "/resources/montessori-observation-examples",
    title: "Montessori Observation Examples (and How to Write Them)",
    blurb:
      "What a strong observation note looks like, the format to follow, and examples you can adapt for your own classroom.",
  },
  {
    href: "/resources/montessori-practical-life-activities",
    title: "Montessori Practical Life Activities by Age",
    blurb:
      "A practical list of practical life activities, what each one develops, and how to present them.",
  },
  {
    href: "/resources/montessori-daily-schedule",
    title: "Building a Montessori Daily Schedule",
    blurb:
      "How to structure the work cycle and the rest of the day in a Montessori classroom, with a sample schedule.",
  },
];

export default function ResourcesHub() {
  return (
    <main className={styles.wrap}>
      <p className={styles.kicker}>Free resources</p>
      <div className={styles.prose}>
        <h1>Montessori resources for real classrooms</h1>
        <p className={styles.lead}>
          Free, practical guides for Montessori educators — no fluff, no theory
          for its own sake. Just the things teachers actually need help with day
          to day.
        </p>
      </div>

      <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
        {guides.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            style={{
              display: "block",
              background: "#fff",
              border: `1px solid ${colors.border}`,
              borderRadius: 14,
              padding: 22,
              textDecoration: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            <h2 style={{ color: colors.navy, fontSize: 20, margin: "0 0 6px" }}>
              {g.title}
            </h2>
            <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
              {g.blurb}
            </p>
          </Link>
        ))}
      </div>

      <ResourceCTA
        heading="Spend less time on paperwork"
        body="Montessori Engine helps you plan activities, write observations, build daily plans, and track each child's progress — in one place."
      />
    </main>
  );
}
