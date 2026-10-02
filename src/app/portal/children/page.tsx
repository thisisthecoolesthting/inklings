import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { addChild } from "./actions";
import { DeleteChildButton } from "./DeleteChildButton";

export default async function ChildrenPage() {
  const session = await getSession();
  if (!session) return null;
  const children = await prisma.childProfile.findMany({
    where: { parentId: session.userId },
    include: { _count: { select: { characters: true, books: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <header className="mb-6 lg:mb-10">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Children</h1>
        <p className="mt-1 text-ink-700">Each profile is private to your account. Stories, characters, and worlds are scoped per child.</p>
      </header>

      <section className="card-base mb-8 !p-4 sm:!p-8 lg:mb-10">
        <h2 className="text-xl font-bold text-ink">Add a child</h2>
        <p className="mt-1 text-sm text-ink-700">First name and age. We collect the bare minimum for COPPA.</p>
        <form action={addChild} className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="min-w-0 flex-1 sm:min-w-[160px]">
            <label htmlFor="name" className="block text-sm font-semibold text-ink-700">Name</label>
            <input
              id="name" name="name" type="text" required maxLength={40} autoComplete="off" autoCapitalize="words" enterKeyHint="next"
              className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white min-h-[48px] px-3 py-2 text-base focus:border-coral focus:outline-none"
              placeholder="Eli"
            />
          </div>
          <div className="sm:w-24">
            <label htmlFor="age" className="block text-sm font-semibold text-ink-700">Age</label>
            <input
              id="age" name="age" type="number" inputMode="numeric" required min={2} max={14} autoComplete="off" enterKeyHint="done"
              className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white min-h-[48px] px-3 py-2 text-base focus:border-coral focus:outline-none"
              placeholder="5"
            />
          </div>
          <div className="sm:self-end">
            <button type="submit" className="btn-primary w-full sm:w-auto">Add child</button>
          </div>
        </form>
      </section>

      {children.length === 0 ? (
        <div className="card-base text-center">
          <p className="text-ink-700">You haven&apos;t added a child yet.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {children.map((c) => (
            <li key={c.id} className="card-base !p-4 sm:!p-8">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 break-words">
                  <h2 className="text-xl font-bold text-ink">{c.name}</h2>
                  <p className="text-sm text-ink-500">Age {c.age}</p>
                  {c._count.characters === 0 && (
                    <p className="mt-2 text-xs italic text-ink-500">No characters yet — open Studio to make some</p>
                  )}
                  <p className="mt-3 text-sm text-ink-700">
                    {c._count.characters} characters &middot; {c._count.books} stories
                  </p>
                </div>
                <DeleteChildButton id={c.id} name={c.name} />
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/studio?child=${c.id}`} className="btn-secondary w-full text-sm sm:w-auto">Open Studio</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
