import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { ShieldCheck, Lock, Eye, UserCheck, Image as ImageIcon, Key } from "lucide-react";
import { SafetyComparison } from "@/components/marketing/SafetyComparison";
import { pageMetadata } from "@/lib/seo";
import { PrimaryCta } from "@/components/PrimaryCta";

export const metadata: Metadata = pageMetadata({
  title: "Safety & privacy for kids' stories",
  description:
    "How Inklings protects kids: a parent-owned account, bounded Sparky choices instead of open chat, on-device face blurring, and minimal COPPA-minded data.",
  path: "/security",
});

const PILLARS = [
  { icon: UserCheck, title: "Parent owns the account", body: "There is no separate child login. The parent creates and controls the account; the child profile is linked to it. We collect only your child's first name and age." },
  { icon: ShieldCheck, title: "Parent approves before anything publishes", body: "Sandbox mode means new characters and stories are private to your child's session until you explicitly approve them. Nothing ships, prints, or exports without your sign-off." },
  { icon: Eye, title: "On-device face detection", body: "If a photo upload contains a human face, our face-detection runs in your browser before anything reaches our servers — and the face is blurred. We then extract colors and shapes for the illustration." },
  { icon: Lock, title: "No public profiles, no social feed", body: "Inklings has no public discovery surface. There is nothing for someone to find, follow, or message. Private by design." },
  { icon: ImageIcon, title: "Content moderation on every AI output", body: "Both Sparky's text and the illustration model run with safety filters enabled. Sparky is a tightly bounded branching system, not an open chatbot." },
  { icon: Key, title: "COPPA-compliant", body: "Designed for children under 13 with parent consent and minimal data collection. Children cannot communicate with anyone outside their family." },
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
              data collection is minimized, and AI outputs run through safety filters.
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
