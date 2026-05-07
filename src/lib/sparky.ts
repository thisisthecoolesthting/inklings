/**
 * Sparky — bounded storyteller. Not an open chatbot.
 *
 * Production calls Claude API (Sonnet) with a constrained prompt that takes
 * the locked branching choices + Character Bible + story state and returns
 * a beat of story text or a follow-up question. Today: stubbed locally so
 * the Studio renders end-to-end without an API key. Wire up by setting
 * ANTHROPIC_API_KEY and uncommenting the live call.
 */
import type { SparkyBeat } from "@/content/sparky-prompts";

export interface SparkyContext {
  childName: string;
  childAge: number;
  characters: Array<{ name: string; species?: string | null; personalityTraits?: string[] | null }>;
  worldName?: string | null;
  storyState: Array<{ beatId: string; choiceId: string }>;
}

export interface SparkyResponse {
  paragraph: string;       // The story sentence(s) to render on the page
  imagePrompt: string;     // For Flux: locked style + Character Bible traits
  nextBeat: SparkyBeat | null;
  audioCue?: string;       // Optional one-liner Sparky says aloud
}

/** Stub: deterministic response based on the most recent choice. */
export async function askSparky(
  ctx: SparkyContext,
  beat: SparkyBeat,
  choiceId: string,
): Promise<SparkyResponse> {
  const last = beat.choices.find((c) => c.id === choiceId);
  const heroName = ctx.characters[0]?.name ?? ctx.childName;
  const friendName = ctx.characters[1]?.name;

  const stub: Record<string, string> = {
    where_are_we: `${heroName} woke up in ${last?.label}. The light was soft and gold.`,
    mood: `It felt like ${last?.label?.toLowerCase()} — the kind of day where anything could happen.`,
    problem: `Then something changed. ${last?.label}.`,
    adventure_where: `${heroName}${friendName ? ` and ${friendName}` : ""} headed ${last?.label?.toLowerCase()}.`,
    obstacle: `Suddenly — ${last?.label?.toLowerCase()}!`,
    solve: `${heroName} chose ${last?.label?.toLowerCase()}. It was exactly what was needed.`,
    celebrate: `That night they had ${last?.label?.toLowerCase()}, and ${heroName} fell asleep smiling.`,
  };

  // Live call (commented):
  // const apiKey = process.env.ANTHROPIC_API_KEY;
  // if (apiKey) {
  //   const res = await fetch("https://api.anthropic.com/v1/messages", { ... });
  //   ...
  // }

  return {
    paragraph: stub[beat.id] ?? `${heroName} kept going.`,
    imagePrompt: buildImagePrompt(ctx, last?.label ?? ""),
    nextBeat: null, // The Studio decides next beat from STORY_FLOW
    audioCue: beat.sparkyLine,
  };
}

/** Locked illustration-prompt template per spine §13 / Inklings handoff. */
export function buildImagePrompt(ctx: SparkyContext, scene: string): string {
  const traits = ctx.characters
    .map((c) => `${c.name} (${c.species ?? "character"}, ${(c.personalityTraits ?? []).join(", ")})`)
    .join("; ");
  const stylePrefix = "children's book illustration, flat color, warm pastel storybook palette, friendly, 2D, age-appropriate";
  const styleSuffix = "no text, no letters, clean background, safe for children";
  return `${stylePrefix}, ${traits}, scene: ${scene}, ${styleSuffix}`;
}
