import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, Users, ShieldCheck, ShoppingBag, Settings, LogOut, Home } from "lucide-react";
import { brand } from "@/lib/brand";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/portal");

  const [pendingBooks, readyToPrint] = await Promise.all([
    prisma.book.count({
      where: { status: "awaiting_parent", child: { parentId: session.userId } },
    }),
    prisma.book.count({
      where: {
        status: "approved",
        child: { parentId: session.userId },
        orders: { none: { status: { in: ["paid", "fulfilled"] } } },
      },
    }),
  ]);

  const NAV = [
    { href: "/portal", label: "Dashboard", icon: Sparkles },
    { href: "/portal/approvals", label: "Approvals", icon: ShieldCheck, badge: pendingBooks },
    { href: "/portal/orders", label: "Print", icon: ShoppingBag, badge: readyToPrint },
    { href: "/portal/children", label: "Children", icon: Users },
    { href: "/portal/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-cream-50 lg:flex-row">
      <aside className="border-r border-ink-100/60 bg-cream-100 p-6 lg:w-64">
        <Link href="/portal" className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-coral" aria-hidden />
          <span className="text-lg font-bold text-ink">{brand.name}</span>
        </Link>
        <p className="mt-1 text-xs uppercase tracking-wider text-ink-500">Parent portal</p>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="flex items-center justify-between gap-3 rounded-button px-3 py-2 text-sm font-medium text-ink-700 hover:bg-mint-100 hover:text-ink"
            >
              <span className="flex items-center gap-3">
                <it.icon className="h-4 w-4" aria-hidden />
                {it.label}
              </span>
              {it.badge && it.badge > 0 ? (
                <span className="rounded-full bg-coral px-2 py-0.5 text-xs font-bold text-white">{it.badge}</span>
              ) : null}
            </Link>
          ))}
        </nav>
        <Link href="/studio" className="btn-primary btn-full mt-6 text-center text-sm">
          Kid Studio
        </Link>
        <div className="mt-6 border-t border-ink-100 pt-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink">
            <Home className="h-4 w-4" aria-hidden /> Marketing site
          </Link>
        </div>
        <form action="/api/auth/logout" method="POST" className="mt-4 border-t border-ink-100 pt-4">
          <button type="submit" className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink">
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </button>
        </form>
      </aside>
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
