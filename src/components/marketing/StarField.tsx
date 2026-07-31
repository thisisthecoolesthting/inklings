/**
 * Deterministic twinkling star field. Fixed coordinates keep SSR/CSR markup
 * identical (no hydration mismatch) and let stars sit exactly where the art
 * direction wants them.
 */

type Star = {
  x: number; // % from left
  y: number; // % from top
  size: number; // px
  delay: number; // s
  tone: "gold" | "coral" | "mint" | "cream";
};

const TONE_CLASS: Record<Star["tone"], string> = {
  gold: "bg-gold",
  coral: "bg-coral",
  mint: "bg-mint-600",
  cream: "bg-cream-200",
};

const STARS: Star[] = [
  { x: 4, y: 12, size: 3, delay: 0.2, tone: "gold" },
  { x: 11, y: 32, size: 2, delay: 1.4, tone: "coral" },
  { x: 7, y: 58, size: 2, delay: 2.6, tone: "mint" },
  { x: 15, y: 78, size: 3, delay: 0.9, tone: "gold" },
  { x: 21, y: 8, size: 2, delay: 2.1, tone: "mint" },
  { x: 27, y: 88, size: 2, delay: 1.8, tone: "coral" },
  { x: 33, y: 20, size: 2, delay: 3.1, tone: "gold" },
  { x: 39, y: 66, size: 3, delay: 0.5, tone: "mint" },
  { x: 45, y: 4, size: 2, delay: 2.8, tone: "coral" },
  { x: 52, y: 92, size: 2, delay: 1.1, tone: "gold" },
  { x: 58, y: 14, size: 3, delay: 2.4, tone: "mint" },
  { x: 63, y: 48, size: 2, delay: 0.7, tone: "gold" },
  { x: 69, y: 82, size: 2, delay: 3.4, tone: "coral" },
  { x: 74, y: 6, size: 2, delay: 1.6, tone: "mint" },
  { x: 80, y: 30, size: 3, delay: 2.9, tone: "gold" },
  { x: 86, y: 62, size: 2, delay: 0.3, tone: "coral" },
  { x: 91, y: 16, size: 2, delay: 2.2, tone: "mint" },
  { x: 95, y: 44, size: 3, delay: 1.9, tone: "gold" },
  { x: 97, y: 84, size: 2, delay: 3.7, tone: "coral" },
  { x: 18, y: 45, size: 2, delay: 3.3, tone: "gold" },
  { x: 48, y: 38, size: 2, delay: 1.2, tone: "mint" },
  { x: 71, y: 55, size: 2, delay: 2.0, tone: "gold" },
  { x: 88, y: 92, size: 2, delay: 0.8, tone: "mint" },
  { x: 30, y: 55, size: 2, delay: 2.5, tone: "coral" },
];

export function StarField({
  tone = "light",
  className = "",
}: {
  /** "night" recolors stars for dark plum sections */
  tone?: "light" | "night";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {STARS.map((s, i) => (
        <span
          key={i}
          className={`absolute rounded-full animate-twinkle ${
            tone === "night" ? "bg-cream-200" : TONE_CLASS[s.tone]
          }`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            boxShadow:
              tone === "night"
                ? "0 0 8px 1px rgba(251, 234, 201, 0.55)"
                : "0 0 8px 1px rgba(212, 165, 116, 0.45)",
          }}
        />
      ))}
    </div>
  );
}
