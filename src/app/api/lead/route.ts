import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendSampleStoryEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const Schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  source: z.string().trim().max(60).optional(),
  // Honeypot — real users never fill this.
  website: z.string().max(200).optional(),
});

function wantsJson(req: NextRequest): boolean {
  const ct = req.headers.get("content-type") ?? "";
  return ct.includes("application/json") || (req.headers.get("accept") ?? "").includes("application/json");
}

/** Same-origin redirect target for the no-JS form fallback. */
function backTo(req: NextRequest, flag: "sent" | "error"): NextResponse {
  let path = "/";
  try {
    const ref = req.headers.get("referer");
    if (ref) {
      const u = new URL(ref);
      if (u.host === req.nextUrl.host) path = u.pathname;
    }
  } catch {
    /* ignore */
  }
  return NextResponse.redirect(new URL(`${path}?sample=${flag}#sample-story`, req.nextUrl.origin), { status: 303 });
}

function respond(req: NextRequest, ok: boolean, message: string, status = ok ? 200 : 400, headers?: HeadersInit) {
  if (wantsJson(req)) return NextResponse.json({ ok, message }, { status, headers });
  return backTo(req, ok ? "sent" : "error");
}

/**
 * POST /api/lead — footer "Email me a sample story".
 * Stores the address in `Lead` and emails a link to the sample story.
 * Fails soft: if the Lead table has not been created yet (`prisma db push` pending), we log
 * the error and still report success to the visitor and send the email.
 */
export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { key: "lead", limit: 5, windowMs: 60 * 60_000 });
  if (!rl.ok) {
    return respond(req, false, "Too many requests. Please try again in a little while.", 429, {
      "Retry-After": String(rl.retryAfter),
    });
  }

  let raw: unknown;
  const ct = req.headers.get("content-type") ?? "";
  try {
    if (ct.includes("application/json")) {
      raw = await req.json();
    } else {
      const form = await req.formData();
      raw = Object.fromEntries(form.entries());
    }
  } catch {
    return respond(req, false, "Please enter a valid email address.");
  }

  const parsed = Schema.safeParse(raw);
  if (!parsed.success) return respond(req, false, "Please enter a valid email address.");
  const { email, source, website } = parsed.data;

  // Bots: pretend success, do nothing.
  if (website) return respond(req, true, "Sent! Check your inbox in a minute.");

  // Per-address cap so the form can't be used to mail-bomb someone.
  const perAddr = rateLimit(req, { key: "lead-addr", limit: 2, windowMs: 24 * 60 * 60_000, id: email });
  if (!perAddr.ok) return respond(req, true, "Sent! Check your inbox in a minute.");

  try {
    await prisma.lead.create({ data: { email, source: source || "footer-sample" } });
  } catch (err) {
    // Most likely the Lead table does not exist yet (needs a one-time `prisma db push`).
    console.error("[lead] could not store lead (is the Lead table pushed?):", err instanceof Error ? err.message : err);
    console.log(`[lead:fallback] ${new Date().toISOString()} ${email} ${source || "footer-sample"}`);
  }

  try {
    await sendSampleStoryEmail({ to: email });
  } catch (err) {
    console.error("[lead] sample email failed:", err instanceof Error ? err.message : err);
  }

  return respond(req, true, "Sent! Check your inbox in a minute.");
}
