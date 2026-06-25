import type { PrismaClient } from "@prisma/client";

/** Bootstraps default world + series for a new child. */
export async function bootstrapChildUniverse(prisma: PrismaClient, childId: string, childName: string) {
  const world = await prisma.world.create({
    data: {
      childId,
      name: `${childName}'s World`,
      description: "The first magical place in their story universe.",
    },
  });

  const series = await prisma.series.create({
    data: {
      childId,
      worldId: world.id,
      title: `${childName}'s Stories`,
      description: "Adventures with their favorite characters.",
      isDefault: true,
    },
  });

  await prisma.childProfile.update({
    where: { id: childId },
    data: { activeSeriesId: series.id },
  });

  return { world, series };
}

export function getSeriesLimits(tier: "free" | "premium") {
  return tier === "premium"
    ? { maxSeries: 999, maxCoreCast: 3 }
    : { maxSeries: 1, maxCoreCast: 3 };
}

/** Ensures every child has a default series + activeSeriesId. */
export async function ensureDefaultSeries(prisma: PrismaClient, childId: string) {
  const child = await prisma.childProfile.findUnique({ where: { id: childId } });
  if (!child) return null;

  let series = await prisma.series.findFirst({
    where: { childId },
    orderBy: { isDefault: "desc" },
  });

  if (!series) {
    const boot = await bootstrapChildUniverse(prisma, childId, child.name);
    series = boot.series;
  }

  if (!child.activeSeriesId) {
    await prisma.childProfile.update({
      where: { id: childId },
      data: { activeSeriesId: series.id },
    });
  }

  return series;
}

export async function getActiveSeriesContext(
  prisma: PrismaClient,
  childId: string,
  seriesId?: string | null,
) {
  await ensureDefaultSeries(prisma, childId);
  const child = await prisma.childProfile.findUnique({ where: { id: childId } });
  const sid = seriesId ?? child?.activeSeriesId;
  if (!sid) return null;

  return prisma.series.findFirst({
    where: { id: sid, childId },
    include: {
      world: true,
      seriesCast: {
        orderBy: { slot: "asc" },
        include: { character: true },
      },
      books: { where: { status: { not: "draft" } }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}
