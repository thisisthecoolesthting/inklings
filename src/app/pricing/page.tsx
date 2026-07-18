import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { PricingTiers } from "@/components/PricingTiers";
import { FAQ } from "@/components/FAQ";
import { FAQ_HOME } from "@/content/faq-data";
import { BreadcrumbJsonLd, ProductOffersJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

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

      <section className="section bg-cream-100">
        <div className="container-ink mx-auto max-w-3xl">
          <div className="section-header-center">
            <h2 className="section-title">Questions parents ask</h2>
          </div>
          <FAQ items={FAQ_HOME} />
        </div>
      </section>

      <section className="hero-final-cta py-20">
        <div className="container-ink mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-cream-100">Ready when you are</h2>
          <p className="mt-3 text-cream-200/85">No credit card to start. Cancel any time.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/trial" className="btn-primary btn-large">{brand.primaryCta}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
