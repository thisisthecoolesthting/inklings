"use client";

import { useEffect, useState } from "react";

const EMOJIS = ["⭐", "🌟", "✨", "🎨", "📖", "🦊", "🐶", "🌈"];

/** Tiny tap game while Sparky generates — keeps little hands busy. */
export function SparkyLoadingGame() {
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(0);

  useEffect(() => {
    setTarget(Math.floor(Math.random() * EMOJIS.length));
  }, [score]);

  return (
    <div className="mt-6 card-base bg-mint-100 text-center" aria-live="polite">
      <p className="text-lg font-semibold text-ink">Sparky is writing and painting…</p>
      <p className="mt-1 text-sm text-ink-600">Tap the matching star while you wait!</p>
      <p className="mt-3 text-2xl font-bold text-coral" aria-hidden>
        Find: {EMOJIS[target]}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {EMOJIS.map((e, i) => (
          <button
            key={`${e}-${i}`}
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-50 text-2xl shadow-sm transition hover:scale-110 active:scale-95"
            onClick={() => {
              if (i === target) setScore((s) => s + 1);
            }}
            aria-label={`Tap ${e}`}
          >
            {e}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-500">Score: {score}</p>
    </div>
  );
}
