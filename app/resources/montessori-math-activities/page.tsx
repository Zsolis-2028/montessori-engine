import type { Metadata } from "next";
import { ResourceCTA } from "@/components/ResourceCTA";
import styles from "../resources.module.css";

export const metadata: Metadata = {
  title: "Montessori Math Activities & Materials",
  description:
    "A guide to Montessori math activities — number rods, sandpaper numbers, the golden beads, spindle boxes and more — and the order to introduce them.",
  alternates: { canonical: "/resources/montessori-math-activities" },
};

export default function Page() {
  return (
    <main className={styles.wrap}>
      <p className={styles.kicker}>Math</p>
      <article className={styles.prose}>
        <h1>Montessori Math Activities &amp; Materials</h1>
        <p className={styles.lead}>
          Montessori math moves from concrete to abstract. Children hold
          quantity in their hands long before they work with symbols on paper,
          which is why the concepts stick.
        </p>

        <h2>Concrete before abstract</h2>
        <p>
          The genius of Montessori math is that every idea begins as something
          the child can touch. Quantity comes first, then the symbol, then the
          two are joined. A child who has built &ldquo;one thousand&rdquo; from
          golden beads understands place value in a way a worksheet can never
          teach.
        </p>

        <h2>The usual sequence</h2>
        <ol>
          <li>
            <strong>Number rods</strong> — quantity 1–10 as fixed lengths.
          </li>
          <li>
            <strong>Sandpaper numbers</strong> — the symbols, traced by hand.
          </li>
          <li>
            <strong>Spindle boxes</strong> — associating quantity with symbol,
            and meeting zero.
          </li>
          <li>
            <strong>Cards and counters</strong> — reinforcing 1–10 and exploring
            odd and even.
          </li>
          <li>
            <strong>Golden beads</strong> — the decimal system: units, tens,
            hundreds, thousands.
          </li>
          <li>
            <strong>Teen and ten boards</strong> — building 11–99.
          </li>
          <li>
            <strong>Stamp game &amp; bead chains</strong> — operations and
            skip-counting toward multiplication.
          </li>
        </ol>

        <h2>Tips for math work</h2>
        <ul>
          <li>
            Don&rsquo;t rush to symbols — let the child work with quantity until
            it&rsquo;s effortless.
          </li>
          <li>
            Use the three-period lesson to connect quantity and symbol.
          </li>
          <li>
            Follow the child&rsquo;s interest — many children love the golden
            beads and will happily build huge numbers.
          </li>
          <li>Keep the control of error visible so the child self-corrects.</li>
        </ul>

        <ResourceCTA
          heading="Plan a math lesson in seconds"
          body="Tell Montessori Engine the age and the math material you're introducing, and it builds a full activity plan with aims and presentation steps."
          buttonLabel="Try the Activity Generator free"
        />
      </article>
    </main>
  );
}
