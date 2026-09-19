"use client";

import { useEffect, useState } from "react";
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

export function FullPageTrigger({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`btn-ghost ${className}`}>
        See a full-size page →
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full-size storybook spread preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-card bg-cream-50 shadow-cardHover"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-ink shadow-card hover:bg-white"
            >
              ✕
            </button>

            <div className="max-h-[85vh] overflow-y-auto p-4 sm:p-8">
              <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-500">
                Actual size shown at 1024×1024 — this is the resolution kids see and the resolution we print at
              </p>

              {/* Open-book 2-up spread */}
              <div className="relative mx-auto grid max-w-3xl grid-cols-1 gap-0 rounded-lg bg-white shadow-[0_10px_40px_rgba(74,37,69,0.25)] sm:grid-cols-2">
                {[LEFT_PAGE, RIGHT_PAGE].map((page, i) => (
                  <div key={page.src} className={`relative ${i === 0 ? "sm:rounded-l-lg" : "sm:rounded-r-lg"} overflow-hidden bg-cream-50`}>
                    <div className="relative aspect-square w-full">
                      <Image src={page.src} alt={page.alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                    </div>
                    <p className="border-t-2 border-coral/20 px-4 py-3 text-sm text-ink">{page.text}</p>
                  </div>
                ))}

                {/* Center gutter shadow — hidden on mobile where pages stack */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-6 -translate-x-1/2 sm:block"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(74,37,69,0.16) 0%, rgba(74,37,69,0.04) 30%, rgba(74,37,69,0.04) 70%, rgba(74,37,69,0.16) 100%)",
                  }}
                />
              </div>

              <p className="mx-auto mt-5 max-w-2xl text-center text-xs text-ink-500">
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
