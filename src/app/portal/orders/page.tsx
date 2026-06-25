import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PrintCheckoutForm } from "@/components/portal/PrintCheckoutForm";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ ordered?: string }>;
}) {
  const sp = await searchParams;
  const session = await getSession();
  if (!session) return null;

  const [orders, readyToPrint] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.userId },
      include: { book: { include: { child: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.findMany({
      where: {
        status: { in: ["approved", "ordered"] },
        child: { parentId: session.userId },
        orders: { none: { status: { in: ["paid", "fulfilled"] } } },
      },
      include: { child: true },
      orderBy: { parentApprovedAt: "desc" },
    }),
  ]);

  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-ink">Print orders</h1>
        <p className="mt-1 text-ink-700">Real hardcover keepsakes shipped to your door in 7–10 days.</p>
      </header>

      {sp.ordered === "1" && (
        <div className="card-base mb-8 border-mint-200 bg-mint-50">
          <p className="font-semibold text-ink">Thank you — your print order is in!</p>
          <p className="mt-1 text-sm text-ink-700">We&apos;ll email you when it ships. HD illustrations finish generating in the background.</p>
        </div>
      )}

      {readyToPrint.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink">Order a printed book</h2>
          <ul className="mt-4 space-y-4">
            {readyToPrint.map((b) => (
              <li key={b.id} className="card-base flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-ink">{b.title}</h3>
                  <p className="text-sm text-ink-500">By {b.child.name} &middot; 8.5&quot; hardcover &middot; $19.99</p>
                </div>
                <PrintCheckoutForm bookId={b.id} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold text-ink">Order history</h2>
        {orders.length === 0 ? (
          <div className="card-base mt-4 text-center">
            <p className="text-ink-700">No orders yet.</p>
            <Link href="/portal/approvals" className="btn-secondary mt-4 inline-flex">
              Review approved stories
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {orders.map((o) => (
              <li key={o.id} className="card-base flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-ink">{o.book.title}</h3>
                  <p className="text-sm text-ink-500">
                    {o.book.child.name} &middot; Qty {o.quantity} &middot; ${(o.unitPriceCents / 100).toFixed(2)}
                  </p>
                  {o.luluJobId && (
                    <p className="mt-1 text-xs text-ink-400">Print job #{o.luluJobId}</p>
                  )}
                </div>
                <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-semibold capitalize text-mint-600">
                  {o.status.replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
