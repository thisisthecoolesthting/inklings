import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `About — ${brand.name}`,
  description: "Why Inklings exists and how we think about kids' creative tools.",
};

export default function AboutPage() {
  return (
    <>
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow">About {brand.name}</span>
            <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              We make stories children keep, not feeds children scroll.
            </h1>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-ink mx-auto max-w-3xl space-y-6 text-lg text-ink-700">
          <p>
            Inklings started with a simple idea: most software for kids is designed to hold their
            attention. That&apos;s the wrong job. The job we wanted was to give kids a place to <em>make</em>
            something — something they keep, something parents are proud they spent twenty minutes on,
            something that holds up on a bookshelf.
          </p>
          <p>
            Books do that. Books made by your own kid, starring their own characters,
            in their own voice — those are family heirlooms before they&apos;re even printed.
          </p>
          <p>
            So Inklings is a storybook studio. Voice-first because most four-year-olds can&apos;t read
            yet. Parent-gated because nothing your child invents should publish or ship without
            you seeing it first. Printed in the real world because pixels disappear and books don&apos;t.
          </p>
          <p>
            We&apos;re a small team and we read every email. Tell us what your kid made:
            <Link className="ml-1 text-coral underline" href="/contact">say hello</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
