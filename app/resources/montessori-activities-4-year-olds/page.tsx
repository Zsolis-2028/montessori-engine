import type { Metadata } from "next";
import { ResourceCTA } from "@/components/ResourceCTA";
import styles from "../resources.module.css";

export const metadata: Metadata = {
  title: "Montessori Activities for 4 Year Olds",
  description:
    "Montessori activities for 4 year olds — extending into the movable alphabet, golden beads, and more complex practical life and cultural work.",
  alternates: { canonical: "/resources/montessori-activities-4-year-olds" },
};

export default function Page() {
  return (
    <main className={styles.wrap}>
      <p className={styles.kicker}>Ages &amp; stages</p>
      <article className={styles.prose}>
        <h1>Montessori Activities for 4 Year Olds</h1>
        <p className={styles.lead}>
          Four-year-olds are ready to stretch. They can handle longer sequences,
          more abstract ideas, and the materials that lead toward reading,
          writing, and real arithmetic.
        </p>

        <h2>What 4 year olds are working on</h2>
        <p>
          At four, concentration deepens and children crave a challenge. Many
          are moving toward the &ldquo;explosion into writing and reading,&rdquo;
          building longer words, and exploring the decimal system. Practical life
          becomes more complex, and cultural work captures their big questions
          about the world.
        </p>

        <h2>Language</h2>
        <ul>
          <li>Movable alphabet — building words and short phrases.</li>
          <li>Metal insets for pencil control and handwriting.</li>
          <li>Phonogram work and simple phonetic reading.</li>
          <li>Object boxes and early sentence building.</li>
        </ul>

        <h2>Math</h2>
        <ul>
          <li>Golden beads — exploring units, tens, hundreds, and thousands.</li>
          <li>Teen and ten boards for numbers to 99.</li>
          <li>Simple addition with concrete materials.</li>
          <li>Skip counting with the bead chains.</li>
        </ul>

        <h2>Practical life &amp; cultural</h2>
        <ul>
          <li>Multi-step food preparation — slicing, spreading, pouring.</li>
          <li>Sewing and threading.</li>
          <li>Puzzle maps of the continents and countries.</li>
          <li>Life cycles, plant and animal classification, simple science.</li>
        </ul>

        <h2>Tips for this age</h2>
        <p>
          Give four-year-olds real challenges and long work cycles. Offer the
          next material when they show readiness, and let their strong interests
          — maps, numbers, dinosaurs — pull them deeper into the work.
        </p>

        <ResourceCTA
          heading="Fresh activity ideas for your 4 year olds"
          body="Tell Montessori Engine the age and area, and it generates a complete, age-appropriate activity plan with aims and clear presentation steps."
          buttonLabel="Try the Activity Generator free"
        />
      </article>
    </main>
  );
}
