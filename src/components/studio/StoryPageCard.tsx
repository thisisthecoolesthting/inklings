"use client";

import { Volume2, Square } from "lucide-react";
import { useSpeech } from "./use-speech";

/**
 * Story page layout for studio reveal, library, and approvals.
 * Illustration lives in its own art zone; text is always below — never overlaid.
 */
export function StoryPageCard({
  pageNumber,
  imageUrl,
  text,
  imageAlt,
  imagePending = false,
  textPending = false,
  textSize = "lg",
  fill = false,
  hideReadButton = false,
}: {
  pageNumber?: number;
  imageUrl?: string | null;
  text: string;
  imageAlt: string;
  imagePending?: boolean;
  textPending?: boolean;
  textSize?: "sm" | "lg" | "xl";
  /** Fill the parent's height: image shrinks (object-contain), text/button stay visible. Used by BookReader. */
  fill?: boolean;
  /** Hide the built-in "Read to me" button (parent provides its own). */
  hideReadButton?: boolean;
}) {
  const { speak, stop, speakingMine: reading, supported } = useSpeech();
  const textClass =
    textSize === "sm" ? "text-sm leading-relaxed" : textSize === "xl" ? "text-xl" : "text-lg leading-relaxed";

  return (
    <article
      className={`overflow-hidden rounded-card border bg-cream-50 transition-shadow ${fill ? "flex h-full min-h-0 flex-col " : ""}${
        imagePending || textPending ? "border-coral/30 shadow-md ring-2 ring-coral/10" : "border-ink-100"
      }`}
    >
      {pageNumber != null && (
        <span className="block px-4 pt-3 text-xs font-semibold uppercase tracking-wider text-coral">
          Page {pageNumber}
          {(imagePending || textPending) && (
            <span className="ml-2 normal-case tracking-normal text-ink-500">· coming to life…</span>
          )}
        </span>
      )}

      <div
        className={`relative w-full bg-cream-100 ${pageNumber != null ? "mx-4 mt-2 max-w-[calc(100%-2rem)] rounded-card" : ""} ${fill ? "min-h-0 flex-1" : ""}`}
        style={fill ? undefined : { aspectRatio: "4 / 3" }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full rounded-card object-contain"
            width={768}
            height={576}
          />
        ) : imagePending ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="h-10 w-10 animate-pulse rounded-full bg-mint-200" aria-hidden />
            <p className="text-sm font-medium text-ink-600">Sparky is painting…</p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-500">Illustration coming soon</div>
        )}
      </div>

      <div className={`mt-0 border-t-2 border-coral/20 px-4 py-3 ${fill ? "max-h-[38%] flex-none overflow-y-auto" : ""}`}>
        {textPending ? (
          <p className={`${textClass} animate-pulse text-ink-500`}>{text || "Sparky is writing…"}</p>
        ) : (
          <p className={`${textClass} text-ink`}>{text}</p>
        )}
        {supported && !hideReadButton && !textPending && text && (
          <button
            type="button"
            onClick={() => {
              if (reading) stop();
              else {
                speak(text, { force: true });
              }
            }}
            aria-label={reading ? "Stop reading" : "Read this page to me"}
            className="mt-3 flex min-h-[64px] w-full items-center justify-center gap-3 rounded-2xl bg-gold/30 px-5 text-lg font-bold text-ink hover:bg-gold/50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-coral motion-safe:active:scale-95"
          >
            {reading ? <Square className="h-6 w-6" aria-hidden /> : <Volume2 className="h-7 w-7" aria-hidden />}
            <span>{reading ? "Stop" : "Read to me"}</span>
          </button>
        )}
      </div>
    </article>
  );
}
