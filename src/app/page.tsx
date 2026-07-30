import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { FAQ } from "@/components/FAQ";
import { PricingTiers } from "@/components/PricingTiers";
import { FAQ_HOME } from "@/content/faq-data";
import { FaqPageJsonLd } from "@/lib/jsonld";
import { HomeHero } from "@/components/marketing/HomeHero";
import { StorybookJourneySection } from "@/components/marketing/StorybookJourneySection";
import { PrinciplesBand } from "@/components/marketing/PrinciplesBand";
import { CraftSection } from "@/components/marketing/CraftSection";
import { FinalCta } from "@/components/marketing/FinalCta";
import { pageMetadata } from "@/lib/seo";

/** Top FAQ only — full list lives on /faq */
const FAQ_TEASERS = FAQ_HOME.slice(0, 4);

export const metadata: Metadata = pageMetadata({
  title: `${brand.name} — Build a story universe your child runs`,
  description:
    "Inklings lets kids ages 5-8 build a story universe where their characters return across every story. Voice-first, parent-approved, real printed books.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <FaqPageJsonLd items={FAQ_TEASERS} />
      <HomeHero />

      <StorybookJourneySection />

      <PrinciplesBand />

      <CraftSection />

      <section className="section paper-grain relative overflow-hidden bg-cream-100">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[52rem] max-w-none -translate-x-1/2 rounded-full bg-gold/15 blur-3xl"
        />
        <div className="container-ink relative">
          <div className="section-header-center">
            <span className="eyebrow">Simple pricing</span>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Start free. Print when you&apos;re ready.
            </h2>
            <div className="gold-rule" />
            <p className="section-subtitle mt-4">
              Try your first book free. Premium unlocks unlimited stories and HD export.
              Printed softcovers are a one-time add-on on any plan.
            </p>
          </div>
          <PricingTiers />
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-ink mx-auto max-w-3xl">
          <div className="section-header-center">
            <span className="eyebrow">Questions parents ask first</span>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Fair questions, straight answers.
            </h2>
            <div className="gold-rule" />
          </div>
          <FAQ items={FAQ_TEASERS} />
          <p className="mt-6 text-center">
            <Link href="/faq" className="font-bold text-coral hover:underline">
              More answers →
            </Link>
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
