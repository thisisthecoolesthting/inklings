"use client";

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
}: {
  pageNumber?: number;
  imageUrl?: string | null;
  text: string;
  imageAlt: string;
  imagePending?: boolean;
  textPending?: boolean;
  textSize?: "sm" | "lg" | "xl";
}) {
  const textClass =
    textSize === "sm" ? "text-sm leading-relaxed" : textSize === "xl" ? "text-xl" : "text-lg leading-relaxed";

  return (
    <article
      className={`overflow-hidden rounded-card border bg-cream-50 transition-shadow ${
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
        className={`relative w-full bg-cream-100 ${pageNumber != null ? "mx-4 mt-2 max-w-[calc(100%-2rem)] rounded-card" : ""}`}
        style={{ aspectRatio: "4 / 3" }}
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

      <div className="mt-0 border-t-2 border-coral/20 px-4 py-4">
        {textPending ? (
          <p className={`${textClass} animate-pulse text-ink-500`}>{text || "Sparky is writing…"}</p>
        ) : (
          <p className={`${textClass} text-ink`}>{text}</p>
        )}
      </div>
    </article>
  );
}
