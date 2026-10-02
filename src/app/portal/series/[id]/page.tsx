import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { assignCastSlot, clearCastSlot, setActiveSeries } from "../actions";

export default async function PortalSeriesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/portal/series");

  const { id } = await params;
  const series = await prisma.series.findFirst({
    where: { id, child: { parentId: session.userId } },
    include: {
      child: true,
      world: true,
      seriesCast: { include: { character: true }, orderBy: { slot: "asc" } },
      books: { orderBy: { updatedAt: "desc" }, take: 12 },
    },
  });
  if (!series) notFound();

  const approvedChars = await prisma.character.findMany({
    where: {
      childId: series.childId,
      sandboxMode: false,
      parentApprovedAt: { not: null },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <Link href="/portal/series" className="inline-flex min-h-[44px] items-center text-sm text-ink-500 underline">← All series</Link>
      <h1 className="mt-2 break-words text-2xl font-bold text-ink sm:text-3xl">{series.title}</h1>
      <p className="text-ink-600">{series.child.name} · {series.world?.name ?? "No world yet"}</p>

      <section className="card-base mt-6 !p-4 sm:!p-8 lg:mt-8">
        <h2 className="text-xl font-bold text-ink">Core cast (2–3 characters)</h2>
        <p className="mt-1 text-sm text-ink-600">Assign approved characters to slots. Stories need at least 2 before publishing.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((slot) => {
            const cast = series.seriesCast.find((c) => c.slot === slot);
            return (
              <div key={slot} className="min-w-0 rounded-card border border-ink-100 bg-cream-50 p-4">
                <p className="text-xs font-bold uppercase text-coral">Slot {slot}</p>
                {cast ? (
                  <>
                    <p className="mt-2 break-words text-lg font-bold text-ink">{cast.character.name}</p>
                    <p className="text-sm text-ink-500">{cast.character.species ?? "character"}</p>
                    <form action={clearCastSlot} className="mt-3">
                      <input type="hidden" name="seriesId" value={series.id} />
                      <input type="hidden" name="slot" value={slot} />
                      <button type="submit" className="inline-flex min-h-[44px] items-center text-sm text-ink-500 underline">Remove</button>
                    </form>
                  </>
                ) : (
                  <form action={assignCastSlot} className="mt-3">
                    <input type="hidden" name="seriesId" value={series.id} />
                    <input type="hidden" name="slot" value={slot} />
                    <select name="characterId" required aria-label={`Character for slot ${slot}`} className="min-h-[48px] w-full rounded-button border border-ink-100 bg-white px-2 py-2 text-base">
                      <option value="">Pick character…</option>
                      {approvedChars.map((ch) => (
                        <option key={ch.id} value={ch.id}>{ch.name}</option>
                      ))}
                    </select>
                    <button type="submit" className="btn-secondary btn-full mt-2 text-sm">Assign</button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <form action={setActiveSeries} className="mt-6">
        <input type="hidden" name="childId" value={series.childId} />
        <input type="hidden" name="seriesId" value={series.id} />
        <button type="submit" className="btn-primary w-full whitespace-normal sm:w-auto">Set as active series for {series.child.name}</button>
      </form>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-ink">Books in this series</h2>
        {series.books.length === 0 ? (
          <p className="mt-2 text-ink-600">No books yet — {series.child.name} can start one in Sparky&apos;s Studio.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {series.books.map((b) => (
              <li key={b.id} className="flex flex-col gap-1 rounded-card border border-ink-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="min-w-0 break-words font-medium text-ink">{b.title}</span>
                <span className="text-sm capitalize text-ink-500">{b.status.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
