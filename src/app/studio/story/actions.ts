"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { sanitizeChildInput } from "@/lib/safety";
import { ensureDefaultSeries } from "@/lib/series-bootstrap";
import { minCoreCastToPublish } from "@/lib/tier-limits";
import { sendApprovalNotification } from "@/lib/email";

const PageSchema = z.object({
  text: z.string().trim().min(1).max(800),
  imagePrompt: z.string().trim().max(1200).default(""),
  imageUrl: z.string().nullable().optional(),
  act: z.string().default("beginning"),
});

const SubmitSchema = z.object({
  childId: z.string().min(8),
  seriesId: z.string().min(8).optional(),
  variantKey: z.string().max(80).optional(),
  title: z.string().trim().min(1).max(80),
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

  const coreCount = await prisma.seriesCast.count({ where: { seriesId, role: "core" } });
  if (coreCount < minCoreCastToPublish()) {
    return { ok: false as const, error: "need_core_cast", need: minCoreCastToPublish() };
  }

  const safeTitle = sanitizeChildInput(parsed.data.title).safe || "An Inklings Story";

  const actByIdx = (i: number): string => {
    const buckets = ["beginning", "beginning", "problem", "adventure", "adventure", "resolution", "celebration"];
    return buckets[i] ?? "celebration";
  };

  const book = await prisma.book.create({
    data: {
      childId: child.id,
      seriesId,
      title: safeTitle,
      status: "awaiting_parent",
      storyJson: { pages: parsed.data.pages, variantKey: parsed.data.variantKey ?? null },
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
  return { ok: true as const, bookId: book.id, pageCount: book.pages.length };
}
