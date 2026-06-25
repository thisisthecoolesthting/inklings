/**
 * Brand strings — change here to rename the product.
 */
export const brand = {
  name: "Inklings",
  tagline: "Turn your child's imagination into a real book.",
  domain: process.env.APP_DOMAIN ?? "inklings.shop",
  emailFrom: `hello@${process.env.APP_DOMAIN ?? "inklings.shop"}`,
  hero: "Turn your child's imagination into a real book.",
  heroSub:
    "Kids ages 5–8 invent characters and worlds that come back in every story — then you approve and order a hardcover keepsake. No kid login. No ads.",
  shortPitch:
    "A creative story studio for kids 5–8 — parent-approved, real printed books, characters that return every adventure.",
  primaryCta: "Create your first book free",
  secondaryCta: "See how it works",
  trustStrip: "Free first book · Parent-approved · No ads · Real hardcovers",
};

export type BrandStrings = typeof brand;
