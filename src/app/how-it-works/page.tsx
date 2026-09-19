import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import { PrimaryCta } from "@/components/PrimaryCta";
import { CtaBand } from "@/components/CtaBand";
import { FullPageTrigger } from "@/components/marketing/FullPageLightbox";

export const metadata: Metadata = pageMetadata({
  title: "How it works — from idea to printed book",
  description:
    "See how Inklings works in five steps: your child taps choices with Sparky, you approve every page, then order a real printed softcover keepsake.",
  path: "/how-it-works",
});

const STEPS = [
  { n: 1, title: "Parent makes the account", body: "You sign up with email — no credit card. Add your child's first name and age." },
  { n: 2, title: "Your child meets Sparky", body: "Sparky greets them in the kid Studio. Voice-first, with giant tap-buttons. No reading needed." },
  { n: 3, title: "They build a character family", body: "Photograph a stuffed animal, draw a hero, or describe one out loud. Inklings turns each into a starring character with a saved look so they appear the same in every story." },
  { n: 4, title: "They write a five-act story", body: "Beginning, problem, adventure, resolution, celebration — Sparky walks through each act with simple branching choices. Never an empty text box." },
  { n: 5, title: "You approve and print", body: "Every page comes to your portal for review. Approve, edit text, or regenerate art. Download a free PDF or order a real softcover keepsake." },
];

export default function HowPage() {
  return (
    <>
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">How {brand.name} works</span>
            <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              From their imagination to a real book in their hands.
            </h1>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-ink mx-auto max-w-3xl">
          <ol className="space-y-8">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-6 card-base">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-coral text-xl font-bold text-white">{s.n}</span>
                <div>
                  <h2 className="text-xl font-bold text-ink">{s.title}</h2>
                  <p className="mt-2 text-ink-700">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start">
            <PrimaryCta href="/trial">Start your free story</PrimaryCta>
            <PrimaryCta href="/watch" variant="secondary" microcopy={false}>
              Watch the 10-second tour
            </PrimaryCta>
          </div>

          <div className="card-base mt-12 overflow-hidden p-0">
            <video
              controls
              autoPlay
              muted
              playsInline
              poster="/images/site/walkthrough-poster.jpg"
              className="w-full rounded-card border-t-0 border border-ink-100"
            >
              <source src="/videos/walkthrough.mp4" type="video/mp4" />
              <source src="/videos/walkthrough.webm" type="video/webm" />
            </video>
            <div className="flex flex-wrap items-center justify-between gap-2 p-6 text-sm text-ink-500">
              <span>A 10-second tour of Inklings.</span>
              <Link href="/watch" className="font-semibold text-coral underline underline-offset-4">
                Watch full-screen
              </Link>
            </div>
          </div>

          <div id="printed" className="card-base mt-12 overflow-hidden p-0">
            <Image
              src="/images/site/hero-storybook.jpg"
              alt="Illustrated Inklings storybook cover — the same art style that ships in print"
              width={1024}
              height={576}
              className="h-56 w-full object-cover sm:h-72"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold text-ink">About the printed books</h2>
              <p className="mt-3 text-ink-700">
                Softcover, 8.5&quot; &times; 8.5&quot;, 24&ndash;32 pages, full-color throughout.
                Professionally printed and shipped directly to your door in 7&ndash;10 business days.
                One-time charge on any tier &mdash; $19.99 per book.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <FullPageTrigger />
                <PrimaryCta href="/pricing#book" variant="secondary" microcopy={false}>
                  See pricing
                </PrimaryCta>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Try the studio yourself first"
        body="A free story takes about twenty minutes."
        primary={{ label: brand.primaryCta, href: "/trial" }}
        secondary={{ label: "Try Sparky first (no account)", href: "/try" }}
      />
    </>
  );
}
