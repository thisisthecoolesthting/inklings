"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const IdSchema = z.object({ id: z.string().min(8).max(40) });

async function requireSession() {
  const s = await getSession();
  if (!s) redirect("/login?next=/portal/approvals");
  return s;
}

function revalidateAll() {
  revalidatePath("/portal");
  revalidatePath("/portal/approvals");
  revalidatePath("/portal/children");
  revalidatePath("/studio");
}

export async function approveCharacter(formData: FormData) {
  const session = await requireSession();
  const parsed = IdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;
  // Verify ownership: character.child.parentId == session.userId
  const ch = await prisma.character.findFirst({
    where: { id: parsed.data.id, child: { parentId: session.userId } },
  });
  if (!ch) return; // silent — never leak existence to non-owner
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

export async function approveBook(formData: FormData) {
  const session = await requireSession();
  const parsed = IdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;
  const b = await prisma.book.findFirst({
    where: { id: parsed.data.id, child: { parentId: session.userId } },
  });
  if (!b) return;
  await prisma.book.update({
    where: { id: b.id },
    data: { status: "approved", parentApprovedAt: new Date() },
  });
  revalidateAll();
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
