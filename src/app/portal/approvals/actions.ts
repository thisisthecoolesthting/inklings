"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { generateHd } from "@/lib/image-gen";

const IdSchema = z.object({ id: z.string().min(8).max(40) });

async function requireSession() {
  const s = await getSession();
  if (!s) redirect("/login?next=/portal/approvals");
  return s;
}

function revalidateAll() {
  revalidatePath("/portal");
  revalidatePath("/portal/approvals");
  revalidatePath("/portal/orders");
  revalidatePath("/portal/children");
  revalidatePath("/studio");
}

export async function approveCharacter(formData: FormData) {
  const session = await requireSession();
  const parsed = IdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;
  const ch = await prisma.character.findFirst({
    where: { id: parsed.data.id, child: { parentId: session.userId } },
  });
  if (!ch) return;
  await prisma.character.update({
    where: { id: ch.id },
    data: { sandboxMode: false, parentApprovedAt: new Date() },
  });
  revalidateAll();
}

export async function rejectCharacter(formData: FormData) {
  const session = await requireSession();
  const parsed = IdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;
  const ch = await prisma.character.findFirst({
    where: { id: parsed.data.id, child: { parentId: session.userId } },
  });
  if (!ch) return;
  await prisma.character.delete({ where: { id: ch.id } });
  revalidateAll();
}

async function fireHdGeneration(bookId: string) {
  const pages = await prisma.bookPage.findMany({
    where: { bookId, imagePrompt: { not: null } },
    select: { id: true, imagePrompt: true, imageUrlHd: true },
  });
  await Promise.all(
    pages
      .filter((p) => !p.imageUrlHd && p.imagePrompt)
      .map(async (p) => {
        const result = await generateHd(p.imagePrompt!);
        if (result.ok) {
          await prisma.bookPage.update({
            where: { id: p.id },
            data: { imageUrlHd: result.url, imageApproved: true },
          });
        }
      }),
  );
}

async function approveBookInternal(bookId: string, userId: string) {
  const b = await prisma.book.findFirst({
    where: { id: bookId, child: { parentId: userId } },
  });
  if (!b || b.status === "approved" || b.status === "ordered") return b;
  await prisma.book.update({
    where: { id: b.id },
    data: { status: "approved", parentApprovedAt: new Date() },
  });
  if (process.env.TOGETHER_API_KEY) {
    fireHdGeneration(b.id).catch(() => {});
  }
  return b;
}

export async function approveBook(formData: FormData) {
  const session = await requireSession();
  const parsed = IdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;
  await approveBookInternal(parsed.data.id, session.userId);
  revalidateAll();
}

/** Approve story then send parent straight to print checkout — highest-intent moment. */
export async function approveBookAndPrint(formData: FormData) {
  const session = await requireSession();
  const parsed = IdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) redirect("/portal/approvals");
  const b = await approveBookInternal(parsed.data.id, session.userId);
  if (!b) redirect("/portal/approvals");
  revalidateAll();
  redirect(`/api/billing/checkout?tier=print&bookId=${b.id}`);
}

export async function rejectBook(formData: FormData) {
  const session = await requireSession();
  const parsed = IdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;
  const b = await prisma.book.findFirst({
    where: { id: parsed.data.id, child: { parentId: session.userId } },
  });
  if (!b) return;
  await prisma.book.update({
    where: { id: b.id },
    data: { status: "draft" },
  });
  revalidateAll();
}
