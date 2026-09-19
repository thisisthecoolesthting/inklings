import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { OPERATOR_LEGAL_NAME, OPERATOR_MAILING_ADDRESS } from "@/lib/legal-config";
import { pageMetadata } from "@/lib/seo";
import { PrimaryCta } from "@/components/PrimaryCta";

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "How Inklings handles your family's data: what we collect, who we share it with, how long we keep it, and how to export or delete everything.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <section className="section bg-cream-100">
      <article className="container-ink mx-auto max-w-3xl prose prose-ink">
        <h1 className="text-4xl font-bold text-ink">Privacy policy</h1>
        <p className="text-sm text-ink-500">Last updated: September 2026</p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Who operates Inklings</h2>
        <p className="mt-3 text-ink-700">
          {OPERATOR_LEGAL_NAME ? (
            <>
              Inklings is operated by {OPERATOR_LEGAL_NAME}
              {OPERATOR_MAILING_ADDRESS ? ` (${OPERATOR_MAILING_ADDRESS})` : ""}.{" "}
            </>
          ) : (
            <>
              Inklings (the &ldquo;operator&rdquo;) operates this service. For our legal entity name
              and mailing address, write to{" "}
              <a className="text-coral underline" href="mailto:hello@inklings.shop">hello@inklings.shop</a>{" "}
              and we&apos;ll reply within 2 business days.{" "}
            </>
          )}
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
            <strong>Child profile info:</strong> your child&apos;s first name and age. We never ask
            for a last name, birthdate, photo, or contact details for the child.
          </li>
          <li>
            <strong>Story &amp; character inputs:</strong> the characters (including the name your
            child types for each one), worlds, story choices, and the story text and illustrations
            generated from them &mdash; stored in your account so characters can return across
            stories.
          </li>
          <li>
            <strong>Consent record:</strong> when you create an account we store your confirmation
            that you are the child&apos;s parent or legal guardian, along with the time, your IP
            address, and your browser&apos;s user-agent string.
          </li>
          <li>
            <strong>Voice input during Studio sessions:</strong> the Studio uses your browser&apos;s
            built-in speech recognition (the Web Speech API) to turn your child&apos;s spoken
            choices into text. Inklings never receives or stores audio &mdash; our servers only
            ever receive the resulting text transcript. Some browsers send audio to their own
            speech service to do the transcribing, so check your browser&apos;s privacy settings if
            that matters to you.
          </li>
          <li>
            <strong>Photos and drawings:</strong> Inklings does not currently accept photo or
            drawing uploads, so we do not collect photos or images of your child. Characters are
            built only from the name, animal, color, and personality traits your child taps in. We
            will update this policy before we ever add uploads.
          </li>
          <li>
            <strong>Usage records:</strong> counts of stories started and illustrations generated,
            tied to your account, used to apply plan limits.
          </li>
          <li>
            <strong>Sample-story requests:</strong> if you enter your email in the &ldquo;Email me a
            sample story&rdquo; form, we store that address (with the form it came from and the
            time) and email you a link to the sample story. To have it removed, email{" "}
            <a className="text-coral underline" href="mailto:hello@inklings.shop">hello@inklings.shop</a>.
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
          <li><strong>Anthropic</strong> (Claude API) &mdash; powers Sparky, the AI that writes your child&apos;s story pages. Story choices, character details, and the story text so far are sent to Anthropic to generate each page.</li>
          <li><strong>OpenRouter and Together AI</strong> &mdash; generate the illustrations for your child&apos;s story pages from the story text and character descriptions. OpenRouter routes the request to an image model provider (currently Google&apos;s Gemini image model); Together AI is used as a fallback.</li>
          <li><strong>Resend / our mail server</strong> &mdash; delivers transactional email (magic links, receipts, account notices) to your inbox.</li>
          <li><strong>Lulu</strong> (our print fulfillment partner) &mdash; when you order a printed softcover, the finished book file and the parent&apos;s shipping address are shared with Lulu so they can print and ship your book.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-ink">How long we keep data</h2>
        <p className="mt-3 text-ink-700">
          We keep your account, child profile, and story data for as long as your account is
          active. If you delete your account, we delete your account, child profiles, stories, and
          characters within 30 days. Some records (like order and payment history, the consent
          record above, and usage counts) may be retained longer where we need them for legal, tax,
          accounting, or security purposes.
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
            time by emailing{" "}
            <a className="text-coral underline" href="mailto:hello@inklings.shop">hello@inklings.shop</a>{" "}
            or by deleting your account. Because that information is necessary to run the Studio,
            revoking consent means we close the account.
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
          <li>No collection of biometric data &mdash; Inklings does not accept photo or drawing uploads, so no face images or facial data are collected. We will update this policy before adding uploads.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-ink">COPPA &amp; children</h2>
        <p className="mt-3 text-ink-700">
          Inklings is built for children under 13. The parent creates and controls the account, and
          a story cannot be ordered as a printed book without your approval, and Inklings has no public sharing. We collect
          only what is necessary to operate the service, described above. You can review, export,
          or delete your account and all associated data at any time from your portal settings.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-ink">Contact</h2>
        <p className="mt-3 text-ink-700">
          Privacy questions: <a className="text-coral underline" href="mailto:hello@inklings.shop">hello@inklings.shop</a>
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-ink-100 pt-8 sm:flex-row">
          <PrimaryCta href="/pricing" variant="secondary" microcopy={false}>
            Back to pricing
          </PrimaryCta>
          <PrimaryCta href="/trial" microcopy={false}>
            Create your first story free
          </PrimaryCta>
        </div>
      </article>
    </section>
  );
}
