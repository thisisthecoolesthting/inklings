import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { CONTACT_TOPICS, sendContactFormEmail } from "@/lib/email";

const TOPIC_VALUES = CONTACT_TOPICS.map((t) => t.value) as [string, ...string[]];

const Schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  topic: z.enum(TOPIC_VALUES),
  message: z.string().trim().min(5).max(5000),
  // Honeypot: real people never see this field, so it must be empty.
  website: z.string().max(0).optional().or(z.literal("")),
});

/**
 * POST /api/contact — JSON in, JSON out. Fails soft: any problem returns a
 * short message the form shows inline, with hello@ as the fallback.
 */
export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { key: "contact", limit: 5, windowMs: 10 * 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot tripped: pretend success so bots learn nothing.
  if (typeof body === "object" && body && typeof (body as { website?: unknown }).website === "string" && (body as { website: string }).website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    await sendContactFormEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      topic: parsed.data.topic as (typeof CONTACT_TOPICS)[number]["value"],
      message: parsed.data.message,
    });
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
