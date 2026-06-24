/**
 * Brand strings — change here to rename the product. Reflected across
 * marketing pages, kid Studio, parent portal, and emails.
 */
export const brand = {
  name: "Inklings",
  tagline: "Build a story universe your child runs.",
  domain: process.env.APP_DOMAIN ?? "inklings.shop",
  emailFrom: `hello@${process.env.APP_DOMAIN ?? "inklings.shop"}`,
  // Short hero headline.
  hero: "Build a story universe — not just one book.",
  heroSub:
    "Inklings lets your child invent characters and worlds that return across every story they write — guided by Sparky, the voice-first storyteller. Built for ages 5-8, kid-driven, and parent-approved before anything publishes.",
  // Used in nav & footer.
  shortPitch:
    "A story universe studio for kids ages 5-8 — voice-first, parent-approved, where characters return in every story.",
  // CTA copy
  primaryCta: "Start a free story",
  secondaryCta: "How it works",
  // Trust strip under hero CTAs (per spine §6)
  trustStrip: "Free to try · Characters return in every story · Parent-approved · Real printed books",
};

export type BrandStrings = typeof brand;
