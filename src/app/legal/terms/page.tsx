import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Terms of service — ${brand.name}`,
  description: "Terms of using Inklings.",
};

export default function TermsPage() {
  return (
    <section className="section bg-cream-100">
      <article className="container-ink mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-ink">Terms of service</h1>
        <p className="text-sm text-ink-500">Last updated: May 2026 &middot; <em>Draft &mdash; legal review pending.</em></p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Who can use Inklings</h2>
        <p className="mt-3 text-ink-700">
          Inklings is for parents creating accounts for their own children, or with the child&apos;s
          legal guardian&apos;s consent. You must be 18 or older to create an account.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Content ownership</h2>
        <p className="mt-3 text-ink-700">
          You and your child own the stories you create on Inklings. We require a license to host
          and process your content for the purpose of running the service (storage, illustration
          generation, PDF export, print fulfillment).
        </p>

        <h2 className="mt-8 text-2xl font-bold text-ink">AI-assisted illustrations</h2>
        <p className="mt-3 text-ink-700">
          Illustrations and story text are co-created with AI under your child&apos;s direction
          and your approval. Per Amazon KDP guidance, books printed through Inklings are disclosed
          as AI-assisted on the listing.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Print orders &amp; refunds</h2>
        <p className="mt-3 text-ink-700">
          Printed books are produced on demand; once a print order is sent to fulfillment, we cannot
          cancel it. Damaged or misprinted books are replaced or refunded.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Cancellation</h2>
        <p className="mt-3 text-ink-700">
          Cancel your subscription any time from your portal. Free-tier accounts remain free.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Contact</h2>
        <p className="mt-3 text-ink-700">
          <a className="text-coral underline" href="mailto:legal@inklings.shop">legal@inklings.shop</a>
        </p>
      </article>
    </section>
  );
}
