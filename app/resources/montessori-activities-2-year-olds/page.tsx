import type { Metadata } from "next";
import { ResourceCTA } from "@/components/ResourceCTA";
import styles from "../resources.module.css";

export const metadata: Metadata = {
  title: "Montessori Activities for 2 Year Olds",
  description:
    "Simple, hands-on Montessori activities for 2 year olds — practical life, movement, language and sensory play that build independence and coordination.",
  alternates: { canonical: "/resources/montessori-activities-2-year-olds" },
};

export default function Page() {
  return (
    <main className={styles.wrap}>
      <p className={styles.kicker}>Ages &amp; stages</p>
      <article className={styles.prose}>
        <h1>Montessori Activities for 2 Year Olds</h1>
        <p className={styles.lead}>
          Two-year-olds are movers, doers, and fierce little independents. The
          best Montessori activities at this age are simple, real, and give them
          a chance to do things &ldquo;all by myself.&rdquo;
        </p>

        <h2>What 2 year olds are working on</h2>
        <p>
          At two, children are refining gross and fine motor skills, absorbing
          language at an astonishing rate, and driven by a powerful need for
          independence and order. Keep activities short, concrete, and
          repeatable — and expect them to want to do the same thing over and over.
        </p>

        <h2>Practical life</h2>
        <ul>
          <li>Carrying a small tray or watering can.</li>
          <li>Spooning or scooping between two bowls.</li>
          <li>Wiping up spills with a small sponge.</li>
          <li>Putting on shoes and simple dressing.</li>
          <li>Helping with real tasks — washing vegetables, feeding a pet.</li>
        </ul>

        <h2>Movement &amp; coordination</h2>
        <ul>
          <li>Walking on a line or low balance beam.</li>
          <li>Simple posting and sorting activities.</li>
          <li>Stacking and nesting.</li>
        </ul>

        <h2>Language &amp; sensory</h2>
        <ul>
          <li>Naming real objects and simple picture cards.</li>
          <li>Reading and re-reading short, realistic books.</li>
          <li>Sensory bins with scooping and pouring.</li>
          <li>Singing songs with movement.</li>
        </ul>

        <h2>Setting up for success</h2>
        <p>
          Keep just a few activities out at a time on low, open shelves so the
          child can choose and return them independently. Use real, child-sized
          tools that actually work, and let them do as much of each task
          themselves as they can.
        </p>

        <ResourceCTA
          heading="Fresh activity ideas for your 2 year olds"
          body="Tell Montessori Engine the age and what you have on hand, and it generates a full, age-appropriate activity plan in seconds."
          buttonLabel="Try the Activity Generator free"
        />
      </article>
    </main>
  );
}
