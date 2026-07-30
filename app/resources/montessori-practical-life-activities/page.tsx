import type { Metadata } from "next";
import { ResourceCTA } from "@/components/ResourceCTA";
import styles from "../resources.module.css";

export const metadata: Metadata = {
  title: "Montessori Practical Life Activities by Age",
  description:
    "A practical list of Montessori practical life activities for toddlers and primary children, what each one develops, and how to present them in the classroom or at home.",
  alternates: {
    canonical: "/resources/montessori-practical-life-activities",
  },
};

export default function Page() {
  return (
    <main className={styles.wrap}>
      <p className={styles.kicker}>Practical Life</p>
      <article className={styles.prose}>
        <h1>Montessori Practical Life Activities by Age</h1>
        <p className={styles.lead}>
          Practical life is where most Montessori children begin. These
          everyday activities build concentration, coordination, independence,
          and a sense of order — the foundation for everything that follows.
        </p>

        <h2>Why practical life comes first</h2>
        <p>
          Practical life activities look simple — pouring, spooning, buttoning —
          but they&rsquo;re doing serious developmental work. They refine fine
          motor control, build the ability to complete a full cycle of activity,
          and give the child real independence in caring for themselves and
          their environment. The purpose isn&rsquo;t the task itself; it&rsquo;s
          the concentration and control the child develops by doing it.
        </p>

        <h2>Toddler (18 months – 3 years)</h2>
        <ul>
          <li>
            <strong>Carrying a tray</strong> — coordination and care of the
            environment.
          </li>
          <li>
            <strong>Dry pouring</strong> (beans or rice between two jugs) — a
            first pouring work with a forgiving material.
          </li>
          <li>
            <strong>Spooning</strong> between two bowls — grip and wrist control.
          </li>
          <li>
            <strong>Simple dressing frames</strong> (large buttons, velcro) —
            self-care and independence.
          </li>
          <li>
            <strong>Wiping a table</strong> — sequence, completion, and care of
            the environment.
          </li>
        </ul>

        <h2>Primary (3 – 6 years)</h2>
        <ul>
          <li>
            <strong>Water pouring</strong> between small pitchers — precision and
            control of error (the spill).
          </li>
          <li>
            <strong>Transfer with tongs or a dropper</strong> — refined fine
            motor and pincer grip, preparing the hand for writing.
          </li>
          <li>
            <strong>Buttoning, bow-tying, and lacing frames</strong> —
            independence in dressing.
          </li>
          <li>
            <strong>Polishing</strong> (shoes, wood, metal) — long sequences that
            build deep concentration.
          </li>
          <li>
            <strong>Food preparation</strong> (slicing a banana, spreading) —
            real, purposeful work.
          </li>
          <li>
            <strong>Care of plants</strong> — responsibility and gentle
            movement.
          </li>
        </ul>

        <h2>How to present a practical life activity</h2>
        <ol>
          <li>Invite the child and carry the material to the workspace together.</li>
          <li>
            Show the activity slowly and silently, with clear, exaggerated
            movements. Let your hands do the talking.
          </li>
          <li>Invite the child to try, and then step back.</li>
          <li>
            Let them repeat as many times as they like — repetition is the point,
            not correction.
          </li>
          <li>Show how to return the material exactly as they found it.</li>
        </ol>

        <p>
          Keep a &ldquo;control of error&rdquo; built in wherever you can — a
          spill to wipe, a sponge to notice — so the child can self-correct
          without you stepping in.
        </p>

        <ResourceCTA
          heading="Get fresh activity ideas in seconds"
          body="Tell Montessori Engine the age, area, and materials you have, and it generates a full activity plan — with direct and indirect aims and presentation steps."
          buttonLabel="Try the Activity Generator free"
        />
      </article>
    </main>
  );
}
