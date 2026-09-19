// Inklings feature blocks — used on home + how-it-works + future /features/[slug] pages.
export interface FeatureBlock {
  slug: string;
  title: string;
  summary: string;
  icon?: string;
}

export const FEATURES: FeatureBlock[] = [
  {
    slug: "voice-first-studio",
    title: "Voice-first kid Studio",
    summary:
      "Your child taps giant picture buttons or answers Sparky out loud. No typing needed — designed for ages 4-8.",
  },
  {
    slug: "character-bible",
    title: "Persistent character family",
    summary:
      "Characters your child invents are saved and can star in every story — same name, animal, colors, and personality traits.",
  },
  {
    slug: "character-maker",
    title: "Build a character in a few taps",
    summary:
      "Your child picks a name, an animal, a favorite color, and one or two personality traits. A new story friend is ready in under a minute.",
  },
  {
    slug: "parent-approval",
    title: "Parent approval gate",
    summary:
      "Nothing publishes, exports, or prints without your explicit approval. Every page reviewed side-by-side.",
  },
  {
    slug: "printed-keepsake",
    title: "Real printed keepsake books",
    summary:
      "Order softcover 8.5\" × 8.5\" keepsake books. Ships in 7–10 days.",
  },
  {
    slug: "safety-first",
    title: "Safety is the first feature",
    summary:
      "No photo or drawing uploads, no open chat box, a word filter on every page Sparky writes, and a parent approval gate.",
  },
];
