import type { Metadata } from "next";
import Link from "next/link";
import { colors } from "@/lib/theme";
import { ResourceCTA } from "@/components/ResourceCTA";
import styles from "./resources.module.css";

export const metadata: Metadata = {
  title: "Free Montessori Resources & Guides for Teachers",
  description:
    "Practical, free guides for Montessori educators — observation examples, activities by area and age, daily schedules, and more. Written for real classrooms.",
  alternates: { canonical: "/resources" },
};

type Guide = { href: string; title: string; blurb: string };

const groups: { heading: string; guides: Guide[] }[] = [
  {
    heading: "Guides",
    guides: [
      {
        href: "/resources/montessori-observation-examples",
        title: "Montessori Observation Examples (and How to Write Them)",
        blurb:
          "What a strong observation note looks like, the format to follow, and examples you can adapt.",
      },
      {
        href: "/resources/montessori-daily-schedule",
        title: "Building a Montessori Daily Schedule",
        blurb:
          "How to structure the work cycle and the rest of the day, with a sample schedule.",
      },
    ],
  },
  {
    heading: "Activities by area",
    guides: [
      {
        href: "/resources/montessori-practical-life-activities",
        title: "Practical Life Activities by Age",
        blurb: "Activities that build concentration, coordination, and independence.",
      },
      {
        href: "/resources/montessori-sensorial-activities",
        title: "Sensorial Activities & Materials",
        blurb: "The Pink Tower, color tablets, and more — what each one teaches.",
      },
      {
        href: "/resources/montessori-math-activities",
        title: "Math Activities & Materials",
        blurb: "From number rods to the golden beads — concrete to abstract.",
      },
      {
        href: "/resources/montessori-language-activities",
        title: "Language Activities & Materials",
        blurb: "Sandpaper letters to the movable alphabet — sounds to reading.",
      },
      {
        href: "/resources/montessori-cultural-activities",
        title: "Cultural Activities (Geography, Science & More)",
        blurb: "Geography, botany, zoology, and science that open the child's world.",
      },
    ],
  },
  {
    heading: "Activities by age",
    guides: [
      {
        href: "/resources/montessori-activities-2-year-olds",
        title: "Montessori Activities for 2 Year Olds",
        blurb: "Simple, hands-on activities that build independence and coordination.",
      },
      {
        href: "/resources/montessori-activities-3-year-olds",
        title: "Montessori Activities for 3 Year Olds",
        blurb: "Stepping into the primary materials across every area.",
      },
      {
        href: "/resources/montessori-activities-4-year-olds",
        title: "Montessori Activities for 4 Year Olds",
        blurb: "Extending into reading, writing, and the decimal system.",
      },
    ],
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

      {groups.map((group) => (
        <section key={group.heading} style={{ marginTop: 32 }}>
          <h2 style={{ color: colors.navy, fontSize: 20, margin: "0 0 14px" }}>
            {group.heading}
          </h2>
          <div style={{ display: "grid", gap: 14 }}>
            {group.guides.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                style={{
                  display: "block",
                  background: "#fff",
                  border: `1px solid ${colors.border}`,
                  borderRadius: 14,
                  padding: 20,
                  textDecoration: "none",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                <h3 style={{ color: colors.navy, fontSize: 18, margin: "0 0 6px" }}>
                  {g.title}
                </h3>
                <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  {g.blurb}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <ResourceCTA
        heading="Spend less time on paperwork"
        body="Montessori Engine helps you plan activities, write observations, build daily plans, and track each child's progress — in one place."
      />
    </main>
  );
}
