"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { brand } from "@/lib/brand";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/gift", label: "Gift" },
];

/**
 * Inklings header. Sibling-mounted mobile drawer per spine §8 (no z-trap).
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Escape closes; Tab is kept inside the drawer; focus moves in on open and back to the toggle on close.
  useEffect(() => {
    if (!open) {
      if (wasOpen.current) toggleRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const f = drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={
          "sticky top-0 z-40 w-full border-b bg-cream-100/95 backdrop-blur-xl transition-shadow duration-200 " +
          (scrolled ? "border-cream-200 shadow-card" : "border-cream-200/60")
        }
      >
        <nav className="container-ink flex min-h-[60px] items-center justify-between py-2 lg:min-h-[77px] lg:py-4" aria-label="Primary">
          <Link href="/" className="flex min-h-[44px] items-center gap-2 text-ink" onClick={() => setOpen(false)}>
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-coral-dark" aria-hidden />
            <span className="text-xl font-bold tracking-tight">{brand.name}</span>
          </Link>
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV.map((it) => {
              const active = isActive(it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      "text-sm font-medium underline-offset-[6px] transition-colors hover:text-coral-dark hover:underline " +
                      (active ? "text-ink underline decoration-2" : "text-ink-700")
                    }
                  >
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              aria-current={isActive("/login") ? "page" : undefined}
              className="text-sm font-medium text-ink-700 underline-offset-[6px] hover:text-coral-dark hover:underline"
            >
              Sign in
            </Link>
            <Link href="/trial" className="btn-primary">
              {brand.primaryCta}
            </Link>
          </div>
          <div className="flex items-center gap-1 lg:hidden">
            <Link
              href="/login"
              aria-current={isActive("/login") ? "page" : undefined}
              className="hidden min-h-[44px] items-center justify-center rounded-button px-2.5 text-sm font-semibold text-ink underline-offset-4 hover:underline min-[360px]:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/trial"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-coral-dark px-4 text-sm font-semibold text-white shadow-card hover:bg-coral-700"
            >
              Start free
            </Link>
            <button
              ref={toggleRef}
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen((o) => !o)}
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-button text-ink"
            >
              {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
            </button>
          </div>
        </nav>
      </header>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            ref={drawerRef}
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed left-0 top-0 z-[70] h-[100dvh] w-[320px] max-w-[85vw] overflow-y-auto overscroll-contain bg-cream-100 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))] shadow-2xl lg:hidden"
          >
            <div className="mb-6 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-ink" onClick={() => setOpen(false)}>
                <Sparkles className="h-7 w-7 text-coral-dark" aria-hidden />
                <span className="text-xl font-bold tracking-tight">{brand.name}</span>
              </Link>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center rounded-button text-ink">
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>
            <ul className="space-y-1">
              {NAV.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(it.href) ? "page" : undefined}
                    className={
                      "flex min-h-[48px] items-center rounded-button px-4 py-3 text-base font-medium text-ink-800 hover:bg-mint-100 " +
                      (isActive(it.href) ? "bg-mint-100 underline decoration-2 underline-offset-4" : "")
                    }
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/try"
                  onClick={() => setOpen(false)}
                  aria-current={isActive("/try") ? "page" : undefined}
                  className={
                    "flex min-h-[48px] items-center rounded-button px-4 py-3 text-base font-medium text-ink-800 hover:bg-mint-100 " +
                    (isActive("/try") ? "bg-mint-100 underline decoration-2 underline-offset-4" : "")
                  }
                >
                  Try Sparky (no account)
                </Link>
              </li>
            </ul>
            <div className="mt-8 space-y-2 border-t border-ink-100 pt-6">
              <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary btn-full">
                Sign in
              </Link>
              <Link href="/trial" onClick={() => setOpen(false)} className="btn-primary btn-full">
                {brand.primaryCta}
              </Link>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
