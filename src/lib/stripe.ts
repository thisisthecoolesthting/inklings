import Stripe from "stripe";

/** Must match stripe@17.x LatestApiVersion — see node_modules/stripe/types/lib.d.ts */
export const STRIPE_API_VERSION = "2025-02-24.acacia" as const;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: STRIPE_API_VERSION });
}

export function premiumPriceId(): string | null {
  return process.env.STRIPE_PRICE_PREMIUM_MONTHLY ?? null;
}

export function printPriceId(): string | null {
  return process.env.STRIPE_PRICE_PRINT_BOOK ?? null;
}

export function giftPriceId(plan: string): string | null {
  const map: Record<string, string | undefined> = {
    gift_1m: process.env.STRIPE_PRICE_GIFT_1M,
    gift_6m: process.env.STRIPE_PRICE_GIFT_6M,
    gift_12m: process.env.STRIPE_PRICE_GIFT_12M,
  };
  return map[plan] ?? null;
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "https://inklings.shop").replace(/\/$/, "");
}
