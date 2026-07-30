import type { Metadata } from "next";
import { ResourceCTA } from "@/components/ResourceCTA";
import styles from "../resources.module.css";

export const metadata: Metadata = {
  title: "Montessori Sensorial Activities & Materials",
  description:
    "A guide to Montessori sensorial activities and materials — the Pink Tower, Brown Stair, color tablets and more — what each one teaches and how to present it.",
  alternates: { canonical: "/resources/montessori-sensorial-activities" },
};

export default function Page() {
  return (
    <main className={styles.wrap}>
      <p className={styles.kicker}>Sensorial</p>
      <article className={styles.prose}>
        <h1>Montessori Sensorial Activities &amp; Materials</h1>
        <p className={styles.lead}>
          Sensorial work helps the child classify and make sense of the world
          through their senses. The materials isolate one quality at a time —
          size, color, weight, sound — so the child can refine their perception
          and build order in their mind.
        </p>

        <h2>What sensorial work develops</h2>
        <p>
          Each sensorial material isolates a single concept. The Pink Tower
          varies only in size; the color tablets vary only in hue. By working
          with one quality at a time, the child develops precise perception,
          visual and tactile discrimination, and the vocabulary to describe what
          they notice. This work also quietly prepares the child for math and
          language — grading, comparing, and pattern-making are everywhere.
        </p>

        <h2>Core sensorial materials</h2>
        <ul>
          <li>
            <strong>Pink Tower</strong> — ten cubes graded in size; visual
            discrimination of dimension.
          </li>
          <li>
            <strong>Brown Stair</strong> — ten prisms varying in width;
            comparison and grading.
          </li>
          <li>
            <strong>Red Rods</strong> — length discrimination; a direct
            preparation for the number rods.
          </li>
          <li>
            <strong>Knobbed &amp; knobless cylinders</strong> — grading by
            dimension, with a built-in control of error.
          </li>
          <li>
            <strong>Color tablets</strong> — matching and grading color and
            shade.
          </li>
          <li>
            <strong>Geometric cabinet</strong> — visual and tactile exploration
            of shape.
          </li>
          <li>
            <strong>Sound cylinders</strong> — auditory discrimination, matching
            and grading sounds.
          </li>
          <li>
            <strong>Baric &amp; thermic tablets</strong> — discriminating weight
            and temperature by touch.
          </li>
        </ul>

        <h2>How to present sensorial work</h2>
        <ol>
          <li>
            Present slowly and with minimal language — let the child&rsquo;s
            senses do the work.
          </li>
          <li>
            Use the three-period lesson to introduce vocabulary (&ldquo;This is
            large. This is small.&rdquo;).
          </li>
          <li>
            Let the child explore extensions — building the Pink Tower and Brown
            Stair together, or working blindfolded to isolate touch.
          </li>
          <li>
            Trust the control of error; let the child notice and correct rather
            than correcting for them.
          </li>
        </ol>

        <ResourceCTA
          heading="Build a sensorial activity in seconds"
          body="Choose the age, the sensorial area, and the materials you have — Montessori Engine writes a full activity plan with direct and indirect aims and presentation steps."
          buttonLabel="Try the Activity Generator free"
        />
      </article>
    </main>
  );
}
