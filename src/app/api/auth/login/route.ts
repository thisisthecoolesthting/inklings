import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signMagicLinkToken, buildMagicLinkUrl } from "@/lib/auth/magic-link";
import { hashToken } from "@/lib/auth/token-hash";
import { sendMagicLinkEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const Schema = z.object({
  email: z.string().email().max(254),
  tier: z.string().optional(),
  coppa_consent: z.string().optional(),
});

const CONSENT_TEXT =
  "I am this child's parent or legal guardian, and I consent to Inklings collecting the information my child provides to create their stories.";

/** POST /api/auth/login — accepts an email, sends a magic link. */
export async function POST(req: NextRequest) {
  // Rate limit: 10 magic-link requests per IP per minute.
  const rl = rateLimit(req, { key: "login", limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.redirect(new URL("/login?error=rate_limited", getSiteUrl()), {
      status: 303,
      headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

  const form = await req.formData();
  const parsed = Schema.safeParse({
    email: form.get("email"),
    tier: form.get("tier"),
    coppa_consent: form.get("coppa_consent"),
  });
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/login?error=invalid", getSiteUrl()), { status: 303 });
  }
  const email = parsed.data.email.trim().toLowerCase();

  // COPPA: the trial form requires a parental-consent checkbox (coppa_consent=yes).
  // Returning users on /login do not send it; only enforce + record consent when the
  // field is present, and reject a trial submit that somehow lacks it.
  const consentFieldPresent = form.get("coppa_consent") !== null;
  const hasConsent = parsed.data.coppa_consent === "yes";
  if (consentFieldPresent && !hasConsent) {
    return NextResponse.redirect(new URL("/trial?error=consent_required", getSiteUrl()), { status: 303 });
  }

  // Upsert the user — if they don't exist, this is also signup.
  const user = await prisma.user.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  // Record parental consent (COPPA audit trail) when given.
  if (hasConsent) {
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
  }

  const token = await signMagicLinkToken(user.id, user.email);
  const url = buildMagicLinkUrl(token, "/portal");

  // Persist a SHA-256 hash of the token for one-time consumption (never the raw token).
  await prisma.magicLink.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
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
