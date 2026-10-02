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

// Bar height = 48px button + 8px padding top/bottom = 4rem, plus the safe-area inset (keep the spacer below in sync).

/**
 * Mobile-only bottom CTA. Appears only once the hero's own CTAs have scrolled out of view
 * (`[data-hero-cta]`, or the `.hero-storybook` section on pages without one) and hides again
 * while the closing CTA / footer is visible (`[data-final-cta]`, `footer`). Honors the iOS
 * safe-area inset. SiteChrome adds a matching spacer below the footer so the bar never covers
 * the last row.
 */
export function StickyCtaBar() {
  const show = useShowStickyCta();
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    if (!show) return;
    setPastHero(false);
    setAtEnd(false);

    const heroEls = Array.from(document.querySelectorAll<HTMLElement>("[data-hero-cta]"));
    const heroTargets = heroEls.length ? heroEls : Array.from(document.querySelectorAll<HTMLElement>(".hero-storybook"));
    const endTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-final-cta], footer"),
    );

    const cleanups: Array<() => void> = [];

    if (heroTargets.length && "IntersectionObserver" in window) {
      // "Past" = not intersecting AND above the viewport (scrolled beyond it, not still below).
      const state = new Map<Element, boolean>();
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          state.set(e.target, !e.isIntersecting && e.boundingClientRect.bottom <= 0);
        }
        setPastHero(heroTargets.every((t) => state.get(t) === true));
      });
      heroTargets.forEach((t) => io.observe(t));
      cleanups.push(() => io.disconnect());
    } else {
      const onScroll = () => setPastHero(window.scrollY > 360);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    if (endTargets.length && "IntersectionObserver" in window) {
      const vis = new Set<Element>();
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) vis.add(e.target);
          else vis.delete(e.target);
        }
        setAtEnd(vis.size > 0);
      });
      endTargets.forEach((t) => io.observe(t));
      cleanups.push(() => io.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  }, [show, pathname]);

  if (!show) return null;

  const visible = pastHero && !atEnd;

  return (
    <div
      aria-hidden={!visible}
      // `inert` keeps the hidden bar out of the tab order / a11y tree.
      {...(!visible ? ({ inert: "" } as Record<string, string>) : {})}
      className={
        "fixed inset-x-0 bottom-0 z-30 border-t border-cream-200 bg-cream-50/95 px-4 pt-2 shadow-[0_-6px_20px_rgba(74,37,69,0.12)] backdrop-blur md:hidden " +
        "pb-[calc(0.5rem+env(safe-area-inset-bottom))] transition-transform duration-300 motion-reduce:transition-none " +
        (visible ? "translate-y-0" : "translate-y-full")
      }
    >
      <Link href="/trial" className="btn-primary btn-full !min-h-[48px] !py-2.5">
        {brand.primaryCta}
      </Link>
    </div>
  );
}

/** Spacer rendered under the footer (mobile only) so the fixed bar never hides the last row. */
export function StickyCtaSpacer() {
  const show = useShowStickyCta();
  if (!show) return null;
  return (
    <div aria-hidden className="h-[calc(4rem+env(safe-area-inset-bottom))] bg-ink md:hidden" />
  );
}
