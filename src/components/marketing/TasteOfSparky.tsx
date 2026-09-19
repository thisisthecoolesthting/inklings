"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * "Taste of Sparky" — a zero-cost, no-account interactive preview of the
 * Studio's branching-choice pattern. Everything here is hardcoded (no live
 * AI call): tap a setting, a demo illustration crossfades in, and one
 * pre-written sentence types out below it — the same "art on top, readable
 * text below" page shape used throughout the real Studio.
 *
 * Reuses the existing Sparky visual language (`.sparky-chip`, `.big-button`,
 * the coral/mint/gold palette) rather than inventing new components, and
 * the existing "Milo and the Moonbeam Map" demo art under
 * public/images/showcase/milo-moonbeam/ rather than any new illustration.
 *
 * Embedded on the homepage hero area and reused as-is on the standalone
 * /try page (see src/app/try/page.tsx).
 */

type BranchId = "castle" | "sea" | "space";

interface Branch {
  id: BranchId;
  emoji: string;
  label: string;
  image: string;
  alt: string;
  text: string;
}

const BRANCHES: Branch[] = [
  {
    id: "castle",
    emoji: "🏰",
    label: "A castle",
    image: "/images/showcase/milo-moonbeam/ill-03.jpg",
    alt: "Milo the fox and Pip the puppy beside a glowing bell in an enchanted forest",
    text: "Milo and Pip found a hidden bell tower glowing deep in the castle woods.",
  },
  {
    id: "sea",
    emoji: "🌊",
    label: "Under the sea",
    image: "/images/showcase/milo-moonbeam/ill-06.jpg",
    alt: "Milo the fox and Pip the puppy behind a waterfall, untangling a bell from silver vines",
    text: "Behind the waterfall, Milo and Pip found a secret bell tangled in glittering vines.",
  },
  {
    id: "space",
    emoji: "🚀",
    label: "Outer space",
    image: "/images/showcase/milo-moonbeam/ill-cover.jpg",
    alt: "Milo the fox and Pip the puppy sitting beneath a swirl of friendly stars",
    text: "Milo and Pip sat beneath a swirl of friendly stars, ready to map the way home.",
  },
];

/** Typewriter reveal, letter by letter. Skips straight to full text under prefers-reduced-motion. */
function useTypewriter(text: string, active: boolean) {
  const [shown, setShown] = useState("");
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!active) {
      setShown("");
      return;
    }
    if (reducedRef.current) {
      setShown(text);
      return;
    }
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, active]);

  return shown;
}

export function TasteOfSparky({
  className = "",
  showEmailOption = false,
}: {
  className?: string;
  /** Adds an "email me this story" link under the post-choice CTA (used on /try). */
  showEmailOption?: boolean;
}) {
  const [selected, setSelected] = useState<Branch | null>(null);
  const shownText = useTypewriter(selected?.text ?? "", selected != null);

  return (
    <div className={`card-base p-6 sm:p-8 ${className}`}>
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-coral text-xl"
          aria-hidden
        >
          ✨
        </span>
        <div>
          <p className="text-lg font-bold text-ink sm:text-xl">
            {selected ? "Great choice! Watch this…" : "Hi, I'm Sparky. Where are we today?"}
          </p>
          {!selected && (
            <p className="mt-1 text-sm text-ink-600">
              Tap one — this is exactly how your child picks in the real Studio.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3" role="group" aria-label="Choose a setting">
        {BRANCHES.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setSelected(b)}
            aria-pressed={selected?.id === b.id}
            className={`sparky-chip ${selected?.id === b.id ? "bg-mint-500 scale-105" : ""}`}
          >
            <span aria-hidden>{b.emoji}</span>
            {b.label}
          </button>
        ))}
      </div>

      {/* Reserve height even before a pick so the chips don't jump the page around it. */}
      <div className="mt-6 min-h-[1px]">
        {selected && (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,220px)_1fr] sm:items-start">
            <div
              key={selected.id}
              className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-card border-2 border-white shadow-card motion-safe:animate-[taste-crossfade_500ms_ease]"
            >
              <Image
                src={selected.image}
                alt={selected.alt}
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="min-h-[3.5rem] text-lg leading-relaxed text-ink sm:text-xl">
                {shownText}
                <span className="motion-safe:animate-pulse" aria-hidden>
                  ▋
                </span>
              </p>
              <Link href="/trial" className="btn-primary btn-large mt-5 inline-flex w-fit">
                Make this your kid&apos;s real book →
              </Link>
              {showEmailOption && (
                <p className="mt-3 text-sm text-ink-600">
                  <Link href="/contact?topic=sample-story" className="font-semibold text-coral underline underline-offset-4">
                    Or email me this story as a PDF
                  </Link>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* `motion-safe:` above already gates this on prefers-reduced-motion: no-preference. */}
      <style>{`
        @keyframes taste-crossfade {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
