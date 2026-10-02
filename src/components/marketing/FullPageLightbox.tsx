"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * "See a full-size page" — opens two existing demo pages (from the Milo
 * showcase, public/images/showcase/milo-moonbeam/) at their native 1024x1024
 * resolution in a 2-up open-book mock: left page + right page, CSS gutter
 * shadow down the center.
 *
 * Existing assets only — no new photography. This is NOT a photo of a real
 * printed book in a child's hands; it is a same-pixels rendering of the demo
 * story art at full size, presented as an open-book layout. A real product
 * photo of the printed softcover is still an open item — see the operator
 * note in this component's usage site and the sprint report.
 */

const LEFT_PAGE = {
  src: "/images/showcase/milo-moonbeam/page-01.jpg",
  alt: "Full-size illustration: Milo the fox stretching in a flowery meadow",
  text: "Milo the fox woke up in the Meadowlands. The grass was soft, and the morning smelled like honey.",
};
const RIGHT_PAGE = {
  src: "/images/showcase/milo-moonbeam/page-02.jpg",
  alt: "Full-size illustration: Pip the puppy trotting over to greet Milo",
  text: "Pip the puppy trotted over. \"Let's explore the Stardust Woods today!\" Milo grinned and nodded yes.",
};

const PAGES = [LEFT_PAGE, RIGHT_PAGE];

export function FullPageTrigger({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to the trigger once the dialog has unmounted.
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  const goTo = useCallback((i: number) => {
    const el = stripRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: reduced ? "auto" : "smooth" });
    setIndex(i);
  }, []);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key === "ArrowRight") goTo(Math.min(PAGES.length - 1, index + 1));
      if (e.key === "ArrowLeft") goTo(Math.max(0, index - 1));
      if (e.key === "Tab" && dialogRef.current) {
        const f = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"),
        ).filter((el) => el.offsetParent !== null);
        if (f.length === 0) return;
        const first = f[0]!;
        const last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // `index` is read live for arrow keys; re-binding on change is cheap.
  }, [open, close, goTo, index]);

  function onStripScroll() {
    const el = stripRef.current;
    if (!el || el.clientWidth === 0) return;
    setIndex(Math.max(0, Math.min(PAGES.length - 1, Math.round(el.scrollLeft / el.clientWidth))));
  }

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className={`btn-ghost ${className}`}>
        See a full-size page →
      </button>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Full-size storybook spread preview"
          className="fixed inset-0 z-50 flex h-[100dvh] items-stretch justify-center bg-ink/70 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={close}
        >
          <div
            className="relative flex h-full w-full flex-col overflow-hidden bg-cream-50 shadow-cardHover sm:h-auto sm:max-h-[92dvh] sm:max-w-4xl sm:rounded-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close full-size page preview"
              className="absolute right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-lg font-bold text-ink shadow-card hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
            >
              <span aria-hidden>✕</span>
            </button>

            <div className="flex-1 overflow-y-auto overscroll-contain px-0 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(4rem,calc(env(safe-area-inset-top)+3.5rem))] sm:p-8">
              <p className="mb-4 px-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-500 sm:px-0">
                Actual size shown at 1024×1024 — this is the resolution kids see and the resolution we print at
              </p>

              {/* Phones: swipeable one-page-at-a-time strip. sm+: open-book 2-up spread. */}
              <div className="relative mx-auto max-w-3xl">
                <div
                  ref={stripRef}
                  onScroll={onStripScroll}
                  className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:snap-none sm:overflow-visible sm:rounded-lg sm:bg-white sm:shadow-[0_10px_40px_rgba(74,37,69,0.25)]"
                  role="group"
                  aria-roledescription="carousel"
                  aria-label="Storybook pages"
                >
                  {PAGES.map((page, i) => (
                    <div
                      key={page.src}
                      aria-roledescription="slide"
                      aria-label={`Page ${i + 1} of ${PAGES.length}`}
                      className={`relative w-full flex-none snap-center overflow-hidden bg-cream-50 sm:w-auto ${i === 0 ? "sm:rounded-l-lg" : "sm:rounded-r-lg"}`}
                    >
                      {/* touch-action stays default so the browser's pinch-zoom works on the page art */}
                      <div className="relative aspect-square w-full">
                        <Image
                          src={page.src}
                          alt={page.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-contain sm:object-cover"
                        />
                      </div>
                      <p className="border-t-2 border-coral/20 px-4 py-3 text-sm text-ink">{page.text}</p>
                    </div>
                  ))}

                  {/* Center gutter shadow — hidden on mobile where pages swipe */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-6 -translate-x-1/2 sm:block"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(74,37,69,0.16) 0%, rgba(74,37,69,0.04) 30%, rgba(74,37,69,0.04) 70%, rgba(74,37,69,0.16) 100%)",
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
                  <button
                    type="button"
                    onClick={() => goTo(index - 1)}
                    disabled={index === 0}
                    aria-label="Previous page"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-100 bg-white text-lg text-ink disabled:opacity-40"
                  >
                    <span aria-hidden>‹</span>
                  </button>
                  <p className="min-w-[4rem] text-center text-sm font-semibold text-ink-600" aria-live="polite">
                    {index + 1} / {PAGES.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => goTo(index + 1)}
                    disabled={index === PAGES.length - 1}
                    aria-label="Next page"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-100 bg-white text-lg text-ink disabled:opacity-40"
                  >
                    <span aria-hidden>›</span>
                  </button>
                </div>
              </div>

              <p className="mx-auto mt-5 max-w-2xl px-4 text-center text-xs text-ink-500 sm:px-0">
                This is Sparky-generated art from the free demo story, shown at full resolution in an
                open-book layout — not a photograph of the printed softcover. We don&apos;t have a real
                photo of a finished physical book yet.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
