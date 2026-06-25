import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { redeemGiftCode } from "@/lib/gift-codes";

const Schema = z.object({ code: z.string().min(8).max(32) });

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "login_required" }, { status: 401 });
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
    return NextResponse.json({ error: "invalid_code" }, { status: 400 });
  }

  const result = await redeemGiftCode(parsed.data.code, session.userId, session.email);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (req.headers.get("accept")?.includes("application/json")) {
    return NextResponse.json({ ok: true, premiumUntil: result.premiumUntil });
  }

  return NextResponse.redirect(new URL("/portal?gift_redeemed=1", req.url), { status: 303 });
}
