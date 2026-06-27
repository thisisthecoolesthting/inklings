import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { brand } from "@/lib/brand";
import { FAQ } from "@/components/FAQ";
import { PricingTiers } from "@/components/PricingTiers";
import { FAQ_HOME } from "@/content/faq-data";
import { FaqPageJsonLd } from "@/lib/jsonld";
import { FEATURES } from "@/content/feature-pages";
import { AUDIENCE_LANDINGS } from "@/content/audience-landings";
import { SampleStoryGallery, PrintShowcase } from "@/components/marketing/StoryVisuals";
import { StudioPreviewSection } from "@/components/marketing/StudioPreviewSection";
import { HomeHero } from "@/components/marketing/HomeHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `${brand.name} — Build a story universe your child runs`,
  description:
    "Inklings lets kids ages 5-8 build a story universe where their characters return across every story. Voice-first, parent-approved, real printed books.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <FaqPageJsonLd items={FAQ_HOME} />
      <HomeHero />

      <section className="section bg-cream-100">
        <div className="container-ink">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-base">
              <h2 className="text-2xl font-bold text-ink">Making, not watching</h2>
              <p className="mt-4 text-ink-700">
                Your child picks what happens next. Sparky turns their choices into illustrated pages.
                You review once — then order a hardcover that ships to your door.
              </p>
            </div>
            <div className="card-base">
              <h2 className="text-2xl font-bold text-ink">Who it&apos;s for</h2>
              <p className="mt-4 text-ink-700">
                Parents and grandparents of children ages 5 to 8 — especially families who want a
                keepsake, not another passive app. Characters and worlds carry across every book in their collection.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {AUDIENCE_LANDINGS.map((l) => (
                  <li key={l.path}>
                    <Link href={l.path} className="rounded-full bg-mint-100 px-3 py-1 text-sm font-medium text-ink-700 hover:bg-mint-200">
                      {l.breadcrumbLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <StudioPreviewSection />
      <SampleStoryGallery />
      <PrintShowcase />

      <section className="section">
        <div className="container-ink">
          <div className="section-header-center">
            <span className="eyebrow">Simple steps</span>
            <h2 className="section-title">From imagination to bookshelf</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card-base">
              <h3 className="mb-4 text-xl font-bold text-ink">What your child gets</h3>
              <ul className="space-y-3 text-ink-700">
                {FEATURES.map((f) => (
                  <li key={f.slug} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-mint-100 text-coral">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <div>
                      <strong className="text-ink">{f.title}</strong> &mdash; {f.summary}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-base">
              <h3 className="mb-4 text-xl font-bold text-ink">How it works</h3>
              <ol className="space-y-4 text-ink-700">
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-coral text-sm font-bold text-white">1</span>
                  <span>You sign up — your child uses your account in Sparky&apos;s Studio (no kid password).</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-coral text-sm font-bold text-white">2</span>
                  <span>They meet Sparky, create characters, and tap through a short adventure together.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-coral text-sm font-bold text-white">3</span>
                  <span>Illustrated pages appear as they go — a real storybook takes shape in minutes.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-coral text-sm font-bold text-white">4</span>
                  <span>You approve the finished book in your portal — edit text or art if you want.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-coral text-sm font-bold text-white">5</span>
                  <span>Download a PDF or order a hardcover keepsake — the book ships to your door.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-ink">
          <div className="section-header-center">
            <span className="eyebrow">Simple pricing</span>
            <h2 className="section-title">Start free. Print when you&apos;re ready.</h2>
            <p className="section-subtitle">
              Try your first book free. Premium unlocks unlimited stories and HD export.
              Printed hardcovers are a one-time add-on on any plan.
            </p>
          </div>
          <PricingTiers />
        </div>
      </section>

      <section className="section">
        <div className="container-ink mx-auto max-w-3xl">
          <div className="section-header-center">
            <span className="eyebrow">Questions parents ask first</span>
            <h2 className="section-title">FAQ</h2>
          </div>
          <FAQ items={FAQ_HOME} />
        </div>
      </section>

      <section className="hero-final-cta py-24">
        <div className="container-ink mx-auto max-w-3xl text-center">
          <span className="eyebrow-on-dark">A book they can hold</span>
          <h2 className="text-3xl font-bold tracking-tight text-cream-100 md:text-4xl">
            Their first book is about twenty minutes away.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream-200/85">
            Free to try. No credit card. You approve before anything publishes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/trial" className="btn-primary btn-large">
              {brand.primaryCta}
            </Link>
            <Link href="/for-grandparents" className="btn-ghost btn-large border-cream-200/60 text-cream-100 hover:bg-cream-100/10">
              Gift for grandparents
            </Link>
            <Link href="/gift" className="btn-ghost btn-large border-cream-200/60 text-cream-100 hover:bg-cream-100/10">
              Gift Premium
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
