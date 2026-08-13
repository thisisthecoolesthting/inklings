import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { resolveStoryFlow } from "@/content/sparky-prompts";
import { getActiveSeriesContext, ensureDefaultSeries } from "@/lib/series-bootstrap";
import { minCoreCastToPublish } from "@/lib/tier-limits";
import { colorsFromJson, recapFromLastBook } from "@/lib/series-bible";
import { StudioStoryClient } from "./client";
import { bootstrapStarterCast } from "./actions";

export default async function StoryPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string; series?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/studio");
  const params = await searchParams;
  const childId = params.child;
  if (!childId) redirect("/studio");

  const child = await prisma.childProfile.findFirst({
    where: { id: childId, parentId: session.userId },
  });
  if (!child) redirect("/studio");

  await ensureDefaultSeries(prisma, childId);
  const seriesCtx = await getActiveSeriesContext(prisma, childId, params.series ?? child.activeSeriesId);
  if (!seriesCtx) redirect("/studio");

  const cast = seriesCtx.seriesCast.map((sc) => sc.character);
  const coreCount = seriesCtx.seriesCast.length;

  const storyCount = await prisma.book.count({
    where: { childId, seriesId: seriesCtx.id, status: { not: "draft" } },
  });
  const lastBook = await prisma.book.findFirst({
    where: { childId, seriesId: seriesCtx.id, status: { not: "draft" } },
    orderBy: { createdAt: "desc" },
    include: { pages: { orderBy: { pageNumber: "desc" }, take: 1 } },
  });
  const lastVariantKey =
    lastBook?.storyJson && typeof lastBook.storyJson === "object" && lastBook.storyJson !== null
      ? (lastBook.storyJson as { variantKey?: string }).variantKey ?? null
      : null;

  const bookNumber = storyCount + 1;
  const { beats, variantKey } = resolveStoryFlow({ storyNumber: bookNumber, lastVariantKey });
  const lastBookRecap = recapFromLastBook({
    title: lastBook?.title,
    lastParagraph: lastBook?.pages[0]?.textContent ?? null,
    bookNumber,
  });

  if (coreCount < minCoreCastToPublish()) {
    return (
      <div className="py-6 text-center">
        <p className="text-5xl" aria-hidden>
          ✨
        </p>
        <h1 className="mt-4 text-3xl font-bold text-ink">We need story friends!</h1>
        <p className="mx-auto mt-3 max-w-md text-xl text-ink-700">
          Pick two friends, then Sparky can write {child.name}&apos;s book.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <form action={bootstrapStarterCast.bind(null, childId, seriesCtx.id)} className="w-full max-w-sm">
            <button type="submit" className="big-button">
              Use Milo &amp; Pip
            </button>
          </form>
          <Link href={`/studio/character?child=${childId}`} className="big-button-mint w-full max-w-sm">
            Make my own friend
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <header className="mb-4 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-coral">
          {seriesCtx.title} · Book {bookNumber}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink">Let&apos;s make a book!</h1>
        {seriesCtx.world && <p className="mt-1 text-base text-ink-600">{seriesCtx.world.name}</p>}
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {cast.map((c) => (
            <span key={c.id} className="rounded-full bg-mint-100 px-3 py-1 text-sm font-semibold text-ink">
              {c.name}
            </span>
          ))}
        </div>
      </header>
      <StudioStoryClient
        childId={child.id}
        seriesId={seriesCtx.id}
        variantKey={variantKey}
        ctx={{
          childName: child.name,
          childAge: child.age,
          characters: cast.map((c) => ({
            name: c.name,
            species: c.species,
            role: c.role,
            colors: colorsFromJson(c.colorsJson),
            outfit: c.outfit,
            personalityTraits: (c.personalityTraits as string[]) ?? [],
            imageSeed: c.imageSeed,
            previewUrl: (c.approvedImagesJson as { preview?: string } | null)?.preview ?? null,
          })),
          worldName: seriesCtx.world?.name ?? null,
          seriesTitle: seriesCtx.title,
          bookNumber,
          lastBookRecap,
          pagesSoFar: [],
          storyState: [],
        }}
        flow={beats}
      />
    </div>
  );
}
