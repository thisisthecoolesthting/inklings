"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { sanitizeChildInput } from "@/lib/safety";
import { assignCharacterToSeries, ensureDefaultSeries } from "@/lib/series-bootstrap";
import { minCoreCastToPublish } from "@/lib/tier-limits";
import { sendApprovalNotification } from "@/lib/email";
import {
  STARTER_FRIENDS,
  isGenericSeriesTitle,
  isGenericWorldName,
  seriesTitleFromCast,
  titleFromChoices,
  type SeriesChoice,
} from "@/lib/series-bible";

const PageSchema = z.object({
  text: z.string().trim().min(1).max(800),
  imagePrompt: z.string().trim().max(1200).default(""),
  imageUrl: z.string().nullable().optional(),
  act: z.string().default("beginning"),
});

const ChoiceSchema = z.object({
  beatId: z.string(),
  choiceId: z.string(),
  label: z.string().max(80).optional(),
});

const SubmitSchema = z.object({
  childId: z.string().min(8),
  seriesId: z.string().min(8).optional(),
  variantKey: z.string().max(80).optional(),
  title: z.string().trim().min(1).max(80).optional(),
  choices: z.array(ChoiceSchema).max(20).optional(),
  pages: z.array(PageSchema).min(3).max(40),
});

async function requireSession() {
  const s = await getSession();
  if (!s) redirect("/login?next=/studio");
  return s;
}

export async function submitStoryForApproval(payload: unknown) {
  const session = await requireSession();
  const parsed = SubmitSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false as const, error: "invalid_payload" };
  }

  const child = await prisma.childProfile.findFirst({
    where: { id: parsed.data.childId, parentId: session.userId },
  });
  if (!child) return { ok: false as const, error: "child_not_found" };

  const series = await ensureDefaultSeries(prisma, child.id);
  const seriesId = parsed.data.seriesId ?? child.activeSeriesId ?? series?.id;
  if (!seriesId) return { ok: false as const, error: "no_series" };

  const seriesRow = await prisma.series.findFirst({
    where: { id: seriesId, childId: child.id },
    include: {
      world: true,
      seriesCast: { include: { character: true }, orderBy: { slot: "asc" } },
    },
  });
  if (!seriesRow) return { ok: false as const, error: "no_series" };

  const coreCount = seriesRow.seriesCast.filter((c) => c.role === "core").length;
  if (coreCount < minCoreCastToPublish()) {
    return { ok: false as const, error: "need_core_cast", need: minCoreCastToPublish() };
  }

  const bookNumber =
    (await prisma.book.count({
      where: { childId: child.id, seriesId, status: { not: "draft" } },
    })) + 1;

  const choices: SeriesChoice[] = (parsed.data.choices ?? []).map((c) => ({
    beatId: c.beatId,
    choiceId: c.choiceId,
    label: c.label ?? c.choiceId,
  }));

  const hero = seriesRow.seriesCast[0]?.character.name ?? child.name;
  const pal = seriesRow.seriesCast[1]?.character.name ?? null;
  const generated = titleFromChoices({ hero, friend: pal, choices, bookNumber });
  const safeTitle = sanitizeChildInput(parsed.data.title || generated).safe || generated;

  const actByIdx = (i: number): string => {
    const buckets = ["beginning", "beginning", "problem", "adventure", "adventure", "resolution", "celebration"];
    return buckets[i] ?? "celebration";
  };

  const settingLabel = choices.find((c) => c.beatId === "where_are_we")?.label;

  const book = await prisma.book.create({
    data: {
      childId: child.id,
      seriesId,
      title: safeTitle,
      subtitle: `Book ${bookNumber}`,
      status: "awaiting_parent",
      storyJson: {
        pages: parsed.data.pages,
        variantKey: parsed.data.variantKey ?? null,
        choices,
        bookNumber,
      },
      pages: {
        create: parsed.data.pages.map((p, i) => ({
          pageNumber: i + 1,
          act: actByIdx(i),
          textContent: sanitizeChildInput(p.text).safe,
          imagePrompt: p.imagePrompt,
          imageUrlLowres: p.imageUrl ?? null,
          imageApproved: false,
        })),
      },
    },
    include: { pages: true },
  });

  if (settingLabel && seriesRow.world && isGenericWorldName(seriesRow.world.name, child.name)) {
    await prisma.world.update({
      where: { id: seriesRow.world.id },
      data: { name: settingLabel.slice(0, 80) },
    });
  }

  if (isGenericSeriesTitle(seriesRow.title, child.name)) {
    const worldName = settingLabel ?? seriesRow.world?.name ?? null;
    await prisma.series.update({
      where: { id: seriesId },
      data: { title: seriesTitleFromCast(hero, pal, worldName) },
    });
  }

  const parent = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { email: true },
  });
  if (parent?.email) {
    void sendApprovalNotification({
      to: parent.email,
      childName: child.name,
      kind: "story",
    }).catch(() => {});
  }

  revalidatePath("/portal");
  revalidatePath("/portal/approvals");
  revalidatePath("/portal/series");
  revalidatePath("/library");
  revalidatePath("/studio");
  return { ok: true as const, bookId: book.id, pageCount: book.pages.length, title: safeTitle, bookNumber };
}

export async function bootstrapStarterCast(childId: string, seriesId: string) {
  const session = await requireSession();

  const child = await prisma.childProfile.findFirst({
    where: { id: childId, parentId: session.userId },
  });
  if (!child) throw new Error("Child not found");

  for (const friend of STARTER_FRIENDS) {
    const existing = await prisma.character.findFirst({
      where: { childId, name: friend.name },
    });
    const character =
      existing ??
      (await prisma.character.create({
        data: {
          childId,
          name: friend.name,
          species: friend.species,
          role: friend.role,
          colorsJson: friend.colors,
          outfit: friend.outfit,
          personalityTraits: friend.personalityTraits,
          imageSeed: Buffer.from(`${friend.name}-${friend.species}`).toString("base64").slice(0, 16),
          sandboxMode: true,
        },
      }));
    await assignCharacterToSeries(prisma, seriesId, character.id);
  }

  revalidatePath(`/studio`);
  revalidatePath(`/studio/story`);
  redirect(`/studio/story?child=${childId}&series=${seriesId}`);
}
