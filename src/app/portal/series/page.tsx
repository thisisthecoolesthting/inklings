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
      <h1 className="text-3xl font-bold text-ink">Series &amp; collections</h1>
      <p className="mt-2 text-ink-700">
        Each child gets a default series automatically when you add them — no setup required.
        Assign 2–3 approved characters to the core cast so Sparky can write books. Premium unlocks extra series shelves.
      </p>

      {canCreate && children.length > 0 && (
        <form action={createSeries} className="card-base mt-8 max-w-xl">
          <h2 className="text-lg font-bold text-ink">Start a new series (Premium)</h2>
          <p className="mt-1 text-sm text-ink-500">Free accounts include one series. Premium unlocks unlimited shelves.</p>
          <label className="mt-4 block text-sm font-semibold text-ink">Child</label>
          <select name="childId" required className="mt-1 w-full rounded-button border-2 border-ink-100 px-3 py-2">
            {children.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <label className="mt-4 block text-sm font-semibold text-ink">Series title</label>
          <input name="title" required maxLength={80} placeholder="Maya and Biscuit's Meadowlands" className="mt-1 w-full rounded-button border-2 border-ink-100 px-3 py-2" />
          <label className="mt-4 block text-sm font-semibold text-ink">World name</label>
          <input name="worldName" maxLength={80} placeholder="The Meadowlands" className="mt-1 w-full rounded-button border-2 border-ink-100 px-3 py-2" />
          <button type="submit" className="btn-primary mt-6" disabled={!canCreate && tier === "free"}>
            Create series
          </button>
        </form>
      )}

      <ul className="mt-10 grid gap-4 lg:grid-cols-2">
        {seriesList.map((s) => (
          <li key={s.id} className="card-base">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-coral">{s.child.name}{s.isDefault ? " · Default" : ""}</p>
                <h2 className="text-xl font-bold text-ink">{s.title}</h2>
                {s.world && <p className="text-sm text-ink-500">World: {s.world.name}</p>}
              </div>
              <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-semibold text-ink">{s._count.books} books</span>
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
            <Link href={`/portal/series/${s.id}`} className="btn-secondary mt-4 inline-flex text-sm">
              Manage cast &amp; books
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
