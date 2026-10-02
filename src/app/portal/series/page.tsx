import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ensureDefaultSeries } from "@/lib/series-bootstrap";
import { createSeries } from "./actions";

export default async function PortalSeriesPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/portal/series");

  const children = await prisma.childProfile.findMany({
    where: { parentId: session.userId },
    orderBy: { name: "asc" },
  });

  for (const c of children) {
    await ensureDefaultSeries(prisma, c.id);
  }

  const seriesList = await prisma.series.findMany({
    where: { child: { parentId: session.userId } },
    include: {
      child: true,
      world: true,
      seriesCast: { include: { character: true }, orderBy: { slot: "asc" } },
      _count: { select: { books: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const tier = session.tier === "premium" ? "premium" : "free";
  const canCreate = tier === "premium" || seriesList.length === 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Series &amp; collections</h1>
      <p className="mt-2 text-ink-700">
        Each child gets a default series automatically when you add them — no setup required.
        Assign 2–3 approved characters to the core cast so Sparky can write books. Premium unlocks extra series shelves.
      </p>

      {canCreate && children.length > 0 && (
        <form action={createSeries} className="card-base mt-6 max-w-xl !p-4 sm:!p-8 lg:mt-8">
          <h2 className="text-lg font-bold text-ink">Start a new series (Premium)</h2>
          <p className="mt-1 text-sm text-ink-500">Free accounts include one series. Premium unlocks unlimited shelves.</p>
          <label htmlFor="series-child" className="mt-4 block text-sm font-semibold text-ink">Child</label>
          <select id="series-child" name="childId" required className="mt-1 min-h-[48px] w-full rounded-button border-2 border-ink-100 bg-white px-3 py-2 text-base">
            {children.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <label htmlFor="series-title" className="mt-4 block text-sm font-semibold text-ink">Series title</label>
          <input id="series-title" name="title" type="text" autoComplete="off" required maxLength={80} placeholder="Maya and Biscuit's Meadowlands" className="mt-1 min-h-[48px] w-full rounded-button border-2 border-ink-100 bg-white px-3 py-2 text-base" />
          <label htmlFor="series-world" className="mt-4 block text-sm font-semibold text-ink">World name</label>
          <input id="series-world" name="worldName" type="text" autoComplete="off" maxLength={80} placeholder="The Meadowlands" className="mt-1 min-h-[48px] w-full rounded-button border-2 border-ink-100 bg-white px-3 py-2 text-base" />
          <button type="submit" className="btn-primary mt-6 w-full sm:w-auto" disabled={!canCreate && tier === "free"}>
            Create series
          </button>
        </form>
      )}

      <ul className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-2">
        {seriesList.map((s) => (
          <li key={s.id} className="card-base !p-4 sm:!p-8">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 break-words">
                <p className="text-xs font-semibold uppercase tracking-wide text-coral">{s.child.name}{s.isDefault ? " · Default" : ""}</p>
                <h2 className="text-xl font-bold text-ink">{s.title}</h2>
                {s.world && <p className="text-sm text-ink-500">World: {s.world.name}</p>}
              </div>
              <span className="shrink-0 whitespace-nowrap rounded-full bg-mint-100 px-3 py-1 text-xs font-semibold text-ink">{s._count.books} books</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[1, 2, 3].map((slot) => {
                const cast = s.seriesCast.find((c) => c.slot === slot);
                return (
                  <span key={slot} className="rounded-full bg-cream-200 px-3 py-1 text-xs text-ink-700">
                    {cast ? cast.character.name : `Slot ${slot} empty`}
                  </span>
                );
              })}
            </div>
            <Link href={`/portal/series/${s.id}`} className="btn-secondary mt-4 flex w-full text-sm sm:inline-flex sm:w-auto">
              Manage cast &amp; books
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
