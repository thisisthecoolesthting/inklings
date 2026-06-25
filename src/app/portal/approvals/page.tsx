import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { approveCharacter, rejectCharacter, approveBook, approveBookAndPrint, rejectBook } from "./actions";
import { SubmitButton } from "./submit-button";
import { PrintCheckoutForm } from "@/components/portal/PrintCheckoutForm";

export default async function ApprovalsPage() {
  const session = await getSession();
  if (!session) return null;
  const [pendingCharacters, pendingBooks, readyToPrint, totalReadyToPrint] = await Promise.all([
    prisma.character.findMany({
      where: { sandboxMode: true, child: { parentId: session.userId } },
      include: { child: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.findMany({
      where: { status: "awaiting_parent", child: { parentId: session.userId } },
      include: {
        child: true,
        _count: { select: { pages: true } },
        pages: { orderBy: { pageNumber: "asc" }, take: 8 },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.findMany({
      where: {
        status: "approved",
        child: { parentId: session.userId },
        orders: { none: { status: { in: ["paid", "fulfilled"] } } },
      },
      include: { child: true },
      orderBy: { parentApprovedAt: "desc" },
      take: 5,
    }),
    prisma.book.count({
      where: {
        status: "approved",
        child: { parentId: session.userId },
        orders: { none: { status: { in: ["paid", "fulfilled"] } } },
      },
    }),
  ]);
  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-ink">Approvals</h1>
        <p className="mt-1 text-ink-700">Nothing publishes without your sign-off. Order a printed keepsake right after you approve.</p>
      </header>

      {readyToPrint.length > 0 && (
        <section className="mb-10 rounded-card border-2 border-coral/30 bg-coral/5 p-6">
          <h2 className="text-lg font-bold text-ink">Ready to print</h2>
          <p className="mt-1 text-sm text-ink-700">These approved stories can become hardcover keepsakes ($19.99, ships in 7–10 days).</p>
          <ul className="mt-4 space-y-3">
            {readyToPrint.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-button bg-white px-4 py-3">
                <div>
                  <span className="font-semibold text-ink">{b.title}</span>
                  <span className="ml-2 text-sm text-ink-500">by {b.child.name}</span>
                </div>
                  <PrintCheckoutForm bookId={b.id} className="btn-primary text-sm" />
                </li>
              ))}
            </ul>
            {totalReadyToPrint > readyToPrint.length && (
              <div className="mt-4 text-center">
                <Link href="/portal/orders" className="text-sm text-ink-500 underline">
                  View all in Orders &rarr;
                </Link>
              </div>
            )}
          </section>
        )}

      <section className="mb-10">
        <h2 className="text-xl font-bold text-ink">Characters waiting</h2>
        {pendingCharacters.length === 0 ? (
          <div className="card-base mt-3 text-ink-500">No characters awaiting approval.</div>
        ) : (
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            {pendingCharacters.map((ch) => (
              <li key={ch.id} className="card-base">
                <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-semibold text-mint-600">
                  Sandbox &mdash; only {ch.child.name} can see this
                </span>
                <h3 className="mt-3 text-lg font-bold text-ink">{ch.name}</h3>
                <p className="text-sm text-ink-500">From {ch.child.name}</p>
                <p className="mt-3 text-sm text-ink-700">{ch.species ?? "character"}, {ch.role ?? "in story"}.</p>
                <div className="mt-4 flex gap-2">
                  <form action={approveCharacter}>
                    <input type="hidden" name="id" value={ch.id} />
                    <SubmitButton kind="approve">Approve</SubmitButton>
                  </form>
                  <form action={rejectCharacter}>
                    <input type="hidden" name="id" value={ch.id} />
                    <SubmitButton kind="reject">Send back</SubmitButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-ink">Stories waiting</h2>
        {pendingBooks.length > 0 && (
          <div className="mt-3 rounded-card bg-mint-50 px-4 py-2 text-sm text-ink-700">
            Approving queues HD illustrations &mdash; usually ready in a few minutes.
          </div>
        )}
        {pendingBooks.length === 0 ? (
          <div className="card-base mt-3 text-ink-500">No stories awaiting approval.</div>
        ) : (
          <ul className="mt-3 space-y-6">
            {pendingBooks.map((b) => (
              <li key={b.id} className="card-base">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-ink">{b.title}</h3>
                    <p className="text-sm text-ink-500">From {b.child.name} &middot; {b._count.pages} pages</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <form action={approveBook}>
                      <input type="hidden" name="id" value={b.id} />
                      <SubmitButton kind="approve">Approve only</SubmitButton>
                    </form>
                    <form action={approveBookAndPrint}>
                      <input type="hidden" name="id" value={b.id} />
                      <SubmitButton kind="approve">Approve &amp; go to print checkout</SubmitButton>
                    </form>
                    <form action={rejectBook}>
                      <input type="hidden" name="id" value={b.id} />
                      <SubmitButton kind="reject">Send back</SubmitButton>
                    </form>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {b.pages.map((p) => (
                    <div key={p.id} className="rounded-card border border-ink-100 bg-cream-50 p-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-coral">Page {p.pageNumber}</span>
                      {p.imageUrlLowres && (
                        <Image src={p.imageUrlLowres} alt="" className="mt-2 w-full rounded border border-ink-100" width={512} height={512} />
                      )}
                      <p className="mt-2 text-sm text-ink line-clamp-3">{p.textContent}</p>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
