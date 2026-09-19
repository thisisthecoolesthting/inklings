/**
 * Two-panel "generic chatbot vs. Sparky" comparison. Pure SVG/CSS — no new
 * image assets. Full-size on /security, and reused at `compact` size in the
 * homepage FAQ/trust section.
 */
export function SafetyComparison({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${compact ? "max-w-3xl mx-auto" : ""}`}>
      {/* Left: generic AI chatbot */}
      <div className="card-base flex flex-col border-red-200/70">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-red-100 text-red-500" aria-hidden>
            ✕
          </span>
          <p className="text-sm font-bold uppercase tracking-wide text-red-500">Not this</p>
        </div>
        <h3 className={`mt-3 font-bold text-ink ${compact ? "text-lg" : "text-xl"}`}>
          A generic AI chatbot
        </h3>
        <p className="mt-2 text-sm text-ink-600">
          An open text box a child types anything into, talking to a system with no guardrails
          on what it can be asked or told.
        </p>

        {/* Chat-bubble mock with blinking cursor */}
        <div className="mt-5 flex-1 rounded-card border border-red-100 bg-red-50/50 p-4">
          <div className="mb-3 flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-white px-3 py-2 text-xs text-ink-600 shadow-sm">
              hi can u be my friend and tell me a secret
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-ink-200/60 px-3 py-2 text-xs text-ink-700 shadow-sm">
              <span aria-hidden>Sure! Let&apos;s chat about anything you&apos;d like</span>
              <span className="ml-0.5 inline-block h-3 w-[2px] motion-safe:animate-pulse bg-ink-500 align-middle" aria-hidden />
              <span className="sr-only">An open-ended chatbot reply, still generating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Sparky */}
      <div className="card-base flex flex-col border-mint-400 ring-2 ring-mint-400">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-mint-500 text-white" aria-hidden>
            ✓
          </span>
          <p className="text-sm font-bold uppercase tracking-wide text-mint-600">This is Sparky</p>
        </div>
        <h3 className={`mt-3 font-bold text-ink ${compact ? "text-lg" : "text-xl"}`}>
          A bounded, branching guide
        </h3>
        <p className="mt-2 text-sm text-ink-600">
          Kids never type freely to an open model. Every beat is a small set of
          parent-safe, story-relevant choices Sparky offers.
        </p>

        {/* Real chip-button UI pattern */}
        <div className="mt-5 flex-1 rounded-card border border-mint-200 bg-mint-50/60 p-4">
          <p className="text-sm font-semibold text-ink">Sparky: Where should the adventure start?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="sparky-chip !min-h-0 !py-2 !px-4 !text-sm">🏰 A castle</span>
            <span className="sparky-chip !min-h-0 !py-2 !px-4 !text-sm">🌊 Under the sea</span>
            <span className="sparky-chip !min-h-0 !py-2 !px-4 !text-sm">🚀 Outer space</span>
          </div>
        </div>
      </div>
    </div>
  );
}
