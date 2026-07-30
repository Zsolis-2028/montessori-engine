import type { Metadata } from "next";
import { ResourceCTA } from "@/components/ResourceCTA";
import styles from "../resources.module.css";

export const metadata: Metadata = {
  title: "Building a Montessori Daily Schedule (with Sample)",
  description:
    "How to structure a Montessori daily schedule around the three-hour work cycle, plus a sample daily schedule you can adapt for a toddler or primary classroom.",
  alternates: { canonical: "/resources/montessori-daily-schedule" },
};

export default function Page() {
  return (
    <main className={styles.wrap}>
      <p className={styles.kicker}>Daily Planning</p>
      <article className={styles.prose}>
        <h1>Building a Montessori Daily Schedule</h1>
        <p className={styles.lead}>
          A good Montessori day protects one thing above all: the uninterrupted
          work cycle. Here&rsquo;s how to structure the day around it, and a
          sample schedule you can adapt.
        </p>

        <h2>Protect the work cycle</h2>
        <p>
          The heart of the Montessori day is the{" "}
          <strong>uninterrupted work cycle</strong> — ideally around three hours
          in the primary classroom. During this time children choose their own
          work, repeat it, and move freely. The temptation is to break it up with
          group activities and transitions; resist it. The long, unbroken stretch
          is what allows deep concentration to emerge.
        </p>

        <h2>The rhythm of the day</h2>
        <p>
          Rather than a rigid minute-by-minute timetable, think in blocks that
          give the day a predictable rhythm:
        </p>
        <ul>
          <li>
            <strong>Arrival &amp; settling</strong> — children enter calmly, put
            away their things, and choose an early work.
          </li>
          <li>
            <strong>Work cycle</strong> — the long, protected block of
            self-directed work with individual and small-group presentations.
          </li>
          <li>
            <strong>Snack</strong> — offered as a standing work, not a whole-class
            interruption, so the cycle keeps flowing.
          </li>
          <li>
            <strong>Outdoor time</strong> — movement, gross motor, and nature.
          </li>
          <li>
            <strong>Group time</strong> — a short gathering for songs, stories,
            or grace and courtesy.
          </li>
        </ul>

        <h2>Sample primary schedule (3 – 6)</h2>
        <div className={styles.card}>
          <ul style={{ margin: 0 }}>
            <li>8:00 – 8:30 — Arrival, settling, early work</li>
            <li>8:30 – 11:30 — Uninterrupted work cycle (snack offered within)</li>
            <li>11:30 – 12:00 — Group time: songs, story, grace &amp; courtesy</li>
            <li>12:00 – 12:45 — Lunch</li>
            <li>12:45 – 1:30 — Outdoor time</li>
            <li>1:30 – 3:00 — Afternoon work cycle / rest for younger children</li>
          </ul>
        </div>

        <h2>Adapting for toddlers</h2>
        <p>
          Toddler days follow the same spirit with shorter blocks and more
          movement. The work cycle is briefer, care routines (toileting,
          handwashing, snack) are woven in as purposeful activities, and
          transitions are kept slow and predictable.
        </p>

        <h2>A few planning principles</h2>
        <ul>
          <li>Fewer transitions is almost always better.</li>
          <li>
            Follow the children — if concentration is high, don&rsquo;t break it
            for the clock.
          </li>
          <li>
            Keep group activities short and optional rather than long and
            mandatory.
          </li>
        </ul>

        <ResourceCTA
          heading="Plan a full day in minutes"
          body="Tell Montessori Engine your room type and focus, and it builds a complete daily plan — morning through end of day, with materials, setup, and what to observe."
          buttonLabel="Try the Daily Planner free"
        />
      </article>
    </main>
  );
}
