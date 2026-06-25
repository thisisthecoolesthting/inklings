import type { Metadata } from "next";
import Link from "next/link";
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
        <p className="text-sm text-ink-500">Last updated: June 2026</p>

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
          and your approval. Printed books may be disclosed as AI-assisted where required.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Print orders &amp; refunds</h2>
        <p className="mt-3 text-ink-700">
          Printed books are produced on demand; once a print order is sent to fulfillment, we cannot
          cancel it. Damaged or misprinted books are replaced or refunded.
        </p>

        <h2 id="cancellation" className="mt-8 scroll-mt-24 text-2xl font-bold text-ink">
          Cancellation — one click
        </h2>
        <p className="mt-3 text-ink-700">
          Premium subscriptions can be cancelled anytime with no phone call and no email required.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-ink-700">
          <li>Sign in to your parent portal.</li>
          <li>Open <strong>Settings</strong>.</li>
          <li>Click <strong>Manage billing</strong> — Stripe opens your subscription page.</li>
          <li>Click <strong>Cancel plan</strong>. Access continues until the end of the paid period.</li>
        </ol>
        <p className="mt-4 text-ink-700">
          Free accounts stay free — nothing to cancel. Questions?{" "}
          <a className="text-coral underline" href="mailto:hello@inklings.shop">hello@inklings.shop</a>
        </p>
        <p className="mt-4">
          <Link href="/api/billing/portal" className="btn-secondary inline-flex text-sm">
            Open billing portal (signed-in parents)
          </Link>
        </p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Contact</h2>
        <p className="mt-3 text-ink-700">
          <a className="text-coral underline" href="mailto:hello@inklings.shop">hello@inklings.shop</a>
        </p>
      </article>
    </section>
  );
}
