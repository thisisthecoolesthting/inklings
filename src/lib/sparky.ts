/**
 * Sparky — bounded storyteller. Not an open chatbot.
 *
 * The flow:
 *  1. Studio calls /api/sparky/beat with { beatId, choiceId, ctx }
 *  2. That route calls askSparky() here
 *  3. askSparky() builds a tightly constrained Anthropic prompt — system
 *     message LOCKS Sparky to picture-book prose, series memory, and
 *     the character look bible
 *  4. Response runs through lib/safety.ts moderateAiText; on fail, fallback
 *     to deterministic stub
 *  5. If ANTHROPIC_API_KEY is missing OR the call errors, fallback stub
 *     keeps the Studio working — never error to the kid
 */
import type { SparkyBeat } from "@/content/sparky-prompts";
import { moderateAiText } from "@/lib/safety";
import { buildScenePrompt } from "./image-gen";
import {
  characterLookLine,
  rosterLines,
  stubStoryPage,
  type CharacterLook,
  type SeriesChoice,
} from "./series-bible";

export interface SparkyContext {
  childName: string;
  childAge: number;
  characters: CharacterLook[];
  worldName?: string | null;
  seriesTitle?: string | null;
  bookNumber?: number;
  lastBookRecap?: string | null;
  pagesSoFar?: string[];
  storyState: Array<SeriesChoice>;
}

export interface SparkyResponse {
  paragraph: string;
  imagePrompt: string;
  nextBeat: SparkyBeat | null;
  audioCue?: string;
  source: "live" | "stub" | "moderation_fallback";
}

function ageNote(age: number): string {
  if (age <= 5) return "preschool reading level (very simple words, short sentences)";
  if (age <= 7) return "early reader level (short sentences, friendly rhythm, a few new words is ok)";
  return "confident early-reader level (clear picture-book prose, still simple)";
}

function buildSystemPrompt(ctx: SparkyContext): string {
  const bookN = ctx.bookNumber && ctx.bookNumber > 1 ? `Book ${ctx.bookNumber} in the series` : "the first book in a new series";
  return [
    "You are Sparky, a gentle storyteller writing ONE page of a children's picture book.",
    "",
    "HARD RULES (cannot be broken):",
    "- Output exactly 2 to 3 short sentences. No questions. No bullet points. No asides.",
    `- Use ${ageNote(ctx.childAge)}.`,
    "- Name at least one character from the roster. Keep every named character looking like the bible (colors, outfit, species).",
    "- Stay in storybook narrative voice. Do not address the reader. Do not include 'The end' unless the beat is celebration.",
    "- Continue the SAME story. Do not restart. Do not invent a new hero.",
    "- Never use: weapon, gun, knife, blood, kill, murder, scary, nightmare, monster, scared (use 'a little nervous' if needed).",
    "- Never include real-world brands, locations, or copyrighted names.",
    "- No emoji.",
    "",
    `This is ${bookN}${ctx.seriesTitle ? ` called "${ctx.seriesTitle}"` : ""}.`,
    ctx.worldName ? `Home world (keep returning here): ${ctx.worldName}` : "",
    ctx.lastBookRecap ? `Series memory: ${ctx.lastBookRecap}` : "",
    "",
    "Character bible (looks MUST match every page):",
    rosterLines(ctx.characters),
    "",
    "Output only the prose. Nothing else.",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildUserMessage(beat: SparkyBeat, choiceId: string, ctx: SparkyContext): string {
  const choiceLabel = beat.choices.find((c) => c.id === choiceId)?.label ?? choiceId;
  const pages = (ctx.pagesSoFar ?? []).filter(Boolean);
  const priorChoices = ctx.storyState
    .map((s) => `${s.beatId}: ${s.label || s.choiceId}`)
    .join(" → ");
  const soFar = pages.length
    ? `\n\nStory so far (do not repeat; continue):\n${pages.map((p, i) => `Page ${i + 1}: ${p}`).join("\n")}`
    : "";
  return [
    `Beat: ${beat.id} (${beat.act})`,
    `Sparky asked: "${beat.sparkyLine}"`,
    `Child chose: "${choiceLabel}"`,
    priorChoices ? `Choices so far: ${priorChoices}` : "",
    "Write the next picture-book page (2-3 short sentences).",
    soFar,
  ]
    .filter(Boolean)
    .join("\n");
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
        max_tokens: 280,
        temperature: 0.75,
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
  const stubText = stubStoryPage(ctx, beat, choiceId);

  const system = buildSystemPrompt(ctx);
  const user = buildUserMessage(beat, choiceId, ctx);
  const live = await callAnthropic(system, user);

  let paragraph = stubText;
  let source: SparkyResponse["source"] = "stub";

  if ("error" in live) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[sparky] live call failed (${live.error}) — falling back to stub`);
    }
  } else {
    const moderation = moderateAiText(live.text);
    if (!moderation.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[sparky] moderation blocked: ${moderation.reason} — falling back to stub`);
      }
      source = "moderation_fallback";
    } else {
      paragraph = live.text;
      source = "live";
    }
  }

  const imagePrompt = buildImagePrompt(ctx, last?.label ?? "", paragraph);

  return {
    paragraph,
    imagePrompt,
    nextBeat: null,
    audioCue: beat.sparkyLine,
    source,
  };
}

/** Locked illustration-prompt template — character looks + this page's action. */
export function buildImagePrompt(ctx: SparkyContext, scene: string, paragraph?: string): string {
  const looks = ctx.characters.map((c) => characterLookLine(c)).join("; ");
  const action = (paragraph && paragraph.slice(0, 280)) || scene;
  return buildScenePrompt({
    childName: ctx.childName,
    characters: looks || ctx.childName,
    scene: action,
    worldName: ctx.worldName,
  });
}
