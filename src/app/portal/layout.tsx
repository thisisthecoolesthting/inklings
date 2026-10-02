import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, LogOut, Home } from "lucide-react";
import { brand } from "@/lib/brand";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PortalSidebarNav, PortalTabBar, PortalAccountMenu, type PortalNavItem } from "@/components/portal/PortalNav";

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

  const NAV: PortalNavItem[] = [
    { href: "/portal", label: "Home", icon: "dashboard" },
    { href: "/portal/approvals", label: "Approvals", icon: "approvals", badge: pendingBooks, urgent: pendingBooks > 0 },
    { href: "/portal/orders", label: "Print", icon: "print", badge: readyToPrint },
    { href: "/portal/children", label: "Children", icon: "children" },
    { href: "/portal/settings", label: "Settings", icon: "settings" },
  ];
  const SIDE_NAV = NAV.map((n) => (n.href === "/portal" ? { ...n, label: "Dashboard" } : n));

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream-50 lg:flex-row">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-ink-100/60 bg-cream-100/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur lg:hidden">
        <Link href="/portal" className="flex min-h-[52px] min-w-0 flex-1 items-center gap-2">
          <Sparkles className="h-6 w-6 shrink-0 text-coral" aria-hidden />
          <span className="truncate text-base font-bold text-ink">{brand.name}</span>
          <span className="truncate text-[11px] uppercase tracking-wider text-ink-500">Parent portal</span>
        </Link>
        <Link href="/studio" className="btn-primary !min-h-[44px] !px-4 !py-2 text-sm">
          Kid Studio
        </Link>
        <PortalAccountMenu />
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden border-r border-ink-100/60 bg-cream-100 p-6 lg:block lg:w-64 lg:shrink-0">
        <Link href="/portal" className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-coral" aria-hidden />
          <span className="text-lg font-bold text-ink">{brand.name}</span>
        </Link>
        <p className="mt-1 text-xs uppercase tracking-wider text-ink-500">Parent portal</p>
        <PortalSidebarNav items={SIDE_NAV} />
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

      <main className="min-w-0 flex-1 px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:p-10">
        {pendingBooks > 0 && (
          <div
            className="mb-6 flex flex-col gap-3 rounded-card border-2 border-coral bg-coral px-4 py-4 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:mb-8"
            role="alert"
          >
            <div className="min-w-0">
              <p className="text-lg font-bold">
                {pendingBooks} stor{pendingBooks === 1 ? "y" : "ies"} waiting for you
              </p>
              <p className="mt-1 text-sm text-cream-100/90">Your child finished a book — review it before it goes live.</p>
            </div>
            <Link
              href="/portal/approvals"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-button bg-white px-5 py-2.5 text-sm font-bold text-coral shadow-sm hover:bg-cream-50 sm:w-auto"
            >
              Review now →
            </Link>
          </div>
        )}
        {children}
      </main>

      <PortalTabBar items={NAV} />
    </div>
  );
}
