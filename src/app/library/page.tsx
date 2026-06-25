import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ensureDefaultSeries } from "@/lib/series-bootstrap";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams?: Promise<{ child?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/library");

  const params = (await searchParams) ?? {};
  const children = await prisma.childProfile.findMany({
    where: { parentId: session.userId },
    orderBy: { name: "asc" },
  });

  const childId = params.child ?? children[0]?.id;
  if (!childId) {
    return (
      <div className="card-base mx-auto max-w-md text-center">
        <p className="text-ink-700">Add a child profile first.</p>
        <Link href="/grownup" className="btn-primary mt-6 inline-flex">Ask a grown-up</Link>
      </div>
    );
  }

  await ensureDefaultSeries(prisma, childId);

  const seriesList = await prisma.series.findMany({
    where: { childId },
    include: {
      world: true,
      seriesCast: { include: { character: true }, orderBy: { slot: "asc" } },
      books: {
        where: { status: { in: ["approved", "exported", "ordered", "awaiting_parent"] } },
        orderBy: { updatedAt: "desc" },
        take: 1,
        include: { pages: { take: 1, orderBy: { pageNumber: "asc" } } },
      },
      _count: { select: { books: true } },
    },
    orderBy: { isDefault: "desc" },
  });

  return (
    <>
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-ink">My collection</h1>
        <p className="mt-2 text-ink-600">Pick a series shelf to read your books.</p>
        {children.length > 1 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {children.map((c) => (
              <Link
                key={c.id}
                href={`/library?child=${c.id}`}
                className={"rounded-full px-4 py-1 text-sm font-medium " + (c.id === childId ? "bg-coral text-white" : "bg-mint-100 text-ink")}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <ul className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        {seriesList.map((s) => {
          const thumb = s.books[0]?.coverUrl ?? s.books[0]?.pages[0]?.imageUrlLowres;
          return (
            <li key={s.id}>
              <Link href={`/library/series/${s.id}?child=${childId}`} className="card-base block hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden rounded-card bg-gradient-to-br from-cream-200 to-mint-100">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="h-full w-full object-cover opacity-90" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                      <p className="text-lg font-bold text-ink">{s.title}</p>
                      <p className="text-sm text-ink-500">{s.world?.name}</p>
                    </div>
                  )}
                </div>
                <h2 className="mt-3 text-xl font-bold text-ink">{s.title}</h2>
                <p className="text-sm text-ink-500">{s._count.books} books · {s.seriesCast.length} characters</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.seriesCast.map((c) => (
                    <span key={c.id} className="rounded-full bg-cream-200 px-2 py-0.5 text-xs text-ink-600">{c.character.name}</span>
                  ))}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 text-center">
        <Link href={`/studio/story?child=${childId}`} className="btn-primary">Make a new story</Link>
      </div>
    </>
  );
}
