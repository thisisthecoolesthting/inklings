import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMagicLinkToken } from "@/lib/auth/magic-link";
import { signSessionToken, setSessionCookie } from "@/lib/session";
import { getSiteUrl } from "@/lib/site-url";

/** GET /api/auth/verify?token=... — exchanges magic link for ink_session. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const next = req.nextUrl.searchParams.get("next") ?? "/portal";
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid", getSiteUrl()));
  }
  const verified = await verifyMagicLinkToken(token);
  if (!verified) {
    return NextResponse.redirect(new URL("/login?error=invalid", getSiteUrl()));
  }

  const user = await prisma.user.findUnique({ where: { id: verified.userId } });
  if (!user) {
    return NextResponse.redirect(new URL("/login?error=not_found", getSiteUrl()));
  }

  const sessionToken = await signSessionToken({
    userId: user.id,
    email: user.email,
    tier: user.subscriptionTier,
  });
  await setSessionCookie(sessionToken);

  // Mark this magic link consumed (best-effort).
  await prisma.magicLink.updateMany({
    where: { userId: user.id, tokenHash: token.slice(-32), consumed: false },
    data: { consumed: true },
  }).catch(() => {});

  return NextResponse.redirect(new URL(next, getSiteUrl()));
}
