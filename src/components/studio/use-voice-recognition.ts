"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type VoiceState = "idle" | "listening" | "matched" | "no-match" | "unsupported" | "denied";

interface VoiceResult {
  transcript: string;
  confidence: number;
}

export function useVoiceRecognition(opts?: { lang?: string; timeoutMs?: number }) {
  const [state, setState] = useState<VoiceState>("idle");
  const [lastResult, setLastResult] = useState<VoiceResult | null>(null);
  const recogRef = useRef<any>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect support once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) setState("unsupported");
  }, []);

  const start = useCallback(async () => {
    if (state === "listening") return;
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setState("unsupported"); return; }

    // Permission probe — kicks OS prompt if not yet granted
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
    } catch {
      setState("denied");
      return;
    }

    const recog = new SR();
    recog.lang = opts?.lang ?? navigator.language ?? "en-US";
    recog.continuous = false;
    recog.interimResults = false;
    recog.maxAlternatives = 3;

    recog.onresult = (e: any) => {
      const r = e.results?.[0]?.[0];
      if (r) setLastResult({ transcript: r.transcript, confidence: r.confidence ?? 0 });
    };
    recog.onerror = () => setState("idle");
    recog.onend = () => {
      setState((prev) => (prev === "listening" ? "idle" : prev));
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    };

    recogRef.current = recog;
    setState("listening");
    setLastResult(null);
    recog.start();
    timeoutRef.current = setTimeout(() => {
      try { recog.stop(); } catch {}
    }, opts?.timeoutMs ?? 6000);
  }, [opts?.lang, opts?.timeoutMs, state]);

  const stop = useCallback(() => {
    try { recogRef.current?.stop(); } catch {}
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  }, []);

  return { state, setState, lastResult, start, stop, isSupported: state !== "unsupported" };
}
