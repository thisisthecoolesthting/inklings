"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { brand } from "@/lib/brand";

const NAV = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/security", label: "Safety" },
  { href: "/about", label: "About" },
];

/**
 * Inklings header. Sibling-mounted mobile drawer per spine §8 (no z-trap).
 */
export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-cream-200/60 bg-cream-100/95 backdrop-blur-xl">
        <nav className="container-ink flex items-center justify-between py-4" aria-label="Primary">
          <Link href="/" className="flex items-center gap-2 text-ink" onClick={() => setOpen(false)}>
            <Sparkles className="h-7 w-7 text-coral" aria-hidden />
            <span className="text-xl font-bold tracking-tight">{brand.name}</span>
          </Link>
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV.map((it) => (
              <li key={it.href}>
                <Link href={it.href} className="text-sm font-medium text-ink-700 transition-colors hover:text-coral">
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/login" className="text-sm font-medium text-ink-700 hover:text-coral">
              Sign in
            </Link>
            <Link href="/trial" className="btn-primary">
              {brand.primaryCta}
            </Link>
          </div>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden -mr-2 p-2 text-ink"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="fixed left-0 top-0 z-[70] h-screen w-[320px] max-w-[85vw] bg-cream-100 p-6 shadow-2xl lg:hidden">
            <div className="mb-8 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-ink" onClick={() => setOpen(false)}>
                <Sparkles className="h-7 w-7 text-coral" aria-hidden />
                <span className="text-xl font-bold tracking-tight">{brand.name}</span>
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 text-ink">
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="space-y-1">
              {NAV.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-button px-4 py-3 text-base font-medium text-ink-800 hover:bg-mint-100"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
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
