import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { STORY_FLOW } from "@/content/sparky-prompts";
import { askSparky } from "@/lib/sparky";
import { sanitizeChildInput } from "@/lib/safety";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

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
    })),
    worldName: z.string().nullable().optional(),
    storyState: z.array(z.object({ beatId: z.string(), choiceId: z.string() })),
  }),
});

const FREE_TIER_STORIES_PER_MONTH = 3;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { beatId, choiceId, ctx } = parsed.data;

  const beat = STORY_FLOW.find((b) => b.id === beatId);
  if (!beat) return NextResponse.json({ error: "unknown_beat" }, { status: 400 });

  // Sanitize names (defense in depth — names came from parent-approved DB rows already)
  const safeName = sanitizeChildInput(ctx.childName).safe;

  // Quota guard for free tier — only counts beat 0 (where_are_we) as a "story started"
  if (beat.id === "where_are_we") {
    const session = await getSession();
    if (session && session.tier === "free") {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const count = await prisma.usageEvent.count({
        where: { userId: session.userId, kind: "story_started", createdAt: { gte: since } },
      });
      if (count >= FREE_TIER_STORIES_PER_MONTH) {
        return NextResponse.json(
          {
            paragraph: `You've made ${count} stories this month — that's the free plan! Ask a grown-up about Premium for more stories.`,
            imagePrompt: "",
            nextBeat: null,
            source: "quota_blocked",
          },
          { status: 200 },
        );
      }
      // Log story_started — best-effort, don't block on failure
      await prisma.usageEvent
        .create({ data: { userId: session.userId, kind: "story_started", meta: { childName: safeName } } })
        .catch(() => {});
    }
  }

  const res = await askSparky(
    { ...ctx, childName: safeName, characters: ctx.characters as any },
    beat,
    choiceId,
  );

  // Log image_generated quota event (used for dispatch 004 image pipeline)
  if (res.imagePrompt) {
    const session = await getSession();
    if (session) {
      await prisma.usageEvent
        .create({ data: { userId: session.userId, kind: "image_generated", meta: { beatId } } })
        .catch(() => {});
    }
  }

  return NextResponse.json(res);
}
