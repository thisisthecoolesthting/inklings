import Link from "next/link";
import { Gift } from "lucide-react";

const GIFTS = [
  {
    id: "gift_1m",
    name: "1 month of Premium",
    price: "$9.99",
    blurb: "Perfect for trying the studio — unlimited stories for 30 days.",
  },
  {
    id: "gift_6m",
    name: "6 months of Premium",
    price: "$49.99",
    badge: "Popular",
    blurb: "A semester of story-making — characters that return all season.",
  },
  {
    id: "gift_12m",
    name: "1 year of Premium",
    price: "$89.99",
    blurb: "The full story universe — best value for grandparents and holidays.",
  },
];

export default function GiftPage() {
  return (
    <section className="section">
      <div className="container-ink">
        <div className="section-header-center">
          <span className="eyebrow">Gift a story universe</span>
          <h1 className="section-title">Give Premium — not just one book</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-700">
            Inklings Premium lets creative kids 5–8 build characters and worlds all year — then turn their
            best stories into printed keepsakes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {GIFTS.map((g) => (
            <div key={g.id} className="card-base flex flex-col">
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
                  <span className="text-xs font-medium text-ink-600">Recipient email (optional)</span>
                  <input
                    type="email"
                    name="recipientEmail"
                    placeholder="grandma@example.com"
                    className="mt-1 w-full rounded-button border border-ink-100 px-3 py-2 text-sm"
                  />
                </label>
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
      </div>
    </section>
  );
}
