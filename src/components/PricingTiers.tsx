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
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    currency: "$",
    amount: "0",
    period: "forever",
    features: [
      "1 child profile",
      "1 imagined world, up to 3 characters",
      "3 stories per month",
      "Low-resolution PDF download (with Inklings watermark)",
      "Parent approval gate on every step",
    ],
    ctaLabel: "Start a free story",
    ctaHref: "/trial",
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
      "Unlimited child profiles",
      "Unlimited worlds &amp; characters",
      "Unlimited stories",
      "HD print-ready PDF (no watermark)",
      "Series memory — characters return across stories",
      "Priority illustration generation",
    ],
    ctaLabel: "Try Premium free for 14 days",
    ctaHref: "/api/billing/checkout?tier=premium",
  },
  {
    id: "printed_book",
    name: "Softcover Book",
    currency: "$",
    amount: "19.99",
    period: "per book",
    features: [
      "Real softcover keepsake (8.5&quot; × 8.5&quot;)",
      "Full-color pages with a matte softcover",
      "Ships in 7–10 days to your door",
      "Up to 32 illustrated pages",
      "Available on any tier (one-time charge)",
    ],
    ctaLabel: "See how printing works",
    ctaHref: "/how-it-works#printed",
  },
];

export function PricingTiers() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {TIERS.map((tier) => (
        <div
          key={tier.id}
          className={
            "card-base relative flex flex-col " +
            (tier.featured ? "ring-2 ring-coral" : "")
          }
        >
          {tier.badge && (
            <div className="absolute right-6 top-6 rounded-full bg-coral px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              {tier.badge}
            </div>
          )}
          <h3 className="text-2xl font-bold text-ink">{tier.name}</h3>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-lg text-ink-500">{tier.currency}</span>
            <span className="text-5xl font-bold text-ink">{tier.amount}</span>
            <span className="ml-1 text-sm text-ink-500">{tier.period}</span>
          </div>
          <ul className="mt-6 flex-1 space-y-3 text-sm text-ink-700">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-none text-mint-600" aria-hidden />
                <span dangerouslySetInnerHTML={{ __html: f }} />
              </li>
            ))}
          </ul>
          <Link
            href={tier.ctaHref}
            className={"mt-8 " + (tier.featured ? "btn-primary btn-full" : "btn-secondary btn-full")}
          >
            {tier.ctaLabel}
          </Link>
        </div>
      ))}
    </div>
  );
}
