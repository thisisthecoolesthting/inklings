const ACTS = [
  { id: "beginning", label: "Start", emoji: "🌅" },
  { id: "problem", label: "Uh-oh", emoji: "😮" },
  { id: "adventure", label: "Go!", emoji: "🚀" },
  { id: "resolution", label: "Fix it", emoji: "💡" },
  { id: "celebration", label: "Yay!", emoji: "🎉" },
];

export function StoryActProgress({
  currentAct,
  className = "",
}: {
  currentAct: string;
  className?: string;
}) {
  const idx = ACTS.findIndex((a) => a.id === currentAct);
  return (
    <ol className={`mb-6 flex w-full items-center gap-1 sm:gap-2 ${className}`.trim()}>
      {ACTS.map((a, i) => {
        const done = i < idx;
        const here = i === idx;
        return (
          <li key={a.id} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={
                "flex h-11 w-11 items-center justify-center rounded-full text-lg " +
                (done ? "bg-mint-500 text-white" : here ? "bg-coral text-white shadow-md" : "bg-cream-200 text-ink-500")
              }
              aria-current={here ? "step" : undefined}
            >
              <span aria-hidden>{done ? "✓" : a.emoji}</span>
            </div>
            <span className={"text-xs sm:text-sm " + (here ? "font-bold text-ink" : "text-ink-500")}>{a.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
