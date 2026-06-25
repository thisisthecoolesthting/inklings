/**
 * Brand strings — change here to rename the product.
 */
export const brand = {
  name: "Inklings",
  tagline: "Turn your child's imagination into a real book.",
  domain: process.env.APP_DOMAIN ?? "inklings.shop",
  emailFrom: `hello@${process.env.APP_DOMAIN ?? "inklings.shop"}`,
  hero: "Your kid is the author — not just the hero.",
  heroSub:
    "Kids 5–8 invent characters and worlds with Sparky, page by page. You approve every story — then order a hardcover keepsake that ships to your door. No kid login. No ads.",
  shortPitch:
    "A creative story studio for kids 5–8 — parent-approved, real printed books, characters that return every adventure.",
  primaryCta: "Create your first book free",
  secondaryCta: "See how it works",
  trustStrip: "Free first book · Parent-approved · No ads · Real hardcovers",
};

export type BrandStrings = typeof brand;
