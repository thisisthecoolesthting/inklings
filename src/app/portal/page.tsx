import Link from "next/link";
import { Sparkles, BookOpen, ShieldCheck, ShoppingBag, BookMarked } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PrintCheckoutForm } from "@/components/portal/PrintCheckoutForm";

export default async function PortalHome({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string; gift_success?: string; gift_redeemed?: string; ordered?: string }>;
}) {
  const sp = await searchParams;
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  const [children, pendingBooks, readyToPrint, totalReadyToPrint, orders] = await Promise.all([
    prisma.childProfile.count({ where: { parentId: session.userId } }),
    prisma.book.count({
      where: { status: "awaiting_parent", child: { parentId: session.userId } },
    }),
    prisma.book.findMany({
      where: {
        status: "approved",
        child: { parentId: session.userId },
        orders: { none: { status: { in: ["paid", "fulfilled"] } } },
      },
      include: { child: true },
      orderBy: { parentApprovedAt: "desc" },
      take: 3,
    }),
    prisma.book.count({
      where: {
        status: "approved",
        child: { parentId: session.userId },
        orders: { none: { status: { in: ["paid", "fulfilled"] } } },
      },
    }),
    prisma.order.count({ where: { userId: session.userId } }),
  ]);

  const isPremium =
    user?.subscriptionTier === "premium" ||
    (user?.premiumUntil != null && user.premiumUntil > new Date());

  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-ink">Welcome back</h1>
        <p className="mt-2 text-ink-700">{session.email}</p>
      </header>

      {(sp.upgraded === "1" || sp.gift_redeemed === "1" || sp.gift_success === "1") && (
        <div className="card-base mb-8 border-mint-200 bg-mint-50">
          <p className="font-semibold text-ink">
            {sp.gift_success === "1"
              ? "Gift purchased — check your email for the redeem code."
              : "Premium is active — unlimited stories unlocked."}
          </p>
        </div>
      )}

      {!isPremium && (
        <div className="card-base mb-8 ring-2 ring-coral/40">
          <h2 className="text-lg font-bold text-ink">Try Premium free for 14 days</h2>
          <p className="mt-2 text-sm text-ink-700">Unlimited stories, HD print-ready PDFs, and series memory.</p>
          <Link href="/api/billing/checkout?tier=premium" className="btn-primary mt-4 inline-flex">
            Start free trial
          </Link>
        </div>
      )}

      {pendingBooks > 0 && (
        <div className="card-base mb-8 border-coral/30 bg-coral/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink">{pendingBooks} waiting for your approval</h2>
              <p className="text-sm text-ink-700">Review stories before your child shares or prints them.</p>
            </div>
            <Link href="/portal/approvals" className="btn-primary">
              Review now
            </Link>
          </div>
        </div>
      )}

      {readyToPrint.length > 0 && (
        <div className="card-base mb-8">
          <h2 className="text-lg font-bold text-ink">Ready for a printed keepsake</h2>
          <p className="mt-1 text-sm text-ink-700">Turn an approved story into a hardcover book ($19.99).</p>
          <ul className="mt-4 space-y-3">
            {readyToPrint.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-3 first:border-0 first:pt-0">
                <span className="font-medium text-ink">{b.title}</span>
                <PrintCheckoutForm bookId={b.id} className="btn-secondary text-sm" />
              </li>
            ))}
          </ul>
          {totalReadyToPrint > readyToPrint.length && (
            <Link href="/portal/orders" className="mt-4 inline-flex text-sm text-ink-500 underline">
              View all in Orders &rarr;
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Children", value: children, icon: Sparkles, href: "/portal/children" },
          { label: "Awaiting approval", value: pendingBooks, icon: ShieldCheck, href: "/portal/approvals" },
          { label: "Ready to print", value: readyToPrint.length, icon: BookMarked, href: "/portal/orders" },
          { label: "Print orders", value: orders, icon: ShoppingBag, href: "/portal/orders" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="card-base transition-shadow hover:shadow-md">
            <s.icon className="h-6 w-6 text-coral" aria-hidden />
            <div className="mt-3 text-3xl font-bold text-ink">{s.value}</div>
            <div className="text-sm text-ink-500">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card-base">
          <h2 className="text-xl font-bold text-ink">Kid Studio</h2>
          <p className="mt-2 text-ink-700">Send your child back to Sparky to create their next adventure.</p>
          <Link href="/studio" className="btn-primary mt-6 inline-flex">
            Open Kid Studio
          </Link>
        </div>
        <div className="card-base">
          <h2 className="text-xl font-bold text-ink">Gift Premium</h2>
          <p className="mt-2 text-ink-700">Grandparents and family can gift months of story-making.</p>
          <Link href="/gift" className="btn-secondary mt-6 inline-flex">
            Gift plans
          </Link>
        </div>
      </div>
    </>
  );
}
