/**
 * Brand strings — change here to rename the product.
 */
export const brand = {
  name: "Inklings",
  tagline: "Turn your child's imagination into a real book.",
  domain: process.env.APP_DOMAIN ?? "inklings.shop",
  emailFrom: `hello@${process.env.APP_DOMAIN ?? "inklings.shop"}`,
  hero: "Your kid is the author — not just the hero.",
  ageAudience: "4 and up",
  heroSub:
    "Kids 4 and up invent characters and worlds with Sparky, page by page. You approve every story — then order a softcover keepsake that ships to your door. No kid login. No ads.",
  shortPitch:
    "A creative story studio for kids 4 and up — parent-approved, real printed softcover books, characters that return every adventure.",
  primaryCta: "Start a free story",
  secondaryCta: "Gift for grandparents",
  trustStrip: "Free first book · Parent-approved · No ads · Real softcovers",
};

export type BrandStrings = typeof brand;
