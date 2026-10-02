"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSpeech } from "./use-speech";

/** Persistent read-aloud on/off switch for the kid shell top bar. */
export function ReadAloudToggle() {
  const { supported, enabled, setEnabled, speak } = useSpeech();
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={() => {
        const next = !enabled;
        setEnabled(next);
        if (next) speak("Sparky will read to you!", { force: true });
      }}
      aria-pressed={enabled}
      aria-label="Read aloud"
      className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-gold/30 text-ink hover:bg-gold/50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-coral"
    >
      {enabled ? <Volume2 className="h-7 w-7" aria-hidden /> : <VolumeX className="h-7 w-7" aria-hidden />}
    </button>
  );
}
