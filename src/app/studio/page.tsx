import Link from "next/link";
import { Sparkles, BookOpen, Users } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function StudioHome() {
  const session = await getSession();
  if (!session) return null;
  const children = await prisma.childProfile.findMany({
    where: { parentId: session.userId },
    include: { _count: { select: { characters: true, books: true } } },
  });

  return (
    <div className="container-ink py-12">
      <header className="mb-12 text-center">
        <Sparkles className="mx-auto h-16 w-16 text-coral" aria-hidden />
        <h1 className="mt-4 text-4xl font-bold text-ink">Hi! I&apos;m Sparky.</h1>
        <p className="mt-3 text-xl text-ink-700">Who&apos;s making a story today?</p>
      </header>

      {children.length === 0 ? (
        <div className="card-base mx-auto max-w-md text-center">
          <p className="text-ink-700">No child profile yet — set one up in your portal first.</p>
          <Link href="/portal/children" className="btn-primary mt-6 inline-flex">Add a child</Link>
        </div>
      ) : (
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {children.map((c) => (
            <div key={c.id} className="card-base text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint-100 text-3xl">
                {c.name[0]}
              </div>
              <h2 className="mt-4 text-2xl font-bold text-ink">{c.name}</h2>
              <p className="text-sm text-ink-500">Age {c.age} &middot; {c._count.characters} characters</p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={`/studio/story?child=${c.id}`}
                  className="big-button inline-flex items-center justify-center gap-2 text-base"
                >
                  <BookOpen className="h-5 w-5" aria-hidden /> Start a story
                </Link>
                <Link
                  href={`/studio/character?child=${c.id}`}
                  className="big-button-mint inline-flex items-center justify-center gap-2 text-base"
                >
                  <Users className="h-5 w-5" aria-hidden /> Make a character
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-16 text-center">
        <Link href="/library" className="text-sm text-ink-500 underline">Go to my library</Link>
      </footer>
    </div>
  );
}
