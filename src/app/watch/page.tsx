import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { CtaBand } from "@/components/CtaBand";
import { PrimaryCta } from "@/components/PrimaryCta";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Watch a 10-second tour",
  description:
    "Watch a 10-second tour of Inklings: the voice-first kid Studio, the parent approval gate, and real printed softcover storybooks. Try it free.",
  path: "/watch",
});

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
      <section className="section pt-6">
        <div className="container-ink mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/*
            The walkthrough is a 1280x720 (16:9) recording. The poster must share that
            aspect ratio; a portrait poster made the player render ~795x1060.
          */}
          <video
            controls
            muted
            playsInline
            preload="metadata"
            poster="/images/site/walkthrough-poster.jpg"
            className="mx-auto aspect-video w-full max-w-3xl rounded-card border border-ink-100 bg-ink shadow-card"
          >
            <source src="/videos/walkthrough.mp4" type="video/mp4" />
            <source src="/videos/walkthrough.webm" type="video/webm" />
            Your browser doesn&apos;t support inline video.{" "}
            <a href="/videos/walkthrough.mp4">Download the walkthrough</a>.
          </video>
          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <h2 className="text-2xl font-bold text-ink">Now try it yourself.</h2>
            <p className="text-ink-700">
              Tap through a real story beat with Sparky in about 30 seconds. No account needed.
            </p>
            <PrimaryCta href="/try" variant="secondary" microcopy={false}>
              Try it yourself
            </PrimaryCta>
          </div>
        </div>
      </section>
      <CtaBand
        title="Now try it with your child."
        primary={{ label: brand.primaryCta, href: "/trial" }}
        secondary={{ label: "Gift for grandparents", href: "/for-grandparents" }}
      />
    </>
  );
}
