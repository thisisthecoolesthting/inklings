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
        <p className="text-sm text-ink-500">Last updated: September 2026</p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Who operates Inklings</h2>
        <p className="mt-3 text-ink-700">
          Inklings is operated by {"{{OPERATOR_LEGAL_NAME}}"} ({"{{OPERATOR_MAILING_ADDRESS}}"}).
          For any privacy question, request, or concern, email{" "}
          <a className="text-coral underline" href="mailto:hello@inklings.shop">hello@inklings.shop</a>{" "}
          — we read every message ourselves.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-ink">What we collect</h2>
        <ul className="mt-3 list-disc pl-6 text-ink-700">
          <li>
            <strong>Account info:</strong> the parent&apos;s email address, optional name, and a
            Stripe customer ID for billing (if you subscribe or order a print).
          </li>
          <li>
            <strong>Child profile info:</strong> your child&apos;s first name, age range, and an
            optional avatar you upload. We never ask for a last name, birthdate, or contact
            details for the child.
          </li>
          <li>
            <strong>Story &amp; character inputs:</strong> the characters, worlds, and story
            choices your child creates in the Studio &mdash; stored privately to your account so
            characters can return across stories.
          </li>
          <li>
            <strong>Voice input during Studio sessions:</strong> the Studio uses your browser&apos;s
            built-in speech recognition (the Web Speech API) to turn your child&apos;s spoken
            choices into text. That audio is processed by your browser/device, not by Inklings
            &mdash; our servers only ever receive the resulting text transcript. We do not record,
            upload, or store raw voice audio.
          </li>
          <li>
            <strong>Photo uploads:</strong> if you upload a photo to inspire a character, on-device
            face detection blurs any face in your browser <em>before</em> the image ever reaches
            our servers. We keep the stylized illustration output and the (already-blurred)
            original privately to your account, so it can be re-rendered later.
          </li>
          <li>
            <strong>Usage analytics:</strong> basic, IP-anonymized product analytics (see Cookies
            below) so we can see which pages and features are used, and fix what&apos;s broken.
          </li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-ink">Who we share data with</h2>
        <p className="mt-3 text-ink-700">
          We never sell or trade your data. We use a small number of named service providers to
          run Inklings, each of which only receives the data it needs to do its job:
        </p>
        <ul className="mt-3 list-disc pl-6 text-ink-700">
          <li><strong>Stripe</strong> &mdash; processes payments and subscriptions. Stripe receives billing details directly; Inklings never sees or stores your card number.</li>
          <li><strong>Anthropic</strong> (Claude API) &mdash; powers Sparky, the AI that guides your child&apos;s story. Story text and choices are sent to Anthropic to generate Sparky&apos;s responses.</li>
          <li><strong>Together AI</strong> &mdash; generates the illustrations for your child&apos;s story pages from the story text/character description.</li>
          <li><strong>Resend / our mail server</strong> &mdash; delivers transactional email (magic links, receipts, account notices) to your inbox.</li>
          <li><strong>Lulu</strong> (our print fulfillment partner) &mdash; when you order a printed softcover, the finished book file and the parent&apos;s shipping address are shared with Lulu so they can print and ship your book.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-ink">How long we keep data</h2>
        <p className="mt-3 text-ink-700">
          We keep your account, child profile, and story data for as long as your account is
          active. If you delete your account, we delete your data &mdash; account, child profile,
          stories, characters, and uploaded images &mdash; within 30 days. Some records (like order
          and payment history) may be retained longer where we&apos;re legally required to keep
          them for tax or accounting purposes.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Your rights as a parent</h2>
        <ul className="mt-3 list-disc pl-6 text-ink-700">
          <li>
            <strong>Review or export</strong> everything we hold on your account and your child at
            any time: <code>/api/portal/export</code> (a full JSON download), or from{" "}
            <code>/portal/settings</code>.
          </li>
          <li>
            <strong>Delete your account</strong> and all associated data at{" "}
            <code>/api/portal/delete-account</code>, also reachable from{" "}
            <code>/portal/settings</code>.
          </li>
          <li>
            <strong>Revoke consent</strong> to us collecting your child&apos;s information at any
            time from <code>/portal/settings</code>. Revoking consent will pause story creation and
            lead to account deletion if not resolved, since collecting that information is
            necessary to run the Studio.
          </li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-ink">Cookies</h2>
        <ul className="mt-3 list-disc pl-6 text-ink-700">
          <li><strong><code>ink_session</code></strong> &mdash; a session cookie that keeps you signed in after a magic-link or password login. Required for the site to function; not used for tracking.</li>
          <li><strong>Analytics cookies (Google Analytics 4)</strong> &mdash; set when our GA4 tag is enabled, with IP anonymization turned on. Used only in aggregate to understand traffic and usage.</li>
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
          Inklings is built for children under 13. The parent creates and controls the account, and
          nothing your child creates publishes, ships, or exports without your approval. We collect
          only what is necessary to operate the service, described above. You can review, export,
          or delete your account and all associated data at any time from your portal settings.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Contact</h2>
        <p className="mt-3 text-ink-700">
          Privacy questions: <a className="text-coral underline" href="mailto:hello@inklings.shop">hello@inklings.shop</a>
        </p>
      </article>
    </section>
  );
}
