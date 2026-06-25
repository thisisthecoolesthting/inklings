"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function GrownupHoldButton({ redirectPath = "/portal" }: { redirectPath?: string }) {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  function clearTimer() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setProgress(0);
  }

  function startHold() {
    if (busy) return;
    setProgress(0);
    const started = Date.now();
    const tick = () => {
      const p = Math.min(100, ((Date.now() - started) / 2000) * 100);
      setProgress(p);
      if (p < 100) timer.current = setTimeout(tick, 50);
    };
    tick();
    timer.current = setTimeout(async () => {
      setBusy(true);
      try {
        const res = await fetch("/api/mode/grownup-unlock", { method: "POST" });
        if (res.ok) router.push(redirectPath);
        else setBusy(false);
      } catch {
        setBusy(false);
      }
      clearTimer();
    }, 2000);
  }

  return (
    <button
      type="button"
      onPointerDown={startHold}
      onPointerUp={clearTimer}
      onPointerLeave={clearTimer}
      disabled={busy}
      className="relative w-full overflow-hidden rounded-card bg-ink px-6 py-5 text-lg font-semibold text-cream"
    >
      <span className="relative z-10">{busy ? "Opening…" : "Hold for grown-ups"}</span>
      <span className="absolute inset-y-0 left-0 bg-coral transition-all" style={{ width: `${progress}%` }} aria-hidden />
    </button>
  );
}
