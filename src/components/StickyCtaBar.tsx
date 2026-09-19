"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";

/** Routes where the bar would be redundant or in the way (sign-up, auth, gift, product surfaces). */
const HIDDEN_PREFIXES = [
  "/trial",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/gift",
  "/studio",
  "/portal",
  "/library",
  "/grownup",
];

export function useShowStickyCta(): boolean {
  const pathname = usePathname() ?? "/";
  return !HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/**
 * Mobile-only bottom CTA. Appears once the visitor has scrolled past the hero so it does not
 * duplicate the hero button. Honors the iOS safe-area inset. SiteChrome adds a matching spacer
 * below the footer so the bar never covers the last row.
 */
export function StickyCtaBar() {
  const show = useShowStickyCta();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden={!scrolled}
      className={
        "fixed inset-x-0 bottom-0 z-30 border-t border-cream-200 bg-cream-50/95 px-4 pt-3 shadow-[0_-6px_20px_rgba(74,37,69,0.12)] backdrop-blur md:hidden " +
        "pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform duration-300 motion-reduce:transition-none " +
        (scrolled ? "translate-y-0" : "translate-y-full")
      }
    >
      <Link href="/trial" tabIndex={scrolled ? 0 : -1} className="btn-primary btn-full">
        {brand.primaryCta}
      </Link>
      <p className="mt-1.5 text-center text-xs text-ink-600">
        Free · no credit card · you approve everything
      </p>
    </div>
  );
}

/** Spacer rendered under the footer (mobile only) so the fixed bar never hides the last row. */
export function StickyCtaSpacer() {
  const show = useShowStickyCta();
  if (!show) return null;
  return <div aria-hidden className="h-[calc(6.25rem+env(safe-area-inset-bottom))] bg-ink md:hidden" />;
}
