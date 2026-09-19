import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found — Inklings",
  description:
    "Sparky could not find that page. Head back to Inklings, try the free Sparky demo, or browse the FAQ.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="hero-storybook">
      <div className="container-ink section">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">Page not found</span>
          <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Sparky looked everywhere and this page isn&apos;t in the story.
          </h1>
          <p className="mt-6 text-lg text-ink-700">
            The link might be old, or the page might have moved. Let&apos;s get you back to a page
            that actually exists.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="btn-primary btn-large inline-flex">
              Back to Inklings
            </Link>
            <Link href="/faq" className="btn-secondary btn-large inline-flex">
              Visit the FAQ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
