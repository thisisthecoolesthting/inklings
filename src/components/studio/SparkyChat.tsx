"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { SparkyBeat, SparkyChoice } from "@/content/sparky-prompts";

export function SparkyChat({
  beat,
  onChoose,
  thinking = false,
}: {
  beat: SparkyBeat;
  onChoose: (choice: SparkyChoice) => void;
  thinking?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="card-base flex items-start gap-4">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-coral text-white">
          <Sparkles className="h-7 w-7" aria-hidden />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-coral">Sparky</p>
          <p className="mt-1 text-2xl font-bold text-ink">{beat.sparkyLine}</p>
        </div>
      </div>

      {!thinking && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {beat.choices.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onChoose(c)}
              className="sparky-chip justify-start text-left"
            >
              {c.emoji && <span className="text-2xl" aria-hidden>{c.emoji}</span>}
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
