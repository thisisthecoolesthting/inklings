/**
 * Sparky — bounded storyteller. Not an open chatbot.
 *
 * The flow:
 *  1. Studio calls /api/sparky/beat with { beatId, choiceId, ctx }
 *  2. That route calls askSparky() here
 *  3. askSparky() builds a tightly constrained Anthropic prompt — system
 *     message LOCKS Sparky to (a) 1-2 short sentences in storybook voice,
 *     (b) reference at least one character by name, (c) NEVER ask a
 *     question or break character, (d) never use forbidden words
 *  4. Response runs through lib/safety.ts moderateAiText; on fail, fallback
 *     to deterministic stub
 *  5. If ANTHROPIC_API_KEY is missing OR the call errors, fallback stub
 *     keeps the Studio working — never error to the kid
 */
import type { SparkyBeat } from "@/content/sparky-prompts";
import { moderateAiText } from "@/lib/safety";
import { buildScenePrompt } from "./image-gen";

export interface SparkyContext {
  childName: string;
  childAge: number;
  characters: Array<{ name: string; species?: string | null; personalityTraits?: string[] | null; imageSeed?: string | null }>;
  worldName?: string | null;
  storyState: Array<{ beatId: string; choiceId: string }>;
}

export interface SparkyResponse {
  paragraph: string;       // The story sentence(s) to render on the page
  imagePrompt: string;     // For Flux: locked style + Character Bible traits
  nextBeat: SparkyBeat | null;
  audioCue?: string;       // Optional one-liner Sparky says aloud
  source: "live" | "stub" | "moderation_fallback"; // for logging + analytics
}

/** Sparky's system prompt — the entire bounding mechanism. */
function buildSystemPrompt(ctx: SparkyContext): string {
  const ageNote =
    ctx.childAge <= 5
      ? "preschool reading level (very simple words, no complex grammar)"
      : "early reader level (one or two clauses per sentence, friendly rhythm)";
  const characterRoster =
    ctx.characters.length > 0
      ? ctx.characters
          .map(
            (c) =>
              `- ${c.name}${c.species ? ` (a ${c.species})` : ""}${
                c.personalityTraits && c.personalityTraits.length > 0
                  ? `, ${c.personalityTraits.slice(0, 3).join(", ")}`
                  : ""
              }`,
          )
          .join("\n")
      : `- ${ctx.childName} (the child themselves)`;
  return [
    "You are Sparky, a gentle storyteller writing a single beat of a children's storybook.",
    "",
    "HARD RULES (cannot be broken):",
    "- Output exactly 1 to 2 short sentences. No questions. No bullet points. No asides.",
    `- Use ${ageNote}.`,
    "- Reference at least one character by name from the roster below.",
    "- Stay in storybook narrative voice. Do not address the reader. Do not include 'The end' unless the beat is celebration.",
    "- Never use: weapon, gun, knife, blood, kill, murder, scary, nightmare, monster, scared (use 'a little nervous' if needed).",
    "- Never include real-world brands, locations, or copyrighted names.",
    "- No emoji.",
    "",
    "Character roster:",
    characterRoster,
    ctx.worldName ? `Setting: ${ctx.worldName}` : "",
    "",
    "Output only the prose. Nothing else.",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildUserMessage(beat: SparkyBeat, choiceId: string, prior: SparkyContext["storyState"]): string {
  const choiceLabel = beat.choices.find((c) => c.id === choiceId)?.label ?? choiceId;
  const priorJson = prior.length > 0 ? `\n\nStory so far:\n${JSON.stringify(prior)}` : "";
  return [
    `Beat: ${beat.id} (${beat.act})`,
    `Sparky asked: "${beat.sparkyLine}"`,
    `Child chose: "${choiceLabel}"`,
    "Write the next 1-2 sentence(s) of the story.",
    priorJson,
  ].join("\n");
}

/** Deterministic fallback — used when no API key, on error, or on moderation fail. */
function stubResponse(ctx: SparkyContext, beat: SparkyBeat, choiceId: string): string {
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
  return stub[beat.id] ?? `${heroName} kept going.`;
}

interface AnthropicMessage {
  content: Array<{ type: string; text?: string }>;
  stop_reason?: string;
}

async function callAnthropic(
  system: string,
  user: string,
): Promise<{ text: string } | { error: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { error: "no_api_key" };
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 200,
        temperature: 0.8,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { error: `anthropic_${res.status}_${detail.slice(0, 80)}` };
    }
    const json = (await res.json()) as AnthropicMessage;
    const text = (json.content ?? [])
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text!)
      .join(" ")
      .trim();
    if (!text) return { error: "empty_response" };
    return { text };
  } catch (err) {
    return { error: `anthropic_exception_${(err as Error).message.slice(0, 60)}` };
  }
}

export async function askSparky(
  ctx: SparkyContext,
  beat: SparkyBeat,
  choiceId: string,
): Promise<SparkyResponse> {
  const last = beat.choices.find((c) => c.id === choiceId);
  const stubText = stubResponse(ctx, beat, choiceId);
  const imagePrompt = buildImagePrompt(ctx, last?.label ?? "");

  const system = buildSystemPrompt(ctx);
  const user = buildUserMessage(beat, choiceId, ctx.storyState);
  const live = await callAnthropic(system, user);

  if ("error" in live) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[sparky] live call failed (${live.error}) — falling back to stub`);
    }
    return {
      paragraph: stubText,
      imagePrompt,
      nextBeat: null,
      audioCue: beat.sparkyLine,
      source: "stub",
    };
  }

  const moderation = moderateAiText(live.text);
  if (!moderation.ok) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[sparky] moderation blocked: ${moderation.reason} — falling back to stub`);
    }
    return {
      paragraph: stubText,
      imagePrompt,
      nextBeat: null,
      audioCue: beat.sparkyLine,
      source: "moderation_fallback",
    };
  }

  return {
    paragraph: live.text,
    imagePrompt,
    nextBeat: null,
    audioCue: beat.sparkyLine,
    source: "live",
  };
}

/** Locked illustration-prompt template per spine §13 / Inklings handoff. */
export function buildImagePrompt(ctx: SparkyContext, scene: string): string {
  const traits = ctx.characters
    .map((c) => `${c.name} (${c.species ?? "character"}, ${(c.personalityTraits ?? []).join(", ")})`)
    .join("; ");
  return buildScenePrompt({
    childName: ctx.childName,
    characters: traits,
    scene,
    worldName: ctx.worldName,
  });
}
