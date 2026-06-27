"use client";

import { useEffect, useState } from "react";

const EMOJIS = ["⭐", "🌟", "✨", "🎨", "📖", "🦊", "🐶", "🌈"];

/** Tiny tap game while Sparky generates — keeps little hands busy. */
export function SparkyLoadingGame({
  pageNumber = 1,
  isFirstPage = false,
}: {
  pageNumber?: number;
  isFirstPage?: boolean;
}) {
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    setTarget(Math.floor(Math.random() * EMOJIS.length));
  }, [score]);

  return (
    <div className="mt-6 card-base border-2 border-mint-300 bg-mint-100 text-center" aria-live="polite">
      <p className="text-lg font-bold text-ink">
        {isFirstPage ? "Your first page is on the way!" : `Page ${pageNumber} is on the way!`}
      </p>
      <p className="mt-2 text-sm text-ink-700">
        Tap the matching emoji while Sparky writes and paints. A new page pops in when the bar fills!
      </p>
      <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden rounded-full bg-cream-200">
        <div className="sparky-wait-bar h-full rounded-full bg-coral" />
      </div>
      <p className="mt-4 text-3xl font-bold text-coral" aria-hidden>
        Find: {EMOJIS[target]}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {EMOJIS.map((e, i) => (
          <button
            key={`${e}-${i}`}
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-50 text-2xl shadow-sm transition hover:scale-110 active:scale-95"
            onClick={() => {
              if (i === target) {
                setScore((s) => s + 1);
                setCelebrate(true);
                setTimeout(() => setCelebrate(false), 600);
              }
            }}
            aria-label={`Tap ${e}`}
          >
            {e}
          </button>
        ))}
      </div>
      <p className={`mt-3 text-sm font-semibold ${celebrate ? "text-coral" : "text-ink-500"}`}>
        {celebrate ? "Nice! Keep going — almost there!" : `Score: ${score}`}
      </p>
    </div>
  );
}
