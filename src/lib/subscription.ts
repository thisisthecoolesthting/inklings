import type { User } from "@prisma/client";

/** Premium via Stripe subscription OR unredeemed gift / gifted premiumUntil. */
export function isPremium(user: Pick<User, "subscriptionTier" | "subscriptionStatus" | "premiumUntil">): boolean {
  if (user.subscriptionTier === "premium") {
    if (user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing") return true;
  }
  if (user.premiumUntil && user.premiumUntil > new Date()) return true;
  return false;
}

export function premiumDaysLeft(user: Pick<User, "premiumUntil">): number | null {
  if (!user.premiumUntil) return null;
  const ms = user.premiumUntil.getTime() - Date.now();
  if (ms <= 0) return null;
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}
