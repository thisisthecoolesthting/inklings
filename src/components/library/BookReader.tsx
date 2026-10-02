"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, Square } from "lucide-react";
import { StoryPageCard } from "@/components/studio/StoryPageCard";
import { useSpeech } from "@/components/studio/use-speech";

interface Page {
  pageNumber: number;
  textContent: string;
  imageUrl: string | null;
}

const SWIPE_PX = 50;

export function BookReader({ title, pages }: { title: string; pages: Page[] }) {
  const [idx, setIdx] = useState(0);
  const page = pages[idx];
  const atStart = idx === 0;
  const atEnd = idx >= pages.length - 1;
  const { speak, stop, speakingMine: speaking, supported, enabled, unlocked } = useSpeech();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback(
    (delta: number) => {
      setIdx((i) => Math.min(pages.length - 1, Math.max(0, i + delta)));
    },
    [pages.length],
  );

  // Preload neighbouring page images.
  useEffect(() => {
    for (const n of [idx + 1, idx - 1]) {
      const url = pages[n]?.imageUrl;
      if (url) {
        const img = new window.Image();
        img.src = url;
      }
    }
  }, [idx, pages]);

  // Arrow keys.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Auto-read on page turn when read-aloud is on (auto mode only fires once audio is unlocked by a tap).
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (enabled && unlocked && page) speak(page.textContent);
    else stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  if (!page) {
    return <p className="text-center text-ink-600">This book has no pages yet.</p>;
  }

  const pct = Math.round(((idx + 1) / pages.length) * 100);

  return (
    <div className="mx-auto flex h-[calc(100dvh-11rem)] min-h-[26rem] max-w-2xl flex-col">
      <h1 className="truncate text-center text-xl font-bold text-ink">{title}</h1>
      <div className="mt-1 flex items-center gap-3">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-cream-200"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={pages.length}
          aria-valuenow={idx + 1}
          aria-label="Book progress"
        >
          <div className="h-full rounded-full bg-coral transition-all motion-reduce:transition-none" style={{ width: `${pct}%` }} />
        </div>
        <p className="flex-none text-sm text-ink-500" aria-live="polite">
          Page {idx + 1} of {pages.length}
        </p>
      </div>

      <div
        className="mt-3 min-h-0 flex-1 select-none"
        style={{ touchAction: "pan-y" }}
        onDragStart={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          touchStart.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const s = touchStart.current;
          touchStart.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          const dy = e.clientY - s.y;
          if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => {
          touchStart.current = null;
        }}
      >
        <StoryPageCard
          fill
          hideReadButton
          pageNumber={page.pageNumber}
          imageUrl={page.imageUrl}
          text={page.textContent}
          imageAlt={`Page ${page.pageNumber} illustration`}
        />
      </div>

      <div className="mt-3 flex items-stretch gap-2">
        <button
          type="button"
          disabled={atStart}
          onClick={() => go(-1)}
          className="big-button-mint flex-1 !min-h-[64px] !px-4 !py-3 !text-xl disabled:opacity-40"
        >
          ← Back
        </button>
        {supported && (
          <button
            type="button"
            onClick={() => (speaking ? stop() : speak(page.textContent, { force: true }))}
            aria-label={speaking ? "Stop reading" : "Read this page to me"}
            className="flex h-16 w-16 flex-none items-center justify-center rounded-card bg-gold/30 text-ink hover:bg-gold/50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-coral motion-safe:active:scale-95"
          >
            {speaking ? <Square className="h-7 w-7" aria-hidden /> : <Volume2 className="h-8 w-8" aria-hidden />}
          </button>
        )}
        <button
          type="button"
          disabled={atEnd}
          onClick={() => go(1)}
          className="big-button flex-1 !min-h-[64px] !px-4 !py-3 !text-xl disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
