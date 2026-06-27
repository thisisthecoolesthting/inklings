import Link from "next/link";
import { Sparkles, BookOpen, Users, Wand2 } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ensureDefaultSeries } from "@/lib/series-bootstrap";
import { minCoreCastToPublish } from "@/lib/tier-limits";
import { bootstrapStarterCast } from "./story/actions";

export default async function StudioHome() {
  const session = await getSession();
  if (!session) return null;
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
      return { ...c, seriesId: series?.id ?? null, coreCount };
    }),
  );

  const needsSetup = childrenReady.some((c) => c.coreCount < minCoreCastToPublish());
  const minCore = minCoreCastToPublish();

  return (
    <div className="container-ink py-12">
      <header className="mb-12 text-center">
        <Sparkles className="mx-auto h-16 w-16 text-coral" aria-hidden />
        <h1 className="mt-4 text-4xl font-bold text-ink">Hi! I&apos;m Sparky.</h1>
        <p className="mt-3 text-xl text-ink-700">Who&apos;s making a story today?</p>
      </header>

      {children.length === 0 ? (
        <div className="card-base mx-auto max-w-md text-center">
          <p className="text-ink-700">No child profile yet — a grown-up needs to set one up first.</p>
          <Link href="/portal/children" className="btn-primary mt-6 inline-flex">
            Grown-up: add a child
          </Link>
        </div>
      ) : (
        <>
          {needsSetup && (
            <div className="card-base mx-auto mb-10 max-w-2xl border-2 border-mint-400 bg-mint-50">
              <div className="flex items-start gap-3">
                <Wand2 className="mt-1 h-8 w-8 flex-none text-coral" aria-hidden />
                <div>
                  <h2 className="text-xl font-bold text-ink">First time? Set up story friends</h2>
                  <p className="mt-2 text-sm text-ink-700">
                    Every story needs <strong>{minCore} characters</strong> in your child&apos;s series. A grown-up can
                    tap <strong>Quick start</strong> to add Milo &amp; Pip, or make custom characters together.
                  </p>
                  <ol className="mt-4 space-y-2 text-sm text-ink-700">
                    <li>
                      <span className="font-bold text-coral">1.</span> Grown-up adds characters (or quick start)
                    </li>
                    <li>
                      <span className="font-bold text-coral">2.</span> Kid taps <strong>Start a story</strong>
                    </li>
                    <li>
                      <span className="font-bold text-coral">3.</span> Grown-up approves the finished book in the portal
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {childrenReady.map((c) => {
              const ready = c.coreCount >= minCore;
              return (
                <div key={c.id} className="card-base text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint-100 text-3xl">
                    {c.name[0]}
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-ink">{c.name}</h2>
                  <p className="text-sm text-ink-500">
                    Age {c.age} &middot; {c.coreCount}/{minCore} story friends
                    {c._count.books > 0 && ` · ${c._count.books} book${c._count.books === 1 ? "" : "s"}`}
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    {ready ? (
                      <Link
                        href={`/studio/story?child=${c.id}`}
                        className="big-button inline-flex items-center justify-center gap-2 text-base"
                      >
                        <BookOpen className="h-5 w-5" aria-hidden /> Start a story
                      </Link>
                    ) : (
                      <div className="rounded-card border border-coral/20 bg-coral/5 px-4 py-3 text-sm text-ink-700">
                        Need {minCore - c.coreCount} more character{minCore - c.coreCount === 1 ? "" : "s"} first
                      </div>
                    )}
                    <Link
                      href={`/studio/character?child=${c.id}`}
                      className="big-button-mint inline-flex items-center justify-center gap-2 text-base"
                    >
                      <Users className="h-5 w-5" aria-hidden /> Make a character
                    </Link>
                    {!ready && c.seriesId && (
                      <form action={bootstrapStarterCast.bind(null, c.id, c.seriesId)}>
                        <button type="submit" className="btn-secondary btn-full text-sm">
                          Quick start — Milo &amp; Pip (grown-up tap)
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <footer className="mt-16 text-center">
        <Link href="/library" className="text-sm text-ink-500 underline">
          Go to my library
        </Link>
      </footer>
    </div>
  );
}
