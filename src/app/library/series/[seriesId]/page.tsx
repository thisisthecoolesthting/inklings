import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function LibrarySeriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ seriesId: string }>;
  searchParams?: Promise<{ child?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/library");

  const { seriesId } = await params;
  const sp = (await searchParams) ?? {};

  const series = await prisma.series.findFirst({
    where: { id: seriesId, child: { parentId: session.userId } },
    include: {
      world: true,
      child: true,
      seriesCast: { include: { character: true }, orderBy: { slot: "asc" } },
    },
  });
  if (!series) notFound();

  const childQ = sp.child ? `?child=${sp.child}` : `?child=${series.childId}`;

  const books = await prisma.book.findMany({
    where: {
      seriesId,
      status: { in: ["approved", "exported", "ordered"] },
    },
    orderBy: { updatedAt: "desc" },
    include: { pages: { take: 1, orderBy: { pageNumber: "asc" } } },
  });

  return (
    <>
      <Link href={`/library${childQ}`} className="text-sm text-ink-500 underline">← All series</Link>
      <header className="mt-4 mb-8 text-center">
        <h1 className="text-3xl font-bold text-ink">{series.title}</h1>
        <p className="text-ink-600">{series.world?.name}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {series.seriesCast.map((c) => (
            <span key={c.id} className="rounded-full bg-mint-100 px-3 py-1 text-sm text-ink">{c.character.name}</span>
          ))}
        </div>
      </header>

      {books.length === 0 ? (
        <div className="card-base mx-auto max-w-md text-center">
          <p className="text-ink-700">No finished books on this shelf yet.</p>
          <Link href={`/studio/story?child=${series.childId}&series=${series.id}`} className="btn-primary mt-6 inline-flex">
            Start a story
          </Link>
        </div>
      ) : (
        <ul className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((b) => {
            const thumb = b.coverUrl ?? b.pages[0]?.imageUrlLowres ?? b.pages[0]?.imageUrlHd;
            return (
              <li key={b.id}>
                <Link href={`/library/${b.id}${childQ}`} className="card-base block hover:-translate-y-1">
                  <div className="aspect-[4/5] overflow-hidden rounded-card bg-cream-200">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-ink-500">No cover</div>
                    )}
                  </div>
                  <h2 className="mt-3 font-bold text-ink">{b.title}</h2>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
