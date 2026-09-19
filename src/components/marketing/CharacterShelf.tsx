/**
 * Illustrated "bookshelf" of accumulating book spines — visualizes the
 * persistent character family / series-memory pitch: the same characters
 * return, book after book, month after month.
 *
 * CSS/SVG shapes only (colored spines + brand palette), no new illustration
 * assets. Full-size on /features/character-bible, echoed smaller on
 * /pricing (Premium) and /gift.
 */

interface Spine {
  label: string;
  month: string;
  color: string;
  height: number; // px
}

const SPINES: Spine[] = [
  { label: "Book 1", month: "Jan", color: "#F4815C", height: 116 },
  { label: "Book 2", month: "Feb", color: "#A8DDB5", height: 128 },
  { label: "Book 3", month: "Mar", color: "#D4A574", height: 108 },
  { label: "Book 4", month: "Apr", color: "#7D506E", height: 132 },
  { label: "Book 5", month: "Jun", color: "#F69A7C", height: 118 },
  { label: "Book 6", month: "Aug", color: "#7FCB91", height: 124 },
];

function Spine({ spine, compact }: { spine: Spine; compact: boolean }) {
  const width = compact ? 34 : 44;
  const height = compact ? spine.height * 0.72 : spine.height;
  return (
    <div
      className="group relative flex flex-none flex-col items-center justify-end rounded-t-[2px] rounded-b-[3px] shadow-[inset_-3px_0_0_rgba(0,0,0,0.12),0_3px_6px_rgba(74,37,69,0.18)] transition-transform duration-300 motion-safe:hover:-translate-y-1.5"
      style={{ width, height, background: spine.color }}
      role="img"
      aria-label={`${spine.label}, ${spine.month}`}
    >
      <span
        className="mb-2 text-[9px] font-bold uppercase tracking-wide text-white/90"
        style={{ writingMode: "vertical-rl" }}
        aria-hidden
      >
        {spine.label}
      </span>
      <span className="absolute -bottom-5 whitespace-nowrap text-[10px] font-semibold text-ink-500">
        {spine.month}
      </span>
    </div>
  );
}

export function CharacterShelf({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "mx-auto max-w-xl" : "mx-auto max-w-2xl"}>
      <div className="rounded-card border border-ink-100 bg-white/70 px-6 pb-8 pt-6 shadow-card">
        <div
          role="group"
          aria-label="A bookshelf of six books, all starring the same character family"
          className="flex items-end justify-center gap-2 overflow-x-auto pb-1"
        >
          {SPINES.map((s) => (
            <Spine key={s.label} spine={s} compact={compact} />
          ))}
        </div>
        {/* Shelf board */}
        <div
          className="mt-3 h-3 w-full rounded-[3px] bg-gold-600 shadow-[0_4px_8px_rgba(74,37,69,0.2)]"
          aria-hidden
        />
      </div>
      <p className="mt-3 text-center text-sm text-ink-600">
        Same characters, one shelf that keeps growing — a new book every time they play.
      </p>
    </div>
  );
}
