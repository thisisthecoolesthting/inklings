"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type JourneyPage = {
  src: string;
  text: string;
};

/**
 * The homepage centerpiece: a full-viewport sticky book whose pages turn as
 * the visitor scrolls. Scroll progress across a tall runway maps to the
 * active page; pages lift away like paper. Every word shown is from the real
 * demo story — no mock copy.
 *
 * Reduced-motion visitors get the same story as a calm grid instead.
 */
export function JourneyStage({
  title,
  childName,
  pages,
}: {
  title: string;
  childName: string;
  pages: JourneyPage[];
}) {
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  const count = pages.length;
  const active = Math.min(count - 1, Math.floor(progress * count));

  const measure = useCallback(() => {
    const el = runwayRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    setProgress(Math.min(1, Math.max(0, -rect.top / scrollable)));
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  if (reduced) {
    return (
      <div className="container-ink section">
        <JourneyHeading childName={childName} />
        <ul className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
          {pages.map((p, i) => (
            <li key={p.src} className="card-base !p-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-50">
                <Image src={p.src} alt={`Page ${i + 1} of ${title}`} fill sizes="(max-width: 640px) 90vw, 360px" className="object-contain" />
              </div>
              <p className="mt-3 text-sm text-ink-700">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={runwayRef} className="relative h-[440vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="container-ink flex h-full flex-col pb-8 pt-20">
          <JourneyHeading childName={childName} compact={progress > 0.04} />

          {/* the book */}
          <div className="relative mx-auto mt-2 w-full max-w-[min(88vw,54dvh)] flex-1">
            <div className="absolute inset-x-0 top-1/2 aspect-square -translate-y-1/2">
              {/* open-book base */}
              <div
                aria-hidden
                className="absolute inset-[-4%] rounded-[2rem] bg-gradient-to-b from-cream-50 to-cream-200 shadow-book"
              />
              <div
                aria-hidden
                className="absolute inset-y-[-4%] left-1/2 w-px -translate-x-1/2 bg-ink-100"
              />
              {pages.map((p, i) => (
                <div
                  key={p.src}
                  data-state={i === active ? "active" : i < active ? "past" : "next"}
                  className="journey-page absolute inset-0"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-2xl border border-ink-100/70 bg-white shadow-page">
                    <Image
                      src={p.src}
                      alt={i === active ? `${title} — page ${i + 1}` : ""}
                      fill
                      priority={i < 2}
                      sizes="(max-width: 640px) 88vw, 54vh"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* caption + progress */}
          <div className="mx-auto w-full max-w-2xl">
            <div className="relative min-h-[4.5rem] text-center sm:min-h-[3.5rem]">
              {pages.map((p, i) => (
                <p
                  key={p.src}
                  data-state={i === active ? "active" : "off"}
                  className="journey-caption font-display text-lg italic leading-snug text-ink-700 sm:text-xl"
                  aria-hidden={i !== active}
                >
                  {p.text}
                </p>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-ink-500">
                Page {active + 1} of {count}
              </span>
              <div className="flex items-center gap-1.5" aria-hidden>
                {pages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === active ? "w-5 bg-coral" : "w-1.5 bg-ink-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mx-auto mt-3 h-0.5 w-40 overflow-hidden rounded-full bg-ink-100" aria-hidden>
              <div
                className="h-full rounded-full bg-gradient-to-r from-coral to-gold transition-[width] duration-150"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneyHeading({ childName, compact = false }: { childName: string; compact?: boolean }) {
  return (
    <div
      className={`mx-auto max-w-2xl text-center transition-all duration-500 ease-silk ${
        compact ? "-translate-y-2 opacity-0 md:opacity-40" : "opacity-100"
      }`}
    >
      <span className="eyebrow">A real story, made by a real kid</span>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Scroll, and the pages turn.
      </h2>
      <p className="mt-2 text-sm font-semibold text-ink-500">
        {childName}&apos;s first book — every page chosen, approved, and printed.
      </p>
    </div>
  );
}
