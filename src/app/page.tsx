import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { FAQ } from "@/components/FAQ";
import { PricingTiers } from "@/components/PricingTiers";
import { FAQ_HOME } from "@/content/faq-data";
import { FaqPageJsonLd } from "@/lib/jsonld";
import { AUDIENCE_LANDINGS } from "@/content/audience-landings";
import { StudioPreviewSection } from "@/components/marketing/StudioPreviewSection";
import { HomeHero } from "@/components/marketing/HomeHero";
import { TasteOfSparky } from "@/components/marketing/TasteOfSparky";
import { SafetyComparison } from "@/components/marketing/SafetyComparison";
import { FullPageTrigger } from "@/components/marketing/FullPageLightbox";
import { pageMetadata } from "@/lib/seo";
import { PrimaryCta } from "@/components/PrimaryCta";

/** Top FAQ only — full list lives on /faq */
const FAQ_TEASERS = FAQ_HOME.slice(0, 4);

export const metadata: Metadata = pageMetadata({
  title: `${brand.name} — Build a story universe your child runs`,
  description:
    "Inklings lets kids ages 4-8 build a story universe where their characters return across every story. Voice-first, parent-approved, real printed books.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <FaqPageJsonLd items={FAQ_TEASERS} />
      <HomeHero />

      <section className="section-mobile pb-0 md:pb-0">
        <div className="container-ink">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Try it right now</span>
            <h2 className="section-title">A taste of Sparky — no account needed</h2>
          </div>
          <div className="mx-auto mt-8 max-w-2xl">
            <TasteOfSparky />
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
                You review once — then order a softcover that ships to your door.
              </p>
              <p className="mt-3 text-sm font-semibold text-ink-600">
                Softcover keepsake · $19.99 · ships in 7–10 days
              </p>
              <div className="mt-5">
                <PrimaryCta href="#see-it-in-action" variant="secondary" microcopy={false}>
                  See a real 20-minute book ↓
                </PrimaryCta>
              </div>
            </div>
            <div className="card-base">
              <h2 className="text-2xl font-bold text-ink">Who it&apos;s for</h2>
              <p className="mt-4 text-ink-700">
                Parents and grandparents of children ages 4-8 — especially families who want a
                keepsake, not another passive app.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {AUDIENCE_LANDINGS.map((l) => (
                  <li key={l.path}>
                    <Link
                      href={l.path}
                      className="rounded-full bg-mint-100 px-3 py-1 text-sm font-medium text-ink-700 hover:bg-mint-200"
                    >
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

      <div className="bg-cream-100 pb-16 pt-2">
        <div className="container-ink flex justify-center">
          <FullPageTrigger />
        </div>
      </div>

      <section className="section bg-cream-100">
        <div className="container-ink">
          <div className="section-header-center">
            <span className="eyebrow">Simple pricing</span>
            <h2 className="section-title">Start free. Print when you&apos;re ready.</h2>
            <p className="section-subtitle">
              Try your first story free. Premium unlocks unlimited stories and HD export.
              Printed softcovers are a one-time add-on on any plan.
            </p>
          </div>
          <PricingTiers headingLevel="h3" />
          <div className="mt-8 flex justify-center">
            <PrimaryCta href="/pricing" variant="secondary" microcopy={false}>
              Compare all plans
            </PrimaryCta>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-ink mx-auto max-w-3xl">
          <div className="section-header-center">
            <span className="eyebrow">Questions parents ask first</span>
            <h2 className="section-title">FAQ</h2>
          </div>
          <FAQ items={FAQ_TEASERS} />
          <p className="mt-6 text-center">
            <Link href="/faq" className="font-semibold text-coral hover:underline">
              More answers →
            </Link>
          </p>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-ink">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Not another chatbot</span>
            <h2 className="section-title">Safety is the first feature</h2>
            <p className="section-subtitle">
              Sparky never hands a child an open text box.{" "}
              <Link href="/security" className="text-coral underline">
                See how Sparky is different →
              </Link>
            </p>
          </div>
          <div className="mt-10">
            <SafetyComparison compact />
          </div>
          <div className="mt-8 flex justify-center">
            <PrimaryCta href="/try" variant="secondary" microcopy={false}>
              Try the safe version yourself
            </PrimaryCta>
          </div>
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
            <Link
              href="/for-grandparents"
              className="btn-ghost btn-large border-cream-200/60 text-cream-100 hover:bg-cream-100/10"
            >
              Gift for grandparents
            </Link>
            <Link
              href="/gift"
              className="btn-ghost btn-large border-cream-200/60 text-cream-100 hover:bg-cream-100/10"
            >
              Gift Premium
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
