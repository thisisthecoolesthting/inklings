import Link from "next/link";
import { Sparkles, Mic, BookOpen, ShieldCheck, Wand2, Heart } from "lucide-react";
import { brand } from "@/lib/brand";
import { FAQ } from "@/components/FAQ";
import { PricingTiers } from "@/components/PricingTiers";
import { FAQ_HOME } from "@/content/faq-data";
import { FEATURES } from "@/content/feature-pages";

/**
 * Home page — follows the spine §6 six-section recipe, swapped to the
 * Inklings warm-storybook palette and consumer voice.
 */
export default function HomePage() {
  return (
    <>
      {/* SECTION 1 — Cream hero */}
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="eyebrow">A storybook your child stars in</span>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
                {brand.hero}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700 md:text-xl">
                {brand.heroSub}
              </p>
              <p className="mt-6 text-sm font-medium text-ink-500">
                {brand.trustStrip}
              </p>
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
              {/* Hero illustration placeholder — will be a real KDP-grade rendering once first stories ship */}
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
                <Sparkles className="h-20 w-20 text-coral" aria-hidden />
                <p className="text-2xl font-bold text-ink">A page from your child&apos;s book</p>
                <p className="max-w-xs text-sm text-ink-600">
                  Real illustrations swap in as soon as your first story is approved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Problem + Who it's for */}
      <section className="section bg-cream-100">
        <div className="container-ink">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-base">
              <h2 className="text-2xl font-bold text-ink">
                Screen time, but the kind you&apos;re proud of
              </h2>
              <p className="mt-4 text-ink-700">
                Most kids&apos; apps are passive entertainment. Inklings is the opposite —
                your child <em>creates</em>. They invent characters, build worlds, and write
                stories that get printed into real books they can hold. Every minute they
                spend builds something they keep.
              </p>
            </div>
            <div className="card-base">
              <h2 className="text-2xl font-bold text-ink">Who it&apos;s for</h2>
              <p className="mt-4 text-ink-700">
                Parents and grandparents of children ages 4 to 8 — especially families
                who want <em>making</em> over <em>watching</em>. Homeschoolers, bedtime-story
                households, and kids who already have an imaginary friend they talk about
                every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Capabilities + How it works */}
      <section className="section">
        <div className="container-ink">
          <div className="section-header-center">
            <span className="eyebrow">What Inklings does</span>
            <h2 className="section-title">A storybook studio, not a content feed</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card-base">
              <h3 className="mb-4 text-xl font-bold text-ink">Capabilities</h3>
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
                  <span>You create a parent account. Your child&apos;s profile is linked to yours — no separate kid login.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-coral text-sm font-bold text-white">2</span>
                  <span>Your child meets Sparky in the Studio. They build characters by talking, tapping, drawing, or photographing.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-coral text-sm font-bold text-white">3</span>
                  <span>Sparky walks them through a five-act story together — beginning, problem, adventure, resolution, celebration.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-coral text-sm font-bold text-white">4</span>
                  <span>You review and approve every page in your portal. Edit text, regenerate art, or send back for changes.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-coral text-sm font-bold text-white">5</span>
                  <span>Download a free PDF, or order a real hardcover keepsake. The book ships to your door.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION — Pricing teaser */}
      <section className="section bg-cream-100">
        <div className="container-ink">
          <div className="section-header-center">
            <span className="eyebrow">Simple pricing</span>
            <h2 className="section-title">Start free. Upgrade when it&apos;s working.</h2>
            <p className="section-subtitle">
              Free covers most weekend creators. Premium unlocks unlimited stories and HD print export.
              Real printed books are a one-time charge on any tier.
            </p>
          </div>
          <PricingTiers />
        </div>
      </section>

      {/* SECTION 4 — FAQ */}
      <section className="section">
        <div className="container-ink mx-auto max-w-3xl">
          <div className="section-header-center">
            <span className="eyebrow">Questions parents ask first</span>
            <h2 className="section-title">FAQ</h2>
          </div>
          <FAQ items={FAQ_HOME} />
        </div>
      </section>

      {/* SECTION 6 — Dark final CTA */}
      <section className="hero-final-cta py-24">
        <div className="container-ink mx-auto max-w-3xl text-center">
          <span className="eyebrow-on-dark">Make something your child keeps</span>
          <h2 className="text-3xl font-bold tracking-tight text-cream-100 md:text-4xl">
            Their first storybook is twenty minutes away.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream-200/85">
            Free to try. No credit card. Parent-approved before anything publishes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/trial" className="btn-primary btn-large">
              {brand.primaryCta}
            </Link>
            <Link href="/how-it-works" className="btn-ghost btn-large border-cream-200/60 text-cream-100 hover:bg-cream-100/10">
              {brand.secondaryCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
