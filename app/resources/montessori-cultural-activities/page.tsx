import type { Metadata } from "next";
import { ResourceCTA } from "@/components/ResourceCTA";
import styles from "../resources.module.css";

export const metadata: Metadata = {
  title: "Montessori Cultural Activities (Geography, Science & More)",
  description:
    "A guide to Montessori cultural activities — geography, botany, zoology, and science — that open the child's world, with materials and presentation ideas.",
  alternates: { canonical: "/resources/montessori-cultural-activities" },
};

export default function Page() {
  return (
    <main className={styles.wrap}>
      <p className={styles.kicker}>Cultural</p>
      <article className={styles.prose}>
        <h1>Montessori Cultural Activities</h1>
        <p className={styles.lead}>
          The cultural area opens up the child&rsquo;s world — geography,
          botany, zoology, history, and science. It answers the endless
          &ldquo;why?&rdquo; of early childhood with real, hands-on exploration.
        </p>

        <h2>What cultural work is for</h2>
        <p>
          Cultural studies feed the child&rsquo;s natural wonder about the world
          and their place in it. The materials are concrete and beautiful, and
          they connect to language (new vocabulary), sensorial work (sorting and
          classifying), and a growing sense of care for the earth and for one
          another.
        </p>

        <h2>Geography</h2>
        <ul>
          <li>
            <strong>Sandpaper &amp; continents globes</strong> — first
            impressions of land, water, and the continents.
          </li>
          <li>
            <strong>Puzzle maps</strong> — continents, then countries, building
            toward flags and landmarks.
          </li>
          <li>
            <strong>Land and water forms</strong> — island, lake, peninsula,
            gulf, explored with real water.
          </li>
        </ul>

        <h2>Botany &amp; zoology</h2>
        <ul>
          <li>
            <strong>Parts of a plant / flower / tree</strong> — nomenclature
            cards and real specimens.
          </li>
          <li>
            <strong>Parts of animals</strong> — matching and classification.
          </li>
          <li>
            <strong>Living vs. non-living</strong> — a first big sorting of the
            world.
          </li>
          <li>
            <strong>Life cycles</strong> — the frog, the butterfly, the plant.
          </li>
        </ul>

        <h2>Simple science to try</h2>
        <ul>
          <li>Sink or float experiments.</li>
          <li>Magnetic and non-magnetic sorting.</li>
          <li>Planting seeds and observing growth over time.</li>
          <li>Day and night, and the seasons, with real observation.</li>
        </ul>

        <ResourceCTA
          heading="Plan a cultural lesson in seconds"
          body="Pick the age and topic, and Montessori Engine builds a full activity plan — with aims, materials, and presentation steps — ready for your classroom."
          buttonLabel="Try the Activity Generator free"
        />
      </article>
    </main>
  );
}
