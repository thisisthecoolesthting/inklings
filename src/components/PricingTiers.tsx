import Link from "next/link";
import { Check } from "lucide-react";

interface Tier {
  id: string;
  name: string;
  currency: string;
  amount: string;
  period: string;
  badge?: string;
  featured?: boolean;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  /** Anchor id so other pages can deep-link (e.g. /pricing#book). */
  anchorId?: string;
  /** Small print under the button. */
  microcopy?: string;
  /** Secondary text link under the button. */
  altLink?: { label: string; href: string };
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    currency: "$",
    amount: "0",
    period: "forever",
    features: [
      "3 stories per month",
      "1 story world per child, with a cast of up to 3 characters",
      "Read approved stories on screen in your family library",
      "Parent approval before any story can be printed",
    ],
    ctaLabel: "Start a free story",
    ctaHref: "/trial",
    microcopy: "No credit card. The Free plan never asks for one.",
  },
  {
    id: "premium",
    name: "Premium",
    currency: "$",
    amount: "9.99",
    period: "/ month",
    badge: "Most loved",
    featured: true,
    features: [
      "Everything in Free",
      "Unlimited stories",
      "Unlimited story worlds per child, each with its own cast of up to 3",
      "Series memory — each new book picks up from the last one",
    ],
    ctaLabel: "Try Premium free for 14 days",
    ctaHref: "/api/billing/checkout?tier=premium",
    microcopy: "Card required · $0 today · cancel in one click before day 14 or pay $9.99/mo",
    altLink: { label: "Gift Premium instead", href: "/gift" },
  },
  {
    id: "printed_book",
    name: "Softcover Book",
    currency: "$",
    amount: "19.99",
    period: "per book",
    features: [
      "Real softcover keepsake (8.5&quot; × 8.5&quot;)",
      "Full-color pages, softcover binding",
      "One illustrated page for each step of the story",
      "Printed and shipped to your door — estimated 7–10 business days",
      "Available on any plan, for stories you have approved (one-time charge)",
    ],
    ctaLabel: "See how printing works",
    ctaHref: "/how-it-works#printed",
    anchorId: "book",
  },
];

export function PricingTiers({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {TIERS.map((tier) => (
        <div
          key={tier.id}
          id={tier.anchorId}
          className={
            "card-base relative flex flex-col " + (tier.anchorId ? "scroll-mt-28 " : "") +
            (tier.featured ? "ring-2 ring-coral" : "")
          }
        >
          {tier.badge && (
            <div className="absolute right-6 top-6 rounded-full bg-coral-dark px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              {tier.badge}
            </div>
          )}
          <Heading className="font-sans text-2xl font-bold text-ink">{tier.name}</Heading>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-lg text-ink-500">{tier.currency}</span>
            <span className="text-5xl font-bold text-ink">{tier.amount}</span>
            <span className="ml-1 text-sm text-ink-500">{tier.period}</span>
          </div>
          <ul className="mt-6 flex-1 space-y-3 text-sm text-ink-700">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-none text-mint-700" aria-hidden />
                <span dangerouslySetInnerHTML={{ __html: f }} />
              </li>
            ))}
          </ul>
          <Link
            href={tier.ctaHref}
            className={
              "mt-8 " + (tier.featured || tier.id === "free" ? "btn-primary btn-full" : "btn-secondary btn-full")
            }
          >
            {tier.ctaLabel}
          </Link>
          {tier.microcopy && (
            <p className="mt-3 text-center text-xs leading-snug text-ink-600">{tier.microcopy}</p>
          )}
          {tier.altLink && (
            <p className="mt-3 text-center text-sm">
              <Link href={tier.altLink.href} className="font-semibold text-coral underline underline-offset-4">
                {tier.altLink.label} &rarr;
              </Link>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
