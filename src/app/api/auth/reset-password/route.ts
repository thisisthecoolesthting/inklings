import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyResetToken } from "@/lib/auth/reset-token";
import { hashToken } from "@/lib/auth/token-hash";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { completeLogin } from "@/lib/auth/complete-login";
import { getSiteUrl } from "@/lib/site-url";
import { rateLimit } from "@/lib/rate-limit";

const Schema = z.object({
  token: z.string().min(1),
  password: z.string().min(1).max(128),
  password_confirm: z.string().min(1).max(128),
});

/** POST /api/auth/reset-password — set a new password from reset link. */
export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { key: "reset", limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.redirect(new URL("/reset-password?error=rate_limited", getSiteUrl()), {
      status: 303,
      headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

  const form = await req.formData();
  const parsed = Schema.safeParse({
    token: form.get("token"),
    password: form.get("password"),
    password_confirm: form.get("password_confirm"),
  });
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/reset-password?error=invalid", getSiteUrl()), {
      status: 303,
    });
  }

  const pwErr = validatePassword(parsed.data.password);
  if (pwErr) {
    const url = new URL("/reset-password", getSiteUrl());
    url.searchParams.set("token", parsed.data.token);
    url.searchParams.set("error", "weak_password");
    return NextResponse.redirect(url, { status: 303 });
  }
  if (parsed.data.password !== parsed.data.password_confirm) {
    const url = new URL("/reset-password", getSiteUrl());
    url.searchParams.set("token", parsed.data.token);
    url.searchParams.set("error", "mismatch");
    return NextResponse.redirect(url, { status: 303 });
  }

  const verified = await verifyResetToken(parsed.data.token);
  if (!verified) {
    return NextResponse.redirect(new URL("/reset-password?error=expired", getSiteUrl()), {
      status: 303,
    });
  }

  const tokenHash = hashToken(parsed.data.token);
  const link = await prisma.magicLink.findUnique({ where: { tokenHash } });
  if (
    !link ||
    link.consumed ||
    link.userId !== verified.userId ||
    link.expiresAt.getTime() < Date.now()
  ) {
    return NextResponse.redirect(new URL("/reset-password?error=expired", getSiteUrl()), {
      status: 303,
    });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.update({
    where: { id: verified.userId },
    data: { passwordHash },
  });

  await prisma.magicLink
    .update({ where: { tokenHash }, data: { consumed: true } })
    .catch(() => {});

  return completeLogin(user, "/portal");
}
