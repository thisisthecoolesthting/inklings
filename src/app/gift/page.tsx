import type { Metadata } from "next";
import Link from "next/link";
import { Gift } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/lib/jsonld";
import { CharacterShelf } from "@/components/marketing/CharacterShelf";
import { CtaBand } from "@/components/CtaBand";

const GIFTS = [
  {
    id: "gift_1m",
    name: "1 month of Premium",
    price: "$9.99",
    blurb: "Perfect for trying the studio — unlimited stories for one month.",
  },
  {
    id: "gift_6m",
    name: "6 months of Premium",
    price: "$49.99",
    badge: "Popular",
    blurb: "A semester of story-making — the same characters can return all season.",
  },
  {
    id: "gift_12m",
    name: "1 year of Premium",
    price: "$89.99",
    blurb: "The full story universe — best value for grandparents and holidays.",
  },
];

const GIFT_STEPS = [
  {
    title: "Choose a plan",
    body: "Pick 1, 6, or 12 months and check out securely with Stripe. You'll sign in to a free parent account first.",
  },
  {
    title: "We email the code",
    body: "Your gift code arrives in your inbox as soon as payment goes through. Add the recipient's email and we'll send it to them too.",
  },
  {
    title: "They redeem it",
    body: "The recipient signs in to their own parent account, enters the code at inklings.shop/gift/redeem, and Premium switches on for that account.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Gift Premium story studio for kids",
  description:
    "Gift Inklings Premium to creative kids ages 4-8: unlimited stories, characters that can return every time, and optional printed keepsakes. Redeemed with a code.",
  path: "/gift",
});

export default function GiftPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Gift Premium", path: "/gift" },
        ]}
      />
      <section className="section">
        <div className="container-ink">
          <div className="section-header-center">
            <span className="eyebrow">Gift a story universe</span>
            <h1 className="section-title">Give Premium — not just one book</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-700">
              Inklings Premium lets creative kids 4-8 build characters and worlds all year — then turn their
              best stories into printed keepsakes.{" "}
              <Link href="/for-grandparents" className="text-coral underline">
                See our guide for grandparents
              </Link>
              .
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {GIFTS.map((g) => (
              <div key={g.id} id={g.id} className="card-base flex scroll-mt-28 flex-col">
                {g.badge && (
                  <span className="mb-2 inline-block w-fit rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">
                    {g.badge}
                  </span>
                )}
                <Gift className="h-8 w-8 text-coral" aria-hidden />
                <h2 className="mt-3 text-xl font-bold text-ink">{g.name}</h2>
                <p className="mt-2 text-3xl font-bold text-ink">{g.price}</p>
                <p className="mt-3 flex-1 text-sm text-ink-700">{g.blurb}</p>
                <form action="/api/billing/checkout" method="POST" className="mt-6 space-y-3">
                  <input type="hidden" name="tier" value="gift" />
                  <input type="hidden" name="giftPlan" value={g.id} />
                  <label className="block text-left">
                    <span className="text-sm font-medium text-ink-700">Recipient email (optional)</span>
                    <input
                      type="email"
                      name="recipientEmail"
                      placeholder="grandma@example.com"
                      className="mt-1 h-12 min-h-[48px] w-full rounded-button border-2 border-ink-100 bg-white px-4 text-base"
                    />
                  </label>
                  <p className="text-xs text-ink-500">
                    Not sure of their email? We&apos;ll send the code to you.
                  </p>
                  <button type="submit" className="btn-primary btn-full">
                    Gift {g.name.toLowerCase()}
                  </button>
                </form>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-ink-500">
            Recipient redeems at{" "}
            <Link href="/gift/redeem" className="text-coral underline">
              inklings.shop/gift/redeem
            </Link>
            .{" "}
            <Link href="/pricing" className="underline">
              Compare all plans
            </Link>
          </p>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="mx-auto max-w-xl text-center">
              <span className="eyebrow">Simple by design</span>
              <h2 className="text-2xl font-bold text-ink">How gifting works</h2>
            </div>
            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              {GIFT_STEPS.map((step, i) => (
                <li key={step.title} className="card-base">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-base font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-700">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16">
            <div className="mx-auto max-w-xl text-center">
              <span className="eyebrow">What they&apos;ll build over time</span>
              <h2 className="text-2xl font-bold text-ink">A shelf that keeps growing</h2>
            </div>
            <div className="mt-6">
              <CharacterShelf compact />
            </div>
          </div>
        </div>
      </section>
      <CtaBand
        title="Give them a whole year of stories."
        body="Redeemed by email at inklings.shop/gift/redeem."
        primary={{ label: "Gift 1 year — $89.99", href: "#gift_12m" }}
        secondary={{ label: "Prefer they try it free first?", href: "/trial" }}
        microcopy="Secure checkout with Stripe · a code lands in your inbox."
      />
    </>
  );
}
