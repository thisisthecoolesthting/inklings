import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { resolveStoryFlow } from "@/content/sparky-prompts";
import { getActiveSeriesContext, ensureDefaultSeries } from "@/lib/series-bootstrap";
import { minCoreCastToPublish } from "@/lib/tier-limits";
import { StoryActProgress } from "@/components/studio/StoryActProgress";
import { StudioStoryClient } from "./client";

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

  const storyCount = await prisma.book.count({ where: { childId, seriesId: seriesCtx.id } });
  const lastBook = await prisma.book.findFirst({
    where: { childId, seriesId: seriesCtx.id },
    orderBy: { createdAt: "desc" },
    select: { storyJson: true },
  });
  const lastVariantKey =
    lastBook?.storyJson && typeof lastBook.storyJson === "object" && lastBook.storyJson !== null
      ? (lastBook.storyJson as { variantKey?: string }).variantKey ?? null
      : null;

  const { beats, variantKey } = resolveStoryFlow({ storyNumber: storyCount + 1, lastVariantKey });

  if (coreCount < minCoreCastToPublish()) {
    return (
      <div className="container-ink py-10 text-center">
        <h1 className="text-2xl font-bold text-ink">Almost ready!</h1>
        <p className="mt-3 text-ink-700">
          {child.name} needs at least {minCoreCastToPublish()} characters in <strong>{seriesCtx.title}</strong> before Sparky can write a book.
        </p>
        <p className="mt-2 text-sm text-ink-500">Ask a grown-up to assign characters in the portal, or make new ones in the studio.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/studio/character?child=${childId}`} className="btn-primary">Make a character</Link>
          <Link href="/grownup" className="btn-ghost">Ask a grown-up</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Link href="/studio" className="text-sm text-ink-500 underline">&larr; Back to who&apos;s making</Link>
      <header className="mt-4 mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-coral">{seriesCtx.title}</p>
        <h1 className="text-2xl font-bold text-ink">{child.name}&apos;s story</h1>
        {seriesCtx.world && <p className="text-sm text-ink-500">{seriesCtx.world.name}</p>}
      </header>
      <StoryActProgress currentAct="beginning" />
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
            personalityTraits: (c.personalityTraits as string[]) ?? [],
            imageSeed: c.imageSeed,
            previewUrl: (c.approvedImagesJson as { preview?: string } | null)?.preview ?? null,
          })),
          worldName: seriesCtx.world?.name ?? null,
          storyState: [],
        }}
        flow={beats}
      />
    </div>
  );
}
