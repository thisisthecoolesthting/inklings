import type { PrismaClient } from "@prisma/client";
import { getSeriesLimits } from "./series-bootstrap";

export async function canAddSeries(prisma: PrismaClient, childId: string, tier: "free" | "premium") {
  const { maxSeries } = getSeriesLimits(tier);
  const count = await prisma.series.count({ where: { childId } });
  return count < maxSeries;
}

export async function canAddCoreCast(prisma: PrismaClient, seriesId: string, tier: "free" | "premium") {
  const { maxCoreCast } = getSeriesLimits(tier);
  const count = await prisma.seriesCast.count({ where: { seriesId, role: "core" } });
  return count < maxCoreCast;
}

export function minCoreCastToPublish() {
  return 2;
}
