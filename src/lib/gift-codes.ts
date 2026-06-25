import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

const PLAN_MONTHS: Record<string, number> = {
  gift_1m: 1,
  gift_6m: 6,
  gift_12m: 12,
};

export function giftPlanMonths(plan: string): number {
  return PLAN_MONTHS[plan] ?? 1;
}

export function generateGiftCode(): string {
  const raw = randomBytes(5).toString("hex").toUpperCase();
  return `INK-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

export async function createGiftCode(opts: {
  plan: string;
  purchaserEmail: string;
  recipientEmail?: string | null;
  stripeSessionId?: string | null;
}) {
  const months = giftPlanMonths(opts.plan);
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 2);

  let code = generateGiftCode();
  for (let i = 0; i < 5; i++) {
    try {
      return await prisma.giftCode.create({
        data: {
          code,
          plan: opts.plan,
          months,
          purchaserEmail: opts.purchaserEmail,
          recipientEmail: opts.recipientEmail ?? null,
          stripeSessionId: opts.stripeSessionId ?? null,
          expiresAt,
        },
      });
    } catch {
      code = generateGiftCode();
    }
  }
  throw new Error("could_not_mint_gift_code");
}

export async function redeemGiftCode(code: string, userId: string, userEmail: string) {
  const normalized = code.trim().toUpperCase();
  const gift = await prisma.giftCode.findUnique({ where: { code: normalized } });
  if (!gift) return { ok: false as const, error: "invalid_code" };
  if (gift.redeemedAt) return { ok: false as const, error: "already_redeemed" };
  if (gift.expiresAt < new Date()) return { ok: false as const, error: "expired" };

  const now = new Date();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false as const, error: "user_not_found" };

  const base =
    user.premiumUntil && user.premiumUntil > now ? user.premiumUntil : now;
  const premiumUntil = new Date(base);
  premiumUntil.setMonth(premiumUntil.getMonth() + gift.months);

  await prisma.$transaction([
    prisma.giftCode.update({
      where: { id: gift.id },
      data: { redeemedAt: now, redeemedByUserId: userId },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: "premium",
        subscriptionStatus: "gift",
        premiumUntil,
      },
    }),
  ]);

  return { ok: true as const, months: gift.months, premiumUntil, email: userEmail };
}
