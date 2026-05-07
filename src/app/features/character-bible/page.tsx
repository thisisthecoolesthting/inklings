import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { BreadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `Persistent character family — ${brand.name}`,
  description: "Characters your child invents stay alive across every story. Same look, same personality, same voice. The Character Bible.",
};

export default function FeatureBible() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Features", path: "/features" }, { name: "Persistent character family", path: "/features/character-bible" }]} />
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow">Feature deep-dive</span>
            <h1 className="text-4xl font-bold text-ink md:text-5xl">A persistent family of characters, not a one-off book.</h1>
            <p className="mt-6 text-lg text-ink-700">
              The book is the artifact. The <em>family</em> of characters your child invents — Biscuit the puppy, Saffron the magical fox, every recurring friend — is the actual product. They show up across every story. They remember each other.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-ink mx-auto max-w-3xl space-y-6 text-ink-700">
          <div className="card-base">
            <h2 className="text-2xl font-bold text-ink">The Character Bible</h2>
            <p className="mt-3">
              Each character your child creates gets a permanent record: name, species, personality traits, favorite activities, recurring phrases, a locked illustration seed. When the same character appears in story #4, they look like the same character from story #1.
            </p>
          </div>
          <div className="card-base">
            <h2 className="text-2xl font-bold text-ink">Series memory (Premium)</h2>
            <p className="mt-3">
              On the Premium tier, characters carry memory across the whole series. Sparky knows that Biscuit found the lost bell in the meadowlands, and weaves that thread into the next adventure. Your child&apos;s storybook universe accumulates depth, week by week.
            </p>
          </div>
          <div className="card-base">
            <h2 className="text-2xl font-bold text-ink">Why this is the real moat</h2>
            <p className="mt-3">
              A children&apos;s book made by AI is a commodity. A children&apos;s book starring <em>your kid&apos;s</em> imagined puppy, drawn the same way every time, with personality your kid already knows by heart — that&apos;s a heirloom. The Character Bible is the difference.
            </p>
          </div>
        </div>
      </section>

      <section className="hero-final-cta py-20">
        <div className="container-ink mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-cream-100">Build a family. Keep a library.</h2>
          <Link href="/trial" className="btn-primary btn-large mt-8 inline-flex">{brand.primaryCta}</Link>
        </div>
      </section>
    </>
  );
}
