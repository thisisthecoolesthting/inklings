import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { TasteOfSparky } from "@/components/marketing/TasteOfSparky";
import { pageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/lib/jsonld";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = pageMetadata({
  title: "Try Sparky free — no account needed",
  description:
    "Tap a setting and watch Sparky turn it into a storybook page in seconds. No account, no credit card — a 30-second taste of the real Inklings Studio.",
  path: "/try",
});

export default function TryPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Try Sparky", path: "/try" }]} />
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">No account needed</span>
            <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Try Sparky in 30 seconds.
            </h1>
            <p className="mt-4 text-lg text-ink-700">
              This is the exact branching-choice pattern your child uses in the real Studio —
              just tap a setting below.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <TasteOfSparky showEmailOption />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-500">
            This preview is a fixed demo, not a live AI call. The real Studio writes and
            illustrates a brand-new story from scratch with your child.{" "}
            <Link href="/how-it-works" className="text-coral underline">
              See how it really works
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaBand
        title="Ready for the real thing?"
        body="Free to try. No credit card. Buying for a grandchild? Gift Premium instead."
        primary={{ label: brand.primaryCta, href: "/trial" }}
        secondary={{ label: "Gift Premium", href: "/gift" }}
      />
    </>
  );
}
