import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { PricingTiers } from "@/components/PricingTiers";
import { FAQ } from "@/components/FAQ";
import { FAQ_HOME } from "@/content/faq-data";

export const metadata: Metadata = {
  title: `Pricing — ${brand.name}`,
  description:
    "Free forever for one child and 3 stories a month. Premium $9.99/mo for unlimited stories and HD print export. Real printed keepsake books $19.99 each.",
};

export default function PricingPage() {
  return (
    <>
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Simple, family-friendly pricing</span>
            <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Start free. Upgrade only if it&apos;s working.
            </h1>
            <p className="mt-6 text-lg text-ink-700">
              Free covers most weekend story-makers. Premium is for families
              writing every week. Printed books are always a one-time charge.
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
