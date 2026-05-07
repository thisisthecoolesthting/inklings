"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { sanitizeChildInput } from "@/lib/safety";

const CreateSchema = z.object({
  childId: z.string().min(8),
  name: z.string().trim().min(1).max(30),
  species: z.string().trim().max(40).optional().nullable(),
  personality: z.string().trim().max(120).optional().nullable(),
  role: z.string().trim().max(40).optional().nullable(),
});

async function requireSession() {
  const s = await getSession();
  if (!s) redirect("/login?next=/studio");
  return s;
}

export async function createCharacter(formData: FormData) {
  const session = await requireSession();
  const parsed = CreateSchema.safeParse({
    childId: formData.get("childId"),
    name: formData.get("name"),
    species: formData.get("species") || null,
    personality: formData.get("personality") || null,
    role: formData.get("role") || null,
  });
  if (!parsed.success) return;

  // Ownership check
  const child = await prisma.childProfile.findFirst({
    where: { id: parsed.data.childId, parentId: session.userId },
  });
  if (!child) return;

  // Sanitize all child-supplied strings
  const safeName = sanitizeChildInput(parsed.data.name).safe;
  const safeSpecies = parsed.data.species ? sanitizeChildInput(parsed.data.species).safe : null;
  const safeRole = parsed.data.role ? sanitizeChildInput(parsed.data.role).safe : null;
  const traits = parsed.data.personality
    ? parsed.data.personality.split(/[,;]/).map((t) => sanitizeChildInput(t.trim()).safe).filter(Boolean).slice(0, 5)
    : [];

  // Generate a deterministic image seed from name+species so future renders stay consistent
  const seed = Buffer.from(`${safeName}-${safeSpecies ?? ""}`).toString("base64").slice(0, 16);

  await prisma.character.create({
    data: {
      childId: child.id,
      name: safeName,
      species: safeSpecies,
      role: safeRole,
      personalityTraits: traits,
      imageSeed: seed,
      sandboxMode: true, // ALWAYS sandbox until parent approves
    },
  });

  revalidatePath("/studio");
  revalidatePath(`/studio?child=${child.id}`);
  revalidatePath("/portal/approvals");
  redirect(`/studio?child=${child.id}&new=character`);
}
