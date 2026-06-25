"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { canAddSeries, canAddCoreCast } from "@/lib/tier-limits";

async function requireSession() {
  const s = await getSession();
  if (!s) redirect("/login?next=/portal/series");
  return s;
}

async function ownedSeries(seriesId: string, userId: string) {
  return prisma.series.findFirst({
    where: { id: seriesId, child: { parentId: userId } },
    include: { seriesCast: true, world: true, child: true },
  });
}

export async function createSeries(formData: FormData) {
  const session = await requireSession();
  const childId = String(formData.get("childId") ?? "");
  const title = String(formData.get("title") ?? "").trim().slice(0, 80);
  const worldName = String(formData.get("worldName") ?? "").trim().slice(0, 80);
  if (!childId || !title) return;

  const child = await prisma.childProfile.findFirst({
    where: { id: childId, parentId: session.userId },
  });
  if (!child) return;

  const tier = session.tier === "premium" ? "premium" : "free";
  if (!(await canAddSeries(prisma, childId, tier))) return;

  const world = await prisma.world.create({
    data: {
      childId,
      name: worldName || `${title} World`,
      description: `Setting for ${title}.`,
    },
  });

  const series = await prisma.series.create({
    data: { childId, worldId: world.id, title, isDefault: false },
  });

  await prisma.childProfile.update({
    where: { id: childId },
    data: { activeSeriesId: series.id },
  });

  revalidatePath("/portal/series");
  revalidatePath("/library");
  redirect(`/portal/series/${series.id}`);
}

export async function assignCastSlot(formData: FormData) {
  const session = await requireSession();
  const seriesId = String(formData.get("seriesId") ?? "");
  const characterId = String(formData.get("characterId") ?? "");
  const slot = Number(formData.get("slot"));
  if (!seriesId || !characterId || slot < 1 || slot > 3) return;

  const series = await ownedSeries(seriesId, session.userId);
  if (!series) return;

  const character = await prisma.character.findFirst({
    where: {
      id: characterId,
      childId: series.childId,
      sandboxMode: false,
      parentApprovedAt: { not: null },
    },
  });
  if (!character) return;

  const tier = session.tier === "premium" ? "premium" : "free";
  const existing = series.seriesCast.find((c) => c.slot === slot);
  if (!existing && !(await canAddCoreCast(prisma, seriesId, tier))) return;

  await prisma.$transaction([
    prisma.seriesCast.deleteMany({ where: { seriesId, OR: [{ slot }, { characterId }] } }),
    prisma.seriesCast.create({ data: { seriesId, characterId, slot, role: "core" } }),
  ]);

  revalidatePath(`/portal/series/${seriesId}`);
  revalidatePath("/library");
}

export async function clearCastSlot(formData: FormData) {
  const session = await requireSession();
  const seriesId = String(formData.get("seriesId") ?? "");
  const slot = Number(formData.get("slot"));
  if (!(await ownedSeries(seriesId, session.userId))) return;
  await prisma.seriesCast.deleteMany({ where: { seriesId, slot } });
  revalidatePath(`/portal/series/${seriesId}`);
}

export async function setActiveSeries(formData: FormData) {
  const session = await requireSession();
  const childId = String(formData.get("childId") ?? "");
  const seriesId = String(formData.get("seriesId") ?? "");
  const child = await prisma.childProfile.findFirst({ where: { id: childId, parentId: session.userId } });
  if (!child) return;
  const series = await prisma.series.findFirst({ where: { id: seriesId, childId } });
  if (!series) return;
  await prisma.childProfile.update({ where: { id: childId }, data: { activeSeriesId: seriesId } });
  revalidatePath("/studio");
  revalidatePath("/library");
}
