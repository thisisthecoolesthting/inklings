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
      "Your child speaks to Sparky and taps giant buttons. No reading, no typing — designed for ages 5 to 8.",
  },
  {
    slug: "character-bible",
    title: "Persistent character family",
    summary:
      "Characters your child invents stay alive across every story — same look, same personality, same voice.",
  },
  {
    slug: "draw-or-photo",
    title: "Draw or snap to character",
    summary:
      "Take a photo of a stuffed animal or a crayon drawing. Inklings turns it into a starring story character.",
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
      "Order hardcover 8.5\" × 8.5\" keepsake books. Ships in 7–10 days.",
  },
  {
    slug: "safety-first",
    title: "Safety is the first feature",
    summary:
      "On-device face detection, sandbox mode for new characters, content moderation on every AI output.",
  },
];
