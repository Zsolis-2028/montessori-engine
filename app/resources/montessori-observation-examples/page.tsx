import type { Metadata } from "next";
import { ResourceCTA } from "@/components/ResourceCTA";
import styles from "../resources.module.css";

export const metadata: Metadata = {
  title: "Montessori Observation Examples & How to Write Them",
  description:
    "See real Montessori observation examples, the format to follow, and a step-by-step way to turn quick classroom notes into clear, professional observation records.",
  alternates: { canonical: "/resources/montessori-observation-examples" },
};

export default function Page() {
  return (
    <main className={styles.wrap}>
      <p className={styles.kicker}>Observation</p>
      <article className={styles.prose}>
        <h1>Montessori Observation Examples (and How to Write Them)</h1>
        <p className={styles.lead}>
          Observation is the heart of Montessori teaching — it&rsquo;s how you
          follow the child. But turning what you saw into a clear, useful written
          record is a skill of its own. Here&rsquo;s the format, what to include,
          and examples you can adapt.
        </p>

        <h2>What makes a good Montessori observation</h2>
        <p>
          A strong observation is <strong>objective</strong> — it describes what
          the child actually did, not what you assume they were thinking or
          feeling. It records facts you could point to: which material they
          chose, how long they worked, what they repeated, where they showed
          concentration or difficulty. Interpretation comes after, and it&rsquo;s
          kept separate from the facts.
        </p>

        <h2>A simple format to follow</h2>
        <p>Most useful observation notes contain four parts:</p>
        <ul>
          <li>
            <strong>The facts</strong> — an objective description of what the
            child did.
          </li>
          <li>
            <strong>Developmental significance</strong> — what this suggests
            about where the child is (coordination, concentration, order,
            independence, language, etc.).
          </li>
          <li>
            <strong>Follow-up</strong> — the next material or presentation you
            might offer.
          </li>
          <li>
            <strong>Context</strong> — date, child&rsquo;s age, and the area or
            setting.
          </li>
        </ul>

        <h2>Observation example: Practical Life</h2>
        <div className={styles.card}>
          <p style={{ margin: 0 }}>
            <strong>Observation:</strong> M. (3y2m) chose the pouring work
            independently and carried the tray to a table. She poured water
            between two small pitchers four times, pausing to wipe a spill with
            the sponge each time. She repeated the full cycle three times before
            returning the tray to the shelf.
          </p>
          <p style={{ margin: "12px 0 0" }}>
            <strong>Developmental significance:</strong> Shows developing
            hand-eye coordination and a strong drive to repeat and refine. Her
            self-correction with the sponge suggests emerging order and care for
            the environment.
          </p>
          <p style={{ margin: "12px 0 0" }}>
            <strong>Follow-up:</strong> Offer dry pouring with a spout, then
            introduce spooning to extend fine-motor control.
          </p>
        </div>

        <h2>Observation example: Language</h2>
        <div className={styles.card}>
          <p style={{ margin: 0 }}>
            <strong>Observation:</strong> J. (4y7m) worked with the movable
            alphabet and built the words &ldquo;cat,&rdquo; &ldquo;map,&rdquo;
            and &ldquo;sun&rdquo; without prompting. He sounded out each phoneme
            aloud before selecting a letter.
          </p>
          <p style={{ margin: "12px 0 0" }}>
            <strong>Developmental significance:</strong> Secure sound-symbol
            association and phonemic awareness; ready to move toward phonograms.
          </p>
          <p style={{ margin: "12px 0 0" }}>
            <strong>Follow-up:</strong> Introduce simple phonogram booklets and
            object boxes with three-letter words.
          </p>
        </div>

        <h2>Tips that make observations easier</h2>
        <ul>
          <li>
            Jot rough notes in the moment — a phrase is enough. Write the full
            record later.
          </li>
          <li>
            Keep facts and interpretation in separate sentences. If you catch
            yourself writing &ldquo;she loved it,&rdquo; ask what you actually
            saw that led you to say that.
          </li>
          <li>
            Note repetition and concentration — in Montessori, those matter more
            than whether the child &ldquo;got it right.&rdquo;
          </li>
          <li>Date every note so you can see growth over time.</li>
        </ul>

        <ResourceCTA
          heading="Turn your quick notes into professional observations"
          body="Jot down what you saw in plain language, and Montessori Engine writes it up as a clear observation note — with developmental significance and follow-up — in seconds."
          buttonLabel="Try the Observation Writer free"
        />
      </article>
    </main>
  );
}
