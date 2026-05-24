import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signMagicLinkToken, buildMagicLinkUrl } from "@/lib/auth/magic-link";
import { sendMagicLinkEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";

const Schema = z.object({ email: z.string().email().max(254), tier: z.string().optional() });

/** POST /api/auth/login — accepts an email, sends a magic link. */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const parsed = Schema.safeParse({ email: form.get("email"), tier: form.get("tier") });
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/login?error=invalid", getSiteUrl()), { status: 303 });
  }
  const email = parsed.data.email.trim().toLowerCase();

  // Upsert the user — if they don't exist, this is also signup.
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, subscriptionTier: parsed.data.tier === "premium" ? "free" : "free" },
    update: {},
  });

  const token = await signMagicLinkToken(user.id, user.email);
  const url = buildMagicLinkUrl(token, "/portal");

  // Persist the token hash for one-time consumption.
  await prisma.magicLink.create({
    data: {
      userId: user.id,
      tokenHash: token.slice(-32), // simple hash for MVP — replace with real hash before live
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    },
  });

  try {
    await sendMagicLinkEmail({ to: email, url });
  } catch (err) {
    console.error("magic-link email failed:", err);
    return NextResponse.redirect(new URL("/login?error=server", getSiteUrl()), { status: 303 });
  }

  return NextResponse.redirect(new URL("/login?ok=1", getSiteUrl()), { status: 303 });
}
