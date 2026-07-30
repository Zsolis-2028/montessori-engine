import type { Metadata } from "next";
import { ResourceCTA } from "@/components/ResourceCTA";
import styles from "../resources.module.css";

export const metadata: Metadata = {
  title: "Montessori Activities for 3 Year Olds",
  description:
    "Montessori activities for 3 year olds across practical life, sensorial, early math and language — building concentration, coordination, and independence.",
  alternates: { canonical: "/resources/montessori-activities-3-year-olds" },
};

export default function Page() {
  return (
    <main className={styles.wrap}>
      <p className={styles.kicker}>Ages &amp; stages</p>
      <article className={styles.prose}>
        <h1>Montessori Activities for 3 Year Olds</h1>
        <p className={styles.lead}>
          At three, children step into the primary years. They can sustain
          longer, more purposeful work and are ready for the classic Montessori
          materials across every area.
        </p>

        <h2>What 3 year olds are working on</h2>
        <p>
          Three-year-olds are developing real concentration, refining fine motor
          control, and beginning to explore early math and language concepts.
          This is the age where the sensitive periods for order, movement, and
          language are in full swing — perfect timing for hands-on materials.
        </p>

        <h2>Practical life</h2>
        <ul>
          <li>Water pouring between small pitchers.</li>
          <li>Transferring with tongs, a spoon, or a dropper.</li>
          <li>Buttoning, zipping, and bow-tying frames.</li>
          <li>Table washing and polishing.</li>
        </ul>

        <h2>Sensorial</h2>
        <ul>
          <li>Pink Tower and Brown Stair.</li>
          <li>Color tablets — matching and grading.</li>
          <li>Knobbed cylinders and geometric shapes.</li>
        </ul>

        <h2>Early language &amp; math</h2>
        <ul>
          <li>Sandpaper letters — tracing and sounding out.</li>
          <li>&ldquo;I spy&rdquo; sound games for phonemic awareness.</li>
          <li>Number rods and sandpaper numbers for early counting.</li>
          <li>Counting real objects in everyday moments.</li>
        </ul>

        <h2>Tips for this age</h2>
        <p>
          Protect long stretches of uninterrupted work, follow the child&rsquo;s
          interests, and resist the urge to correct — the materials are designed
          so the child can notice and fix their own errors.
        </p>

        <ResourceCTA
          heading="Fresh activity ideas for your 3 year olds"
          body="Tell Montessori Engine the age and materials you have, and it builds a complete, age-appropriate activity plan with aims and presentation steps."
          buttonLabel="Try the Activity Generator free"
        />
      </article>
    </main>
  );
}
