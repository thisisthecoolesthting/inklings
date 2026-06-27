import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { completeLogin } from "@/lib/auth/complete-login";
import { getSiteUrl } from "@/lib/site-url";
import { rateLimit } from "@/lib/rate-limit";

const Schema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
  next: z.string().optional(),
});

/** POST /api/auth/login — email + password sign-in. */
export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { key: "login", limit: 20, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.redirect(new URL("/login?error=rate_limited", getSiteUrl()), {
      status: 303,
      headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

  const form = await req.formData();
  const parsed = Schema.safeParse({
    email: form.get("email"),
    password: form.get("password"),
    next: form.get("next") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/login?error=invalid", getSiteUrl()), { status: 303 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    return NextResponse.redirect(new URL("/login?error=invalid", getSiteUrl()), { status: 303 });
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    return NextResponse.redirect(new URL("/login?error=invalid", getSiteUrl()), { status: 303 });
  }

  return completeLogin(user, parsed.data.next);
}
