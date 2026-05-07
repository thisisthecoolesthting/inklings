import Link from "next/link";
import { Sparkles, BookOpen, ShieldCheck, ShoppingBag } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function PortalHome() {
  const session = await getSession();
  if (!session) return null;

  const [children, characters, books, orders] = await Promise.all([
    prisma.childProfile.count({ where: { parentId: session.userId } }),
    prisma.character.count({ where: { child: { parentId: session.userId } } }),
    prisma.book.count({ where: { child: { parentId: session.userId } } }),
    prisma.order.count({ where: { userId: session.userId } }),
  ]);

  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-ink">Welcome back</h1>
        <p className="mt-2 text-ink-700">{session.email}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Children", value: children, icon: Sparkles },
          { label: "Characters", value: characters, icon: BookOpen },
          { label: "Stories", value: books, icon: BookOpen },
          { label: "Orders", value: orders, icon: ShoppingBag },
        ].map((s) => (
          <div key={s.label} className="card-base">
            <s.icon className="h-6 w-6 text-coral" aria-hidden />
            <div className="mt-3 text-3xl font-bold text-ink">{s.value}</div>
            <div className="text-sm text-ink-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card-base">
          <h2 className="text-xl font-bold text-ink">Add a child to start</h2>
          <p className="mt-2 text-ink-700">Each child has their own profile, characters, and worlds. Their stories are private to your account.</p>
          <Link href="/portal/children" className="btn-primary mt-6 inline-flex">Manage children</Link>
        </div>
        <div className="card-base">
          <h2 className="text-xl font-bold text-ink">Pending approvals</h2>
          <p className="mt-2 text-ink-700">Review new characters and stories your kids made before they go live.</p>
          <Link href="/portal/approvals" className="btn-secondary mt-6 inline-flex">Open approvals</Link>
        </div>
      </div>
    </>
  );
}
