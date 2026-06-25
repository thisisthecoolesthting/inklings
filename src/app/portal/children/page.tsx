import Link from "next/link";
import { Trash2 } from "lucide-react";
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
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-ink">Children</h1>
        <p className="mt-1 text-ink-700">Each profile is private to your account. Stories, characters, and worlds are scoped per child.</p>
      </header>

      <section className="card-base mb-10">
        <h2 className="text-xl font-bold text-ink">Add a child</h2>
        <p className="mt-1 text-sm text-ink-700">First name and age. We collect the bare minimum for COPPA.</p>
        <form action={addChild} className="mt-4 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[160px]">
            <label htmlFor="name" className="block text-xs font-semibold text-ink-700">Name</label>
            <input
              id="name" name="name" type="text" required maxLength={40}
              className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-3 py-2 text-base focus:border-coral focus:outline-none"
              placeholder="Eli"
            />
          </div>
          <div className="w-24">
            <label htmlFor="age" className="block text-xs font-semibold text-ink-700">Age</label>
            <input
              id="age" name="age" type="number" required min={2} max={14}
              className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-3 py-2 text-base focus:border-coral focus:outline-none"
              placeholder="5"
            />
          </div>
          <div className="self-end">
            <button type="submit" className="btn-primary">Add child</button>
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
            <li key={c.id} className="card-base">
              <div className="flex items-start justify-between gap-3">
                <div>
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
                <Link href={`/studio?child=${c.id}`} className="btn-secondary text-sm">Open Studio</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
