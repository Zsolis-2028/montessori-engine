import type { Metadata } from "next";
import { ResourceCTA } from "@/components/ResourceCTA";
import styles from "../resources.module.css";

export const metadata: Metadata = {
  title: "Montessori Language Activities & Materials",
  description:
    "A guide to Montessori language activities — sandpaper letters, the movable alphabet, metal insets and more — building from sounds to reading and writing.",
  alternates: { canonical: "/resources/montessori-language-activities" },
};

export default function Page() {
  return (
    <main className={styles.wrap}>
      <p className={styles.kicker}>Language</p>
      <article className={styles.prose}>
        <h1>Montessori Language Activities &amp; Materials</h1>
        <p className={styles.lead}>
          Montessori language begins with sounds, not letters&rsquo; names, and
          with writing before reading. Children build words with their hands
          before they ever read from a book.
        </p>

        <h2>Sounds first</h2>
        <p>
          Before any material, language grows through rich spoken conversation,
          stories, songs, and vocabulary. When formal work begins, children
          learn the <em>sounds</em> letters make (&ldquo;mmm,&rdquo; not
          &ldquo;em&rdquo;) — because sounds are what you need to build and read
          words.
        </p>

        <h2>Core language materials</h2>
        <ul>
          <li>
            <strong>Sandpaper letters</strong> — tracing the letter while saying
            its sound; joins muscle memory to sound.
          </li>
          <li>
            <strong>Movable alphabet</strong> — building words from sounds before
            the hand is ready to write them.
          </li>
          <li>
            <strong>Metal insets</strong> — pencil control and preparation for
            handwriting.
          </li>
          <li>
            <strong>Object and picture boxes</strong> — matching sounds to
            objects for early phonics.
          </li>
          <li>
            <strong>Phonogram booklets</strong> — moving beyond single sounds to
            combinations like &ldquo;sh&rdquo; and &ldquo;ai.&rdquo;
          </li>
          <li>
            <strong>Grammar symbols &amp; classification cards</strong> — reading
            comprehension and the parts of speech.
          </li>
        </ul>

        <h2>How reading emerges</h2>
        <p>
          Because children build words with the movable alphabet first, reading
          often appears almost on its own — the &ldquo;explosion into
          reading.&rdquo; Your job is to keep offering sounds, then simple
          phonetic words, then phonograms, and let each child move at their own
          pace.
        </p>

        <ResourceCTA
          heading="Plan a language lesson in seconds"
          body="Choose the age and the language material, and Montessori Engine writes a full activity plan with direct and indirect aims and clear presentation steps."
          buttonLabel="Try the Activity Generator free"
        />
      </article>
    </main>
  );
}
