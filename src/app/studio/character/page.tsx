import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CharacterMaker } from "./CharacterMaker";

export default async function CharacterIntro({
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
  });
  if (!child) redirect("/studio");

  return (
    <div className="py-4">
      <Link href="/studio" className="text-base font-semibold text-ink-600">
        ← Back
      </Link>
      <header className="mt-4 mb-8 text-center">
        <p className="text-5xl" aria-hidden>
          🎨
        </p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Make a story friend!</h1>
        <p className="mt-2 text-lg text-ink-700">Tap the pictures. {child.name} can use them in every book.</p>
      </header>
      <CharacterMaker childId={child.id} childName={child.name} />
    </div>
  );
}
