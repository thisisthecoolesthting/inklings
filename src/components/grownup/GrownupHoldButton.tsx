"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function GrownupHoldButton({ redirectPath = "/portal" }: { redirectPath?: string }) {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (tickTimer.current) clearTimeout(tickTimer.current);
      timer.current = null;
      tickTimer.current = null;
    },
    [],
  );

  function clearTimer() {
    if (timer.current) clearTimeout(timer.current);
    if (tickTimer.current) clearTimeout(tickTimer.current);
    timer.current = null;
    tickTimer.current = null;
    setProgress(0);
  }

  function startHold() {
    if (busy || timer.current) return;
    setProgress(0);
    const started = Date.now();
    const tick = () => {
      const p = Math.min(100, ((Date.now() - started) / 2000) * 100);
      setProgress(p);
      if (p < 100) tickTimer.current = setTimeout(tick, 50);
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
      onPointerDown={(e) => {
        // Keep the pointer captured so a finger drifting a few px does not cancel the hold.
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }
        startHold();
      }}
      onPointerUp={clearTimer}
      onPointerCancel={clearTimer}
      onLostPointerCapture={clearTimer}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key !== " " && e.key !== "Enter") return;
        e.preventDefault();
        if (!e.repeat) startHold();
      }}
      onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") clearTimer(); }}
      onBlur={clearTimer}
      style={{ touchAction: "none", WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none" }}
      disabled={busy}
      className="relative min-h-[64px] w-full select-none overflow-hidden rounded-card bg-ink px-6 py-5 text-lg font-semibold text-cream"
    >
      <span className="relative z-10">{busy ? "Opening…" : "Hold for grown-ups"}</span>
      <span className="absolute inset-y-0 left-0 bg-coral transition-all" style={{ width: `${progress}%` }} aria-hidden />
    </button>
  );
}
