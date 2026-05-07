import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { STORY_FLOW } from "@/content/sparky-prompts";
import { askSparky } from "@/lib/sparky";
import { sanitizeChildInput } from "@/lib/safety";

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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { beatId, choiceId, ctx } = parsed.data;

  const beat = STORY_FLOW.find((b) => b.id === beatId);
  if (!beat) return NextResponse.json({ error: "unknown_beat" }, { status: 400 });

  // Defense: sanitize anything stored in ctx (names came from parent-approved DB rows;
  // this is belt-and-suspenders).
  const safeName = sanitizeChildInput(ctx.childName).safe;
  const res = await askSparky({ ...ctx, childName: safeName, characters: ctx.characters as any }, beat, choiceId);
  return NextResponse.json(res);
}
