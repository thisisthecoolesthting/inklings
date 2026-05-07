import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { approveCharacter, rejectCharacter, approveBook, rejectBook } from "./actions";
import { SubmitButton } from "./submit-button";

export default async function ApprovalsPage() {
  const session = await getSession();
  if (!session) return null;
  const [pendingCharacters, pendingBooks] = await Promise.all([
    prisma.character.findMany({
      where: { sandboxMode: true, child: { parentId: session.userId } },
      include: { child: true }, orderBy: { createdAt: "desc" },
    }),
    prisma.book.findMany({
      where: { status: "awaiting_parent", child: { parentId: session.userId } },
      include: { child: true, _count: { select: { pages: true } } }, orderBy: { createdAt: "desc" },
    }),
  ]);
  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-ink">Approvals</h1>
        <p className="mt-1 text-ink-700">Nothing publishes without your sign-off.</p>
      </header>
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
                <p className="mt-3 text-sm text-ink-700">{ch.species}, {ch.role}.</p>
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
        {pendingBooks.length === 0 ? (
          <div className="card-base mt-3 text-ink-500">No stories awaiting approval.</div>
        ) : (
          <ul className="mt-3 space-y-4">
            {pendingBooks.map((b) => (
              <li key={b.id} className="card-base">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-ink">{b.title}</h3>
                  <p className="text-sm text-ink-500">From {b.child.name} &middot; {b._count.pages} pages</p>
                </div>
                <div className="flex gap-2">
                  <form action={approveBook}>
                    <input type="hidden" name="id" value={b.id} />
                    <SubmitButton kind="approve">Approve</SubmitButton>
                  </form>
                  <form action={rejectBook}>
                    <input type="hidden" name="id" value={b.id} />
                    <SubmitButton kind="reject">Send back</SubmitButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
