import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { completeLogin } from "@/lib/auth/complete-login";
import { getSiteUrl } from "@/lib/site-url";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const Schema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
  password_confirm: z.string().min(1).max(128),
  tier: z.string().optional(),
  coppa_consent: z.literal("yes"),
});

const CONSENT_TEXT =
  "I am this child's parent or legal guardian, and I consent to Inklings collecting the information my child provides to create their stories.";

/** POST /api/auth/signup — create account with email + password. */
export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { key: "signup", limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.redirect(new URL("/trial?error=rate_limited", getSiteUrl()), {
      status: 303,
      headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

  const form = await req.formData();
  const parsed = Schema.safeParse({
    email: form.get("email"),
    password: form.get("password"),
    password_confirm: form.get("password_confirm"),
    tier: form.get("tier") ?? undefined,
    coppa_consent: form.get("coppa_consent"),
  });

  if (!parsed.success) {
    const err = parsed.error.flatten().fieldErrors.coppa_consent?.length
      ? "consent_required"
      : "invalid";
    return NextResponse.redirect(new URL(`/trial?error=${err}`, getSiteUrl()), { status: 303 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const pwErr = validatePassword(parsed.data.password);
  if (pwErr) {
    return NextResponse.redirect(new URL("/trial?error=weak_password", getSiteUrl()), { status: 303 });
  }
  if (parsed.data.password !== parsed.data.password_confirm) {
    return NextResponse.redirect(new URL("/trial?error=mismatch", getSiteUrl()), { status: 303 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.passwordHash) {
    return NextResponse.redirect(new URL("/trial?error=exists", getSiteUrl()), { status: 303 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = existing
    ? await prisma.user.update({ where: { email }, data: { passwordHash } })
    : await prisma.user.create({ data: { email, passwordHash } });

  await prisma.parentalConsent
    .create({
      data: {
        userId: user.id,
        email,
        consentText: CONSENT_TEXT,
        ipAddress: clientIp(req),
        userAgent: req.headers.get("user-agent") ?? null,
      },
    })
    .catch((err) => console.error("consent record failed:", err));

  return completeLogin(user, "/portal");
}
