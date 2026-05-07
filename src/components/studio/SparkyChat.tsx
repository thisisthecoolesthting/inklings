"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff, Sparkles } from "lucide-react";
import type { SparkyBeat, SparkyChoice } from "@/content/sparky-prompts";
import { sanitizeChildInput } from "@/lib/safety";
import { useVoiceRecognition } from "./use-voice-recognition";

// Fuzzy-match helpers
function tokenSetMatch(a: string, b: string): number {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  const aSet = new Set(norm(a));
  const bSet = new Set(norm(b));
  const intersect = [...aSet].filter(x => bSet.has(x)).length;
  const union = new Set([...aSet, ...bSet]).size;
  return union === 0 ? 0 : intersect / union; // Jaccard similarity, 0..1
}

function findClosest(transcript: string, choices: SparkyChoice[]): SparkyChoice | null {
  let best: { c: SparkyChoice; score: number } | null = null;
  for (const c of choices) {
    const score = tokenSetMatch(transcript, c.label);
    if (!best || score > best.score) best = { c, score };
  }
  return best && best.score >= 0.5 ? best.c : null;
}

export function SparkyChat({
  beat,
  onChoose,
  thinking = false,
}: {
  beat: SparkyBeat;
  onChoose: (choice: SparkyChoice) => void;
  thinking?: boolean;
}) {
  const { state, setState, lastResult, start, isSupported } = useVoiceRecognition();
  const [matchedChoiceId, setMatchedChoiceId] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  // Process voice results
  useEffect(() => {
    if (!lastResult || state !== "listening") return;
    
    const { safe } = sanitizeChildInput(lastResult.transcript);
    const match = findClosest(safe, beat.choices);
    
    if (match) {
      setState("matched");
      setMatchedChoiceId(match.id);
      // Highlight the matched chip for 800ms, then choose
      setTimeout(() => {
        onChoose(match);
        setMatchedChoiceId(null);
        setState("idle");
      }, 800);
    } else {
      setState("no-match");
      setShaking(true);
      setTimeout(() => {
        setShaking(false);
        setState("idle");
      }, 400);
    }
  }, [lastResult, state, beat.choices, onChoose, setState]);

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
        <>
          {/* Mic button - big, round, above the choice grid */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={start}
              disabled={!isSupported || state === "listening" || state === "denied"}
              aria-label="Tap and talk"
              className={`
                relative flex h-[88px] w-[88px] items-center justify-center 
                rounded-full bg-coral text-white shadow-card transition-all
                hover:bg-coral-600 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                md:h-[72px] md:w-[72px]
                ${state === "listening" ? "mic-listening" : ""}
                ${shaking ? "mic-shake" : ""}
              `}
            >
              {!isSupported || state === "denied" ? (
                <MicOff className="h-10 w-10 md:h-8 md:w-8" aria-hidden />
              ) : (
                <Mic className="h-10 w-10 md:h-8 md:w-8" aria-hidden />
              )}
            </button>
          </div>

          {/* Choice grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {beat.choices.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onChoose(c)}
                className={`
                  sparky-chip justify-start text-left transition-all
                  ${matchedChoiceId === c.id ? "ring-4 ring-coral scale-105" : ""}
                `}
              >
                {c.emoji && <span className="text-2xl" aria-hidden>{c.emoji}</span>}
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
