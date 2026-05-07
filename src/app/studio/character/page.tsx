import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Sparkles, Camera, Pencil } from "lucide-react";
import { createCharacter } from "./actions";

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

  // Verify ownership
  const child = await prisma.childProfile.findFirst({
    where: { id: childId, parentId: session.userId },
  });
  if (!child) redirect("/studio");

  return (
    <div className="container-ink py-10">
      <Link href="/studio" className="text-sm text-ink-500 underline">&larr; Back</Link>
      <header className="mt-4 mb-10 text-center">
        <Sparkles className="mx-auto h-12 w-12 text-coral" aria-hidden />
        <h1 className="mt-4 text-3xl font-bold text-ink">Let&apos;s make a new character!</h1>
        <p className="mt-2 text-lg text-ink-700">Tell Sparky about them. {child.name}&apos;s grown-up will look it over before your character joins the story.</p>
      </header>

      <form action={createCharacter} className="mx-auto max-w-xl card-base">
        <input type="hidden" name="childId" value={child.id} />

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-ink">What&apos;s their name?</label>
          <input
            id="name" name="name" type="text" required maxLength={30}
            className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-4 py-3 text-lg focus:border-coral focus:outline-none"
            placeholder="Biscuit"
          />
        </div>

        <div className="mt-6">
          <label htmlFor="species" className="block text-sm font-semibold text-ink">What kind of creature are they?</label>
          <input
            id="species" name="species" type="text" maxLength={40}
            className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-4 py-3 text-lg focus:border-coral focus:outline-none"
            placeholder="golden retriever puppy"
          />
        </div>

        <div className="mt-6">
          <label htmlFor="role" className="block text-sm font-semibold text-ink">What do they do in stories?</label>
          <input
            id="role" name="role" type="text" maxLength={40}
            className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-4 py-3 text-lg focus:border-coral focus:outline-none"
            placeholder="best friend, hero, helper..."
          />
        </div>

        <div className="mt-6">
          <label htmlFor="personality" className="block text-sm font-semibold text-ink">What are they like? (separate by commas)</label>
          <input
            id="personality" name="personality" type="text" maxLength={120}
            className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-4 py-3 text-lg focus:border-coral focus:outline-none"
            placeholder="loyal, silly, brave when it matters"
          />
        </div>

        <button type="submit" className="btn-primary btn-large btn-full mt-8">
          Save and show grown-up
        </button>

        <p className="mt-4 text-center text-xs text-ink-500">
          Your new character will wait in your sandbox until {child.name}&apos;s grown-up says they&apos;re ready.
        </p>
      </form>

      <div className="mx-auto mt-10 max-w-xl text-center text-xs text-ink-500">
        <p>Want to upload a drawing or photo of your character? That feature is coming soon — for now, tell us about them in words.</p>
      </div>
    </div>
  );
}
