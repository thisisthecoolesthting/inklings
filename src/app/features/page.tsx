import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { FEATURES } from "@/content/feature-pages";
import { BreadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = pageMetadata({
  title: "Features — the whole storybook studio",
  description:
    "Six things Inklings actually does: a voice-first kid Studio, persistent characters, drawing-to-character, parent approval, printed books, and safety.",
  path: "/features",
});

export default function FeaturesHub() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Features", path: "/features" }]} />
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Features</span>
            <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              The whole storybook studio, broken down.
            </h1>
            <p className="mt-6 text-lg text-ink-700">
              Six things Inklings actually does. Click any to dive deeper.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-ink mx-auto max-w-5xl grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.slug} href={`/features/${f.slug}`} className="card-base block hover:-translate-y-1">
              <h2 className="text-xl font-bold text-ink">{f.title}</h2>
              <p className="mt-3 text-ink-700">{f.summary}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-coral">Read more &rarr;</span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand
        title="Six features, one free story."
        body="Try them all in your first story. Free, no credit card."
        primary={{ label: "Create your first story free", href: "/trial" }}
        secondary={{ label: "Try Sparky", href: "/try" }}
      />
    </>
  );
}
