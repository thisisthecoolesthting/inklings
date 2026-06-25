import { redirect } from "next/navigation";
import { getSession, signSessionToken, setSessionCookie } from "@/lib/session";
import { redeemGiftCode } from "@/lib/gift-codes";

export async function redeemGiftAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/gift/redeem");
  }

  const raw = String(formData.get("code") ?? "").trim();
  if (raw.length < 8) {
    redirect("/gift/redeem?error=invalid_code");
  }

  const result = await redeemGiftCode(raw, session.userId, session.email);
  if (!result.ok) {
    redirect(`/gift/redeem?error=${result.error}`);
  }

  const token = await signSessionToken({
    userId: session.userId,
    email: session.email,
    tier: "premium",
  });
  await setSessionCookie(token);

  const until = result.premiumUntil.toISOString().slice(0, 10);
  redirect(`/gift/redeem?success=1&until=${until}&months=${result.months}`);
}
