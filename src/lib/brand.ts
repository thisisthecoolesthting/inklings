/**
 * Brand strings — change here to rename the product. Reflected across
 * marketing pages, kid Studio, parent portal, and emails.
 */
export const brand = {
  name: "Inklings",
  tagline: "Your child stars in their own storybook.",
  domain: process.env.APP_DOMAIN ?? "inklings.shop",
  emailFrom: `hello@${process.env.APP_DOMAIN ?? "inklings.shop"}`,
  // Short hero headline.
  hero: "Your child stars in their own storybook.",
  heroSub:
    "Inklings turns the characters and worlds your kid imagines into a beautifully illustrated children's book — guided by Sparky, the friendly storyteller. Built for ages 4 to 8, voice-first, parent-approved before anything is printed.",
  // Used in nav & footer.
  shortPitch:
    "An AI-guided storybook studio for kids ages 4 to 8 — voice-first, parent-approved, real printed books.",
  // CTA copy
  primaryCta: "Start a free story",
  secondaryCta: "How it works",
  // Trust strip under hero CTAs (per spine §6)
  trustStrip: "Free to try · Parent-approved before anything publishes · Real printed books",
};

export type BrandStrings = typeof brand;
