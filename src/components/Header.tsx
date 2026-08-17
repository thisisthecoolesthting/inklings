"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { brand } from "@/lib/brand";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/gift", label: "Gift" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-cream-200/60 bg-cream-100/90 backdrop-blur-xl">
        <nav className="container-ink grid min-h-[80px] grid-cols-[44px_1fr_auto] items-center gap-2 py-3 lg:flex lg:justify-between" aria-label="Primary">
          <button
            ref={triggerRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="order-1 -ml-2 grid h-11 w-11 place-items-center text-ink lg:hidden"
          >
            {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>

          <Link href="/" className="order-2 flex items-center justify-self-center gap-2 text-ink lg:order-1 lg:justify-self-auto" onClick={() => setOpen(false)}>
            <Sparkles className="h-7 w-7 text-coral" aria-hidden />
            <span className="text-xl font-bold tracking-tight">{brand.name}</span>
          </Link>

          <ul className="order-2 hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm font-medium text-ink-700 transition-colors hover:text-coral-700">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="order-3 hidden items-center gap-3 lg:flex">
            <Link href="/login" className="text-sm font-medium text-ink-700 hover:text-coral-700">Sign in</Link>
            <Link href="/trial" className="btn-primary">{brand.primaryCta}</Link>
          </div>

          <Link href="/trial" className="order-3 rounded-button bg-coral px-3 py-2 text-xs font-extrabold text-ink shadow-card lg:hidden">
            Try free
          </Link>
        </nav>
      </header>

      {open && (
        <>
          <div className="fixed inset-0 z-[60] bg-ink/45 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} aria-hidden />
          <aside
            ref={drawerRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed left-0 top-0 z-[70] h-screen w-[320px] max-w-[85vw] bg-cream-100 p-6 shadow-2xl lg:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-ink" onClick={() => setOpen(false)}>
                <Sparkles className="h-7 w-7 text-coral" aria-hidden />
                <span className="text-xl font-bold tracking-tight">{brand.name}</span>
              </Link>
              <button ref={closeRef} onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center text-ink">
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>
            <nav aria-label="Mobile">
              <ul className="space-y-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setOpen(false)} className="block min-h-11 rounded-button px-4 py-3 text-base font-medium text-ink-800 hover:bg-mint-100">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-8 space-y-2 border-t border-ink-100 pt-6">
              <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary btn-full">Sign in</Link>
              <Link href="/trial" onClick={() => setOpen(false)} className="btn-primary btn-full">{brand.primaryCta}</Link>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
