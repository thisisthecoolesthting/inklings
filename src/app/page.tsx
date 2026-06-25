import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { brand } from "@/lib/brand";
import { FAQ } from "@/components/FAQ";
import { PricingTiers } from "@/components/PricingTiers";
import { FAQ_HOME } from "@/content/faq-data";
import { FaqPageJsonLd } from "@/lib/jsonld";
import { FEATURES } from "@/content/feature-pages";
import { SampleStoryGallery, PrintShowcase } from "@/components/marketing/StoryVisuals";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { KidDemoVideo } from "@/components/marketing/KidDemoVideo";

export default function HomePage() {
  return (
    <>
      <FaqPageJsonLd items={FAQ_HOME} />
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="eyebrow">For kids 5–8 · Parent-approved</span>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
                {brand.hero}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700 md:text-xl">
                {brand.heroSub}
              </p>
              <TrustBadges className="mt-8" />
              <p className="mt-6 text-sm font-medium text-ink-500">{brand.trustStrip}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/trial" className="btn-primary btn-large">
                  {brand.primaryCta}
                </Link>
                <Link href="/how-it-works" className="btn-ghost btn-large">
                  {brand.secondaryCta}
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-cream-200 shadow-card">
              <Image
                src="/images/site/hero-storybook.jpg"
                alt="Illustrated storybook scene — child, puppy, and fox in a sunlit meadow"
                width={1024}
                height={1280}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

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
            </div>
          </div>
        </div>
      </section>

      <KidDemoVideo />
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
            <Link href="/gift" className="btn-ghost btn-large border-cream-200/60 text-cream-100 hover:bg-cream-100/10">
              Gift Premium
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
