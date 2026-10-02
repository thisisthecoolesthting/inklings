"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Read-aloud (Web Speech API speechSynthesis) shared across the kid surfaces.
 * One module-level store so the shell toggle, Sparky chat and book reader agree.
 *
 * iOS Safari only allows speech after a user gesture. We "unlock" audio on the
 * first pointer/key interaction anywhere (a silent utterance), after which
 * auto-speak is allowed. Explicit button taps always speak (force) and unlock.
 */

const LS_KEY = "inklings.readAloud";

interface Snap {
  supported: boolean;
  enabled: boolean;
  unlocked: boolean;
  speaking: boolean;
  owner: number | null;
}

const SERVER_SNAP: Snap = { supported: false, enabled: true, unlocked: false, speaking: false, owner: null };
let snap: Snap = SERVER_SNAP;
let initialised = false;
const listeners = new Set<() => void>();
let voice: SpeechSynthesisVoice | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null; // keep ref: Chrome GCs live utterances
let nextId = 1;

function emit(patch: Partial<Snap>) {
  snap = { ...snap, ...patch };
  listeners.forEach((l) => l());
}

function pickVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;
  const en = voices.filter((v) => /^en[-_]US/i.test(v.lang));
  const pool = en.length ? en : voices.filter((v) => /^en/i.test(v.lang));
  const prefs = [/samantha/i, /google us english/i, /aria|jenny|natural/i, /female|zira/i, /enhanced|premium/i];
  for (const p of prefs) {
    const hit = pool.find((v) => p.test(v.name));
    if (hit) {
      voice = hit;
      return;
    }
  }
  voice = pool[0] ?? null;
}

function init() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  const supported = "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
  let enabled = true;
  try {
    enabled = window.localStorage.getItem(LS_KEY) !== "off";
  } catch {
    /* storage blocked */
  }
  snap = { ...snap, supported, enabled };
  if (!supported) return;
  pickVoice();
  window.speechSynthesis.addEventListener?.("voiceschanged", pickVoice);

  const unlock = () => {
    window.removeEventListener("pointerdown", unlock, true);
    window.removeEventListener("keydown", unlock, true);
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
    emit({ unlocked: true });
  };
  window.addEventListener("pointerdown", unlock, true);
  window.addEventListener("keydown", unlock, true);
}

function subscribe(cb: () => void) {
  init();
  listeners.add(cb);
  // pick up client values after hydration
  cb();
  return () => {
    listeners.delete(cb);
  };
}

function stopNow() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
  currentUtterance = null;
  if (snap.speaking || snap.owner !== null) emit({ speaking: false, owner: null });
}

export function useSpeech() {
  const s = useSyncExternalStore(subscribe, () => snap, () => SERVER_SNAP);
  const idRef = useRef<number>(0);
  if (idRef.current === 0) idRef.current = nextId++;
  const id = idRef.current;

  const stop = useCallback(() => stopNow(), []);

  /** speak(text): auto mode respects enabled+unlocked. speak(text, {force:true}) is for explicit taps. */
  const speak = useCallback((text: string, opts?: { force?: boolean }) => {
    init();
    if (!snap.supported || !text.trim()) return;
    const force = !!opts?.force;
    if (!force && (!snap.enabled || !snap.unlocked)) return;
    try {
      const synth = window.speechSynthesis;
      const busy = synth.speaking || synth.pending;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (!voice) pickVoice();
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang;
      } else {
        u.lang = "en-US";
      }
      u.rate = 0.95;
      u.pitch = 1.1;
      u.onstart = () => emit({ speaking: true });
      const done = () => {
        if (currentUtterance === u) {
          currentUtterance = null;
          emit({ speaking: false, owner: null });
        }
      };
      u.onend = done;
      u.onerror = done;
      currentUtterance = u;
      if (force && !snap.unlocked) emit({ unlocked: true, owner: id });
      else emit({ owner: id });
      // iOS Safari drops an utterance spoken in the same tick as cancel().
      if (busy) {
        setTimeout(() => {
          if (currentUtterance !== u) return;
          try {
            synth.speak(u);
          } catch {
            /* ignore */
          }
        }, 0);
      } else {
        synth.speak(u);
      }
    } catch {
      /* speech is a nicety; never break the page */
    }
  }, [id]);

  const setEnabled = useCallback((on: boolean) => {
    try {
      window.localStorage.setItem(LS_KEY, on ? "on" : "off");
    } catch {
      /* ignore */
    }
    if (!on) stopNow();
    emit({ enabled: on });
  }, []);

  // Cancel only speech this instance started when it unmounts (route change etc).
  useEffect(() => {
    return () => {
      if (snap.owner === id) stopNow();
    };
  }, [id]);

  return {
    supported: s.supported,
    enabled: s.enabled,
    unlocked: s.unlocked,
    speaking: s.speaking,
    speakingMine: s.speaking && s.owner === id,
    speak,
    stop,
    setEnabled,
  };
}
