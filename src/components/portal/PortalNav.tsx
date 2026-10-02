"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Users, ShieldCheck, ShoppingBag, Settings, LogOut, Home, MoreVertical } from "lucide-react";

const ICONS = { dashboard: Sparkles, approvals: ShieldCheck, print: ShoppingBag, children: Users, settings: Settings } as const;

export type PortalNavItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  badge?: number;
  urgent?: boolean;
};

function isActive(pathname: string, href: string) {
  if (href === "/portal") return pathname === "/portal";
  return pathname === href || pathname.startsWith(href + "/");
}

function Badge({ n, urgent, className = "" }: { n: number; urgent?: boolean; className?: string }) {
  return (
    <span
      className={`inline-flex min-w-[20px] items-center justify-center rounded-full bg-coral px-1.5 py-0.5 text-xs font-bold leading-none text-white ${
        urgent ? "motion-safe:animate-pulse shadow-md" : ""
      } ${className}`}
    >
      <span aria-hidden>{n}</span>
      <span className="sr-only">{n} pending</span>
    </span>
  );
}

/** Desktop (lg+) sidebar links. */
export function PortalSidebarNav({ items }: { items: PortalNavItem[] }) {
  const pathname = usePathname() ?? "";
  return (
    <nav aria-label="Parent portal" className="mt-8 flex flex-col gap-1">
      {items.map((it) => {
        const Icon = ICONS[it.icon];
        const active = isActive(pathname, it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between gap-3 rounded-button px-3 py-2.5 text-sm font-medium hover:bg-mint-100 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral ${
              it.urgent ? "bg-coral/10 text-ink ring-2 ring-coral/40" : active ? "bg-mint-100 text-ink" : "text-ink-700"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" aria-hidden />
              {it.label}
            </span>
            {it.badge && it.badge > 0 ? <Badge n={it.badge} urgent={it.urgent} /> : null}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mobile (<lg) fixed bottom tab bar. */
export function PortalTabBar({ items }: { items: PortalNavItem[] }) {
  const pathname = usePathname() ?? "";
  return (
    <nav
      aria-label="Parent portal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex max-w-xl">
        {items.map((it) => {
          const Icon = ICONS[it.icon];
          const active = isActive(pathname, it.href);
          return (
            <li key={it.href} className="min-w-0 flex-1">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-coral ${
                  active ? "text-coral-dark" : "text-ink-700"
                }`}
              >
                {active && <span aria-hidden className="absolute inset-x-4 top-0 h-0.5 rounded-b bg-coral" />}
                <span className="relative">
                  <Icon className="h-6 w-6" aria-hidden />
                  {it.badge && it.badge > 0 ? (
                    <Badge n={it.badge} urgent={it.urgent} className="absolute -right-3 -top-1.5 !min-w-[18px] !px-1 !text-[10px]" />
                  ) : null}
                </span>
                <span className="max-w-full truncate">{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Mobile overflow menu: marketing site + sign out. */
export function PortalAccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    ref.current?.querySelector<HTMLElement>("a, button[type=submit]")?.focus();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={toggleRef}
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center rounded-button text-ink-700 hover:bg-mint-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
      >
        <MoreVertical className="h-5 w-5" aria-hidden />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-card border border-ink-100 bg-white shadow-lg">
          <Link href="/" className="flex min-h-[48px] items-center gap-3 px-4 text-sm text-ink hover:bg-cream-100">
            <Home className="h-4 w-4" aria-hidden /> Marketing site
          </Link>
          <form action="/api/auth/logout" method="POST" className="border-t border-ink-100">
            <button type="submit" className="flex min-h-[48px] w-full items-center gap-3 px-4 text-left text-sm text-ink hover:bg-cream-100">
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
