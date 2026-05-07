import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { STORY_FLOW } from "@/content/sparky-prompts";
import { StoryActProgress } from "@/components/studio/StoryActProgress";
import { StudioStoryClient } from "./client";

export default async function StoryPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/studio");
  const params = await searchParams;
  const childId = params.child;
  if (!childId) redirect("/studio");

  const child = await prisma.childProfile.findFirst({
    where: { id: childId, parentId: session.userId },
    include: { characters: { where: { sandboxMode: false }, take: 6 } },
  });
  if (!child) redirect("/studio");

  return (
    <div className="container-ink py-10">
      <Link href="/studio" className="text-sm text-ink-500 underline">&larr; Back to who&apos;s making</Link>
      <header className="mt-4 mb-8 text-center">
        <h1 className="text-2xl font-bold text-ink">{child.name}&apos;s story</h1>
      </header>
      <StoryActProgress currentAct="beginning" />
      <StudioStoryClient
        childId={child.id}
        ctx={{
          childName: child.name,
          childAge: child.age,
          characters: child.characters.map((c) => ({
            name: c.name,
            species: c.species,
            personalityTraits: (c.personalityTraits as string[]) ?? [],
            imageSeed: c.imageSeed,
          })),
          worldName: null,
          storyState: [],
        }}
        flow={STORY_FLOW}
      />
    </div>
  );
}
