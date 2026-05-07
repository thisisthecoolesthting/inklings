import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) return null;
  const orders = await prisma.order.findMany({
    where: { userId: session.userId }, include: { book: true }, orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-ink">Print orders</h1>
        <p className="mt-1 text-ink-700">Real hardcover keepsakes shipped to your door.</p>
      </header>
      {orders.length === 0 ? (
        <div className="card-base text-center">
          <p className="text-ink-700">No orders yet. Once a story is approved, you can order a printed copy.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="card-base flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink">{o.book.title}</h2>
                <p className="text-sm text-ink-500">Qty {o.quantity} &middot; ${(o.unitPriceCents / 100).toFixed(2)} each</p>
              </div>
              <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-semibold text-mint-600">{o.status}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
