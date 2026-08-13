"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff, Sparkles } from "lucide-react";
import type { SparkyBeat, SparkyChoice } from "@/content/sparky-prompts";
import { sanitizeChildInput } from "@/lib/safety";
import { useVoiceRecognition } from "./use-voice-recognition";
import { SparkyLoadingGame } from "./SparkyLoadingGame";

function tokenSetMatch(a: string, b: string): number {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  const aSet = new Set(norm(a));
  const bSet = new Set(norm(b));
  const intersect = [...aSet].filter((x) => bSet.has(x)).length;
  const union = new Set([...aSet, ...bSet]).size;
  return union === 0 ? 0 : intersect / union;
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
  waiting = false,
  pageNumber = 1,
  isFirstPage = false,
  stepLabel,
}: {
  beat: SparkyBeat;
  onChoose: (choice: SparkyChoice) => void;
  waiting?: boolean;
  pageNumber?: number;
  isFirstPage?: boolean;
  stepLabel?: string;
}) {
  const { state, setState, lastResult, start, isSupported } = useVoiceRecognition();
  const [matchedChoiceId, setMatchedChoiceId] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (!lastResult || state !== "listening" || waiting) return;
    const { safe } = sanitizeChildInput(lastResult.transcript);
    const match = findClosest(safe, beat.choices);
    if (match) {
      setState("matched");
      setMatchedChoiceId(match.id);
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
  }, [lastResult, state, beat.choices, onChoose, setState, waiting]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-start gap-3 rounded-3xl border-2 border-coral/30 bg-white p-4 shadow-card">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-coral text-white">
          <Sparkles className="h-8 w-8" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-coral">
            Sparky{stepLabel ? ` · ${stepLabel}` : ""}
          </p>
          <p className="mt-1 text-2xl font-bold leading-snug text-ink sm:text-3xl">{beat.sparkyLine}</p>
        </div>
      </div>

      {waiting ? (
        <SparkyLoadingGame pageNumber={pageNumber} isFirstPage={isFirstPage} />
      ) : (
        <>
          <p className="mt-5 text-center text-lg font-semibold text-ink-700">Tap your pick!</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {beat.choices.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onChoose(c)}
                className={`sparky-chip-kid ${matchedChoiceId === c.id ? "scale-105 ring-4 ring-coral" : ""}`}
              >
                {c.emoji && (
                  <span className="text-3xl" aria-hidden>
                    {c.emoji}
                  </span>
                )}
                <span>{c.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center">
            <button
              type="button"
              onClick={start}
              disabled={!isSupported || state === "listening" || state === "denied"}
              aria-label="Say it out loud"
              className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink-200 bg-white text-ink-600 transition-all hover:bg-cream-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${state === "listening" ? "mic-listening" : ""} ${shaking ? "mic-shake" : ""}`}
            >
              {!isSupported || state === "denied" ? (
                <MicOff className="h-6 w-6" aria-hidden />
              ) : (
                <Mic className="h-6 w-6" aria-hidden />
              )}
            </button>
            <p className="mt-2 text-sm text-ink-500">Or say it out loud</p>
            {state === "no-match" && (
              <p className="mt-2 text-sm font-medium text-coral">Sparky didn&apos;t catch that. Tap a picture instead.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
