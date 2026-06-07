import { NextResponse } from "next/server";
import { getSession, clearSessionCookie } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  try {
    // Order has no onDelete cascade on its User FK, so remove orders first
    // to avoid a foreign-key violation when the User row is deleted.
    await prisma.order.deleteMany({ where: { userId: session.userId } });

    // Deleting the User cascades: Session, MagicLink, ChildProfile →
    // Character, World, Series, Book → BookPage (all have onDelete: Cascade).
    await prisma.user.delete({ where: { id: session.userId } });
  } catch {
    return NextResponse.json({ error: "delete_failed" }, { status: 500 });
  }

  await clearSessionCookie();

  return NextResponse.redirect(new URL("/?deleted=1", getSiteUrl()), {
    status: 303,
  });
}
