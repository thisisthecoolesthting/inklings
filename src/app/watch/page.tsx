import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Watch a quick tour — ${brand.name}`,
  description: "Ten seconds — what Inklings actually does. Voice-first kid Studio, parent approval gate, real printed books.",
};

export default function WatchPage() {
  return (
    <>
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Quick tour</span>
            <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Ten seconds — see Inklings.
            </h1>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-ink mx-auto max-w-4xl">
          <video
            controls
            autoPlay
            muted
            playsInline
            poster="/images/site/og-default.svg"
            className="w-full rounded-card border border-ink-100 shadow-card"
          >
            <source src="/videos/walkthrough.webm" type="video/webm" />
            Your browser doesn&apos;t support inline video. Download the file: <a href="/videos/walkthrough.webm">walkthrough.webm</a>.
          </video>
        </div>
      </section>
      <section className="hero-final-cta py-20">
        <div className="container-ink mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-cream-100">Now try it with your child.</h2>
          <Link href="/trial" className="btn-primary btn-large mt-8 inline-flex">{brand.primaryCta}</Link>
        </div>
      </section>
    </>
  );
}
