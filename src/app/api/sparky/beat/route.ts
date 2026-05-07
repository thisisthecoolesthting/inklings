import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { STORY_FLOW } from "@/content/sparky-prompts";
import { askSparky } from "@/lib/sparky";
import { sanitizeChildInput } from "@/lib/safety";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { generatePreview, seedFromImageSeed } from "@/lib/image-gen";

const Schema = z.object({
  beatId: z.string(),
  choiceId: z.string(),
  ctx: z.object({
    childName: z.string(),
    childAge: z.number().int().min(2).max(14),
    characters: z.array(z.object({
      name: z.string(),
      species: z.string().nullable().optional(),
      personalityTraits: z.array(z.string()).nullable().optional(),
      imageSeed: z.string().nullable().optional(),
    })),
    worldName: z.string().nullable().optional(),
    storyState: z.array(z.object({ beatId: z.string(), choiceId: z.string() })),
  }),
});

const FREE_TIER_STORIES_PER_MONTH = 3;
const FREE_TIER_IMAGES_PER_MONTH = 60;        // ~3 stories * 7 beats * preview each + a few regen
const PREMIUM_IMAGES_PER_MONTH = 1500;        // unlimited-feel cap

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { beatId, choiceId, ctx } = parsed.data;

  const beat = STORY_FLOW.find((b) => b.id === beatId);
  if (!beat) return NextResponse.json({ error: "unknown_beat" }, { status: 400 });

  const safeName = sanitizeChildInput(ctx.childName).safe;

  // Story-quota guard for free tier — counts the first beat as "story_started"
  if (beat.id === "where_are_we") {
    const session = await getSession();
    if (session && session.tier === "free") {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const count = await prisma.usageEvent.count({
        where: { userId: session.userId, kind: "story_started", createdAt: { gte: since } },
      });
      if (count >= FREE_TIER_STORIES_PER_MONTH) {
        return NextResponse.json({
          paragraph: `You've made ${count} stories this month — that's the free plan! Ask a grown-up about Premium for more stories.`,
          imagePrompt: "",
          imageUrl: null,
          nextBeat: null,
          source: "quota_blocked",
        });
      }
      await prisma.usageEvent
        .create({ data: { userId: session.userId, kind: "story_started", meta: { childName: safeName } } })
        .catch(() => {});
    }
  }

  // Sparky prose
  const sparky = await askSparky(
    { ...ctx, childName: safeName, characters: ctx.characters as any },
    beat,
    choiceId,
  );

  // Image preview generation — quota-gated
  let imageUrl: string | null = null;
  let imageGenSource: "live" | "skipped" | "quota_blocked" | "error" = "skipped";

  if (sparky.imagePrompt) {
    const session = await getSession();
    let canGenerate = true;
    if (session) {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const limit = session.tier === "premium" ? PREMIUM_IMAGES_PER_MONTH : FREE_TIER_IMAGES_PER_MONTH;
      const used = await prisma.usageEvent.count({
        where: { userId: session.userId, kind: "image_generated", createdAt: { gte: since } },
      });
      if (used >= limit) { canGenerate = false; imageGenSource = "quota_blocked"; }
    }

    if (canGenerate && process.env.TOGETHER_API_KEY) {
      // Use the first character's image seed for consistency across beats
      const charSeed = ctx.characters[0]?.imageSeed ?? null;
      const seed = seedFromImageSeed(charSeed);
      const result = await generatePreview(sparky.imagePrompt, seed);
      if (result.ok) {
        imageUrl = result.url;
        imageGenSource = "live";
        if (session) {
          await prisma.usageEvent
            .create({ data: { userId: session.userId, kind: "image_generated", meta: { beatId, bytes: result.bytes, seed: result.seed } } })
            .catch(() => {});
        }
      } else {
        imageGenSource = "error";
        // Failure surfaces silently — kid still sees prose
      }
    }
  }

  return NextResponse.json({
    ...sparky,
    imageUrl,
    imageGenSource,
  });
}
