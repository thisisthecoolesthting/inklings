import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signResetToken, buildResetPasswordUrl } from "@/lib/auth/reset-token";
import { hashToken } from "@/lib/auth/token-hash";
import { sendPasswordResetEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";
import { rateLimit } from "@/lib/rate-limit";

const Schema = z.object({
  email: z.string().email().max(254),
});

/** POST /api/auth/forgot-password — email a password reset link. */
export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { key: "forgot", limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.redirect(new URL("/forgot-password?error=rate_limited", getSiteUrl()), {
      status: 303,
      headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

  const form = await req.formData();
  const parsed = Schema.safeParse({ email: form.get("email") });
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/forgot-password?error=invalid", getSiteUrl()), {
      status: 303,
    });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always show success to avoid email enumeration.
  if (user) {
    const token = await signResetToken(user.id, user.email);
    await prisma.magicLink.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    try {
      await sendPasswordResetEmail({ to: email, url: buildResetPasswordUrl(token) });
    } catch (err) {
      console.error("password reset email failed:", err);
      return NextResponse.redirect(new URL("/forgot-password?error=server", getSiteUrl()), {
        status: 303,
      });
    }
  }

  return NextResponse.redirect(new URL("/forgot-password?ok=1", getSiteUrl()), { status: 303 });
}
