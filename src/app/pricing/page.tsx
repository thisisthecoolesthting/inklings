import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { PricingTiers } from "@/components/PricingTiers";
import { CharacterShelf } from "@/components/marketing/CharacterShelf";
import { FAQ } from "@/components/FAQ";
import { FAQ_HOME, FAQ_CARD_ITEM } from "@/content/faq-data";
import { BreadcrumbJsonLd, ProductOffersJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = pageMetadata({
  title: "Pricing — simple plans for families",
  description:
    "Free forever for one child and 3 stories a month. Premium $9.99/mo for unlimited stories and HD print export. Real printed softcover books $19.99 each.",
  path: "/pricing",
});

const PRICING_OFFERS = [
  { name: "Free", price: "0", description: "One child, 3 stories per month, parent approval included." },
  { name: "Premium", price: "9.99", description: "Unlimited stories, HD illustrations, full character bible." },
  {
    name: "Printed softcover",
    price: "19.99",
    description: "One-time printed 8.5 inch softcover per approved story.",
  },
];

export default function PricingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ]}
      />
      <ProductOffersJsonLd offers={PRICING_OFFERS} />
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Simple, family-friendly pricing</span>
            <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Start free. Upgrade only if it&apos;s working.
            </h1>
            <p className="mt-6 text-lg text-ink-700">
              Free covers most weekend story-makers. Premium is for families
              writing every week. Printed softcovers are $19.99 each — one-time,
              on any plan.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-ink">
          <PricingTiers />
        </div>
      </section>

      <section className="section-mobile bg-cream-100">
        <div className="container-ink">
          <div className="mx-auto max-w-xl text-center">
            <span className="eyebrow">What Premium&apos;s &quot;series memory&quot; looks like</span>
            <h2 className="text-2xl font-bold text-ink">A shelf that keeps growing</h2>
          </div>
          <div className="mt-6">
            <CharacterShelf compact />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-ink mx-auto max-w-3xl">
          <div className="section-header-center">
            <h2 className="section-title">Questions parents ask</h2>
          </div>
          <FAQ items={[FAQ_CARD_ITEM, ...FAQ_HOME.filter((f) => f !== FAQ_CARD_ITEM)]} />
        </div>
      </section>

      <CtaBand
        title="Ready when you are"
        body="No credit card to start. Cancel any time."
        primary={{ label: brand.primaryCta, href: "/trial" }}
        secondary={{ label: "Try Sparky in 30 seconds", href: "/try" }}
      />
    </>
  );
}
