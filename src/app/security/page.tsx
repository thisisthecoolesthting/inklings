import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { ShieldCheck, Lock, ImageOff, UserCheck, ListChecks, Key } from "lucide-react";
import { SafetyComparison } from "@/components/marketing/SafetyComparison";
import { pageMetadata } from "@/lib/seo";
import { PrimaryCta } from "@/components/PrimaryCta";

export const metadata: Metadata = pageMetadata({
  title: "Safety & privacy for kids' stories",
  description:
    "How Inklings protects kids: a parent-owned account, bounded Sparky choices instead of open chat, no photo or drawing uploads, and minimal COPPA-minded data.",
  path: "/security",
});

const PILLARS = [
  { icon: UserCheck, title: "Parent owns the account", body: "There is no separate child login. The parent creates and controls the account; the child profile is linked to it. We collect only your child's first name and age." },
  { icon: ShieldCheck, title: "Parent approves before anything publishes", body: "New characters and finished stories are flagged in your portal for review. A story can't be ordered as a printed book until you approve it, and Inklings has no public sharing or publishing features." },
  { icon: ImageOff, title: "No photo or drawing uploads", body: "Inklings does not accept photos or drawings, so no images of your child, your home, or anyone's face are collected. Characters are built only from taps: a name, an animal, a color, and personality traits." },
  { icon: Lock, title: "No public profiles, no social feed", body: "Inklings has no public discovery surface. There is nothing for someone to find, follow, or message. Private by design." },
  { icon: ListChecks, title: "A word filter on every page Sparky writes", body: "Every page Sparky writes is checked against a blocked-word list before your child sees it, and a safe fallback page is used if it fails. Sparky is a tightly bounded branching system, not an open chatbot, and you review the finished pages before anything is printed." },
  { icon: Key, title: "Built around COPPA", body: "Designed for children under 13: parent consent is recorded at sign-up, data collection is minimal, and there is no way for children to communicate with anyone outside their family." },
];

export default function SecurityPage() {
  return (
    <>
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Safety &amp; privacy</span>
            <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Safety is the first feature.
            </h1>
            <p className="mt-6 text-lg text-ink-700">
              Inklings is built for children. That means parents control everything,
              data collection is minimized, and the text Sparky writes goes through a word filter.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-ink mx-auto max-w-5xl grid gap-6 md:grid-cols-2">
          {PILLARS.map((p) => (
            <div key={p.title} className="card-base">
              <p.icon className="h-8 w-8 text-coral" aria-hidden />
              <h2 className="mt-4 text-xl font-bold text-ink">{p.title}</h2>
              <p className="mt-2 text-ink-700">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-ink mx-auto max-w-5xl">
          <div className="section-header-center">
            <span className="eyebrow">The difference, side by side</span>
            <h2 className="section-title">Not a chatbot. A bounded story guide.</h2>
            <p className="section-subtitle">
              Sparky never hands a child an open text box. Every turn is a small set of
              parent-safe choices — the same pattern you can try yourself on{" "}
              <Link href="/try" className="text-coral underline">
                the taste-of-Sparky demo
              </Link>
              .
            </p>
          </div>
          <SafetyComparison />
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start">
            <PrimaryCta href="/trial" microcopy="You approve every page before it exists outside your account.">
              Create your parent account
            </PrimaryCta>
            <PrimaryCta href="/try" variant="secondary" microcopy={false}>
              Try the bounded version yourself
            </PrimaryCta>
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-ink mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-ink">Read more</h2>
          <ul className="mt-4 space-y-2 text-ink-700">
            <li><Link className="text-coral underline" href="/legal/privacy">Privacy policy</Link></li>
            <li><Link className="text-coral underline" href="/legal/terms">Terms of service</Link></li>
            <li><Link className="text-coral underline" href="/contact">Contact us about a safety concern</Link></li>
          </ul>
        </div>
      </section>
    </>
  );
}
