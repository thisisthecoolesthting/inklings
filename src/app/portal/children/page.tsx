import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

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
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Children</h1>
          <p className="mt-1 text-ink-700">Each profile is private to your account.</p>
        </div>
        <button className="btn-primary" type="button">Add a child</button>
      </header>
      {children.length === 0 ? (
        <div className="card-base text-center">
          <p className="text-ink-700">You haven&apos;t added a child yet. Add one to start a story.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {children.map((c) => (
            <li key={c.id} className="card-base">
              <h2 className="text-xl font-bold text-ink">{c.name}</h2>
              <p className="text-sm text-ink-500">Age {c.age}</p>
              <p className="mt-3 text-sm text-ink-700">
                {c._count.characters} characters &middot; {c._count.books} stories
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
