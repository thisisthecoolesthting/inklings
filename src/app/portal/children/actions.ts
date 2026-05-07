"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const AddChildSchema = z.object({
  name: z.string().trim().min(1).max(40),
  age: z.coerce.number().int().min(2).max(14),
});

async function requireSession() {
  const s = await getSession();
  if (!s) redirect("/login?next=/portal/children");
  return s;
}

export async function addChild(formData: FormData) {
  const session = await requireSession();
  const parsed = AddChildSchema.safeParse({
    name: formData.get("name"),
    age: formData.get("age"),
  });
  if (!parsed.success) return;
  await prisma.childProfile.create({
    data: {
      parentId: session.userId,
      name: parsed.data.name,
      age: parsed.data.age,
    },
  });
  revalidatePath("/portal");
  revalidatePath("/portal/children");
  revalidatePath("/studio");
}

export async function deleteChild(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  if (id.length < 8) return;
  // Ownership check via parentId
  const child = await prisma.childProfile.findFirst({
    where: { id, parentId: session.userId },
  });
  if (!child) return;
  await prisma.childProfile.delete({ where: { id: child.id } });
  revalidatePath("/portal");
  revalidatePath("/portal/children");
  revalidatePath("/studio");
}
