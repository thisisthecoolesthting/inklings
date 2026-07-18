import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Watch a quick tour — ${brand.name}`,
  description:
    "Ten seconds — what Inklings actually does. Voice-first kid Studio, parent approval gate, real printed books.",
};

export default function WatchPage() {
  return (
    <>
      <section className="hero-storybook">
        <div className="container-ink section pb-8 pt-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Quick tour</span>
            <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Ten seconds — see Inklings.
            </h1>
            <p className="mt-4 text-lg text-ink-700">
              Voice-first Studio · parent approval · real softcover books.
            </p>
          </div>
        </div>
      </section>
      <section className="section pt-0">
        <div className="container-ink mx-auto max-w-4xl">
          <video
            controls
            muted
            playsInline
            preload="metadata"
            poster="/images/marketing/print-hardcover.jpg"
            className="w-full rounded-card border border-ink-100 shadow-card"
          >
            <source src="/videos/walkthrough.webm" type="video/webm" />
            Your browser doesn&apos;t support inline video.{" "}
            <a href="/videos/walkthrough.webm">Download the walkthrough</a>.
          </video>
        </div>
      </section>
      <section className="hero-final-cta py-20">
        <div className="container-ink mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-cream-100">Now try it with your child.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/trial" className="btn-primary btn-large">
              {brand.primaryCta}
            </Link>
            <Link
              href="/for-grandparents"
              className="btn-ghost btn-large border-cream-200/60 text-cream-100 hover:bg-cream-100/10"
            >
              Gift for grandparents
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
