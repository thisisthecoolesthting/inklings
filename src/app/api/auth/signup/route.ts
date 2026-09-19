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
  const rawEmail = String(form.get("email") ?? "");
  const consentChecked = form.get("coppa_consent") === "yes";

  /** Redirect back to /trial preserving the entered email + consent checkbox state. */
  function redirectWithState(error: string) {
    const url = new URL("/trial", getSiteUrl());
    url.searchParams.set("error", error);
    if (rawEmail) url.searchParams.set("email", rawEmail);
    url.searchParams.set("consent", consentChecked ? "1" : "0");
    return NextResponse.redirect(url, { status: 303 });
  }

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
    return redirectWithState(err);
  }

  const email = parsed.data.email.trim().toLowerCase();
  const pwErr = validatePassword(parsed.data.password);
  if (pwErr) {
    return redirectWithState("weak_password");
  }
  if (parsed.data.password !== parsed.data.password_confirm) {
    return redirectWithState("mismatch");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.passwordHash) {
    return redirectWithState("exists");
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
