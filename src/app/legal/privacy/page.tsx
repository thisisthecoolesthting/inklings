import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy policy — ${brand.name}`,
  description: "How Inklings handles your family's data.",
};

export default function PrivacyPage() {
  return (
    <section className="section bg-cream-100">
      <article className="container-ink mx-auto max-w-3xl prose prose-ink">
        <h1 className="text-4xl font-bold text-ink">Privacy policy</h1>
        <p className="text-sm text-ink-500">Last updated: May 2026 &middot; <em>Draft &mdash; legal review pending.</em></p>

        <h2 className="mt-8 text-2xl font-bold text-ink">What we collect</h2>
        <ul className="mt-3 list-disc pl-6 text-ink-700">
          <li>Parent: email address, optional name, Stripe customer ID for billing.</li>
          <li>Child: first name, age, optional avatar (parent uploads).</li>
          <li>Stories &amp; characters your child creates &mdash; stored privately to your account.</li>
          <li>Photo uploads: faces are blurred on-device <em>before</em> upload; we keep only the stylized character output and the original (private to you) for re-rendering.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-ink">What we don&apos;t do</h2>
        <ul className="mt-3 list-disc pl-6 text-ink-700">
          <li>No public profiles, no social discovery, no sharing surface.</li>
          <li>No selling or trading of your data, ever.</li>
          <li>No advertising. Inklings is a paid product.</li>
          <li>No collection of biometric data &mdash; face detection runs in your browser and the face never reaches us.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-ink">COPPA &amp; children</h2>
        <p className="mt-3 text-ink-700">
          Inklings is built for children under 13. The parent creates and controls the account.
          We collect only what is necessary to operate the service. You can delete your account
          and all associated data at any time from your portal settings.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Contact</h2>
        <p className="mt-3 text-ink-700">
          Privacy questions: <a className="text-coral underline" href="mailto:hello@inklings.shop">hello@inklings.shop</a>
        </p>
      </article>
    </section>
  );
}
