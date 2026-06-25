import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession, signSessionToken, setSessionCookie } from "@/lib/session";
import { redeemGiftCode } from "@/lib/gift-codes";
import { getSiteUrl } from "@/lib/site-url";

const Schema = z.object({ code: z.string().min(8).max(32) });

export async function POST(req: NextRequest) {
  const site = getSiteUrl();

  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login?next=/gift/redeem", site), { status: 303 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    const form = await req.formData();
    body = { code: form.get("code") };
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/gift/redeem?error=invalid_code", site), { status: 303 });
  }

  const result = await redeemGiftCode(parsed.data.code, session.userId, session.email);
  if (!result.ok) {
    return NextResponse.redirect(new URL(`/gift/redeem?error=${result.error}`, site), { status: 303 });
  }

  const token = await signSessionToken({
    userId: session.userId,
    email: session.email,
    tier: "premium",
  });
  await setSessionCookie(token);

  const until = result.premiumUntil.toISOString().slice(0, 10);
  const successUrl = `/gift/redeem?success=1&until=${until}&months=${result.months}`;

  if (req.headers.get("accept")?.includes("application/json")) {
    return NextResponse.json({
      ok: true,
      premiumUntil: result.premiumUntil,
      months: result.months,
      redirect: successUrl,
    });
  }

  return NextResponse.redirect(new URL(successUrl, site), { status: 303 });
}
