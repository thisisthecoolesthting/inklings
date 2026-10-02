"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Below the breakpoint: a horizontal scroll-snap strip (cards ~80% wide so the next card peeks),
 * with a "1 / N" indicator and dots. At/above the breakpoint: a normal grid (`gridClassName`).
 * Keyboard: the strip is focusable and scrolls with arrow keys. Smooth scrolling is disabled
 * when the visitor prefers reduced motion.
 */
type Breakpoint = "sm" | "md";

// Static class strings so Tailwind can see them.
const BP: Record<Breakpoint, { wrap: string; item: string; hide: string }> = {
  sm: {
    wrap: "sm:mx-0 sm:grid sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0",
    item: "sm:w-auto sm:flex-initial sm:snap-align-none",
    hide: "sm:hidden",
  },
  md: {
    wrap: "md:mx-0 md:grid md:snap-none md:overflow-visible md:px-0 md:pb-0",
    item: "md:w-auto md:flex-initial md:snap-align-none",
    hide: "md:hidden",
  },
};

export function SwipeStrip({
  children,
  label,
  gridClassName = "",
  breakpoint = "md",
  itemClassName = "",
  bleed = true,
}: {
  children: ReactNode;
  /** Accessible name, e.g. "Sample story pages". */
  label: string;
  /** Layout classes applied from the breakpoint up, e.g. "md:grid-cols-3 md:gap-6". */
  gridClassName?: string;
  breakpoint?: Breakpoint;
  itemClassName?: string;
  /** Extend the strip to the screen edges (negative margin). Set false inside an already-padded card. */
  bleed?: boolean;
}) {
  const items = Children.toArray(children);
  const ref = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const bp = BP[breakpoint];

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el || el.children.length === 0) return;
    const first = el.children[0] as HTMLElement;
    const step = first.offsetWidth + 12;
    const max = el.scrollWidth - el.clientWidth;
    const i = el.scrollLeft >= max - 4 ? el.children.length - 1 : Math.round(el.scrollLeft / Math.max(step, 1));
    setIndex(Math.max(0, Math.min(el.children.length - 1, i)));
  }, []);

  useEffect(() => {
    onScroll();
  }, [onScroll]);

  function goTo(i: number) {
    const el = ref.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <div>
      <div
        ref={ref}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onScroll={onScroll}
        className={
          "flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 " +
          (bleed ? "-mx-[5vw] px-[5vw] " : "") +
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden motion-reduce:scroll-auto " +
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral " +
          bp.wrap +
          " " +
          gridClassName
        }
      >
        {items.map((child, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            className={`w-[88%] flex-none snap-center scroll-mx-[5vw] ${bp.item} ${itemClassName}`}
          >
            {child}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div className={`mt-3 flex items-center justify-center gap-3 ${bp.hide}`}>
          <p className="text-xs font-semibold text-ink-600" aria-live="polite">
            {index + 1} / {items.length}
          </p>
          <div className="flex items-center">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${i + 1} of ${items.length}`}
                aria-current={i === index ? "true" : undefined}
                className="flex h-11 w-8 items-center justify-center"
              >
                <span
                  className={
                    "block h-2 rounded-full transition-all motion-reduce:transition-none " +
                    (i === index ? "w-5 bg-coral-dark" : "w-2 bg-ink-200")
                  }
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
