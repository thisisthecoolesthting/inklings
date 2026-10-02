import Link from "next/link";
import { SwipeStrip } from "@/components/marketing/SwipeStrip";
import { PricingFeatureList } from "@/components/PricingFeatureList";

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

export function PricingTiers({
  headingLevel = "h2",
  mobileLayout = "swipe",
}: {
  headingLevel?: "h2" | "h3";
  /** Phones: "swipe" = snap row with peek + indicator; "stack" = tightened vertical stack. */
  mobileLayout?: "swipe" | "stack";
}) {
  const Heading = headingLevel;
  const cards = TIERS.map((tier) => (
    <div
      key={tier.id}
      id={tier.anchorId}
      className={
        "card-base relative flex h-full flex-col !p-5 md:!p-8 " + (tier.anchorId ? "scroll-mt-28 " : "") +
        (tier.featured ? "ring-2 ring-coral" : "")
      }
    >
      {tier.badge && (
        <div className="absolute right-4 top-4 rounded-full bg-coral-dark px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white md:right-6 md:top-6">
          {tier.badge}
        </div>
      )}
      <Heading className="font-sans text-2xl font-bold text-ink">{tier.name}</Heading>
      <div className="mt-3 flex items-baseline gap-1 md:mt-4">
        <span className="text-lg text-ink-500">{tier.currency}</span>
        <span className="text-4xl font-bold text-ink md:text-5xl">{tier.amount}</span>
        <span className="ml-1 text-sm text-ink-500">{tier.period}</span>
      </div>
      <PricingFeatureList features={tier.features} />
      <Link
        href={tier.ctaHref}
        className={
          "mt-6 md:mt-8 " + (tier.featured || tier.id === "free" ? "btn-primary btn-full" : "btn-secondary btn-full")
        }
      >
        {tier.ctaLabel}
      </Link>
      {tier.microcopy && (
        <p className="mt-3 text-center text-xs leading-snug text-ink-600">{tier.microcopy}</p>
      )}
      {tier.altLink && (
        <p className="mt-1 text-center text-sm md:mt-3">
          <Link
            href={tier.altLink.href}
            className="inline-flex min-h-[44px] items-center font-semibold text-coral underline underline-offset-4"
          >
            {tier.altLink.label} &rarr;
          </Link>
        </p>
      )}
    </div>
  ));

  if (mobileLayout === "swipe") {
    return (
      <SwipeStrip label="Plans" gridClassName="md:gap-6 lg:grid-cols-3" breakpoint="md">
        {cards}
      </SwipeStrip>
    );
  }
  return <div className="grid gap-4 md:gap-6 lg:grid-cols-3">{cards}</div>;
}
