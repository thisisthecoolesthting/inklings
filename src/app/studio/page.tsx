import Link from "next/link";
import { BookOpen, Users } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ensureDefaultSeries } from "@/lib/series-bootstrap";
import { minCoreCastToPublish } from "@/lib/tier-limits";
import { bootstrapStarterCast } from "./story/actions";

export default async function StudioHome({
  searchParams,
}: {
  searchParams: Promise<{ child?: string; new?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;
  const params = await searchParams;
  const children = await prisma.childProfile.findMany({
    where: { parentId: session.userId },
    include: { _count: { select: { characters: true, books: true } } },
  });

  const childrenReady = await Promise.all(
    children.map(async (c) => {
      const series = await ensureDefaultSeries(prisma, c.id);
      const coreCount = series
        ? await prisma.seriesCast.count({ where: { seriesId: series.id, role: "core" } })
        : 0;
      const bookCount = series
        ? await prisma.book.count({ where: { seriesId: series.id, status: { not: "draft" } } })
        : c._count.books;
      return { ...c, seriesId: series?.id ?? null, seriesTitle: series?.title ?? null, coreCount, bookCount };
    }),
  );

  const minCore = minCoreCastToPublish();

  return (
    <div className="py-4">
      <header className="mb-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-coral text-4xl" aria-hidden>
          ✨
        </div>
        <h1 className="mt-4 text-4xl font-bold text-ink">Hi! I&apos;m Sparky.</h1>
        <p className="mt-3 text-2xl text-ink-700">Who&apos;s making a book today?</p>
      </header>

      {params.new === "character" && (
        <div className="mb-6 rounded-3xl border-2 border-mint-400 bg-mint-100 p-5 text-center">
          <p className="text-2xl font-bold text-ink">New friend saved!</p>
          <p className="mt-1 text-ink-700">They can jump into the next book.</p>
        </div>
      )}

      {children.length === 0 ? (
        <div className="rounded-3xl border-2 border-ink-100 bg-white p-8 text-center">
          <p className="text-xl text-ink-700">A grown-up needs to add your name first.</p>
          <Link href="/portal/children" className="btn-primary mt-6 inline-flex">
            Grown-up: add a child
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {childrenReady.map((c) => {
            const ready = c.coreCount >= minCore;
            return (
              <div key={c.id} className="rounded-3xl border-2 border-ink-100 bg-white p-6 text-center shadow-card">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-mint-100 text-4xl font-bold text-ink">
                  {c.name[0]}
                </div>
                <h2 className="mt-4 text-3xl font-bold text-ink">{c.name}</h2>
                <p className="mt-1 text-base text-ink-600">
                  {c.seriesTitle ?? "My series"}
                  {c.bookCount > 0 ? ` · ${c.bookCount} book${c.bookCount === 1 ? "" : "s"}` : " · first book"}
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {ready ? (
                    <Link
                      href={`/studio/story?child=${c.id}`}
                      className="big-button inline-flex items-center justify-center gap-2"
                    >
                      <BookOpen className="h-7 w-7" aria-hidden />
                      {c.bookCount > 0 ? `Make book ${c.bookCount + 1}` : "Make a book"}
                    </Link>
                  ) : c.seriesId ? (
                    <form action={bootstrapStarterCast.bind(null, c.id, c.seriesId)}>
                      <button type="submit" className="big-button">
                        Start with Milo &amp; Pip
                      </button>
                    </form>
                  ) : (
                    <p className="text-ink-600">Ask a grown-up to finish setup.</p>
                  )}
                  <Link
                    href={`/studio/character?child=${c.id}`}
                    className="big-button-mint inline-flex items-center justify-center gap-2"
                  >
                    <Users className="h-6 w-6" aria-hidden /> Make a friend
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
