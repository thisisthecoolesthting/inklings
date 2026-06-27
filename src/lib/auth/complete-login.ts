import { NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { signSessionToken, setSessionCookie } from "@/lib/session";
import { unlockGrownupOnLogin } from "@/lib/grownup-gate";
import { getSiteUrl } from "@/lib/site-url";

export async function completeLogin(user: User, next?: string | null): Promise<NextResponse> {
  const sessionToken = await signSessionToken({
    userId: user.id,
    email: user.email,
    tier: user.subscriptionTier,
  });
  await setSessionCookie(sessionToken);
  await unlockGrownupOnLogin();

  const dest = next && next.startsWith("/") && !next.startsWith("//") ? next : "/portal";
  return NextResponse.redirect(new URL(dest, getSiteUrl()), { status: 303 });
}
