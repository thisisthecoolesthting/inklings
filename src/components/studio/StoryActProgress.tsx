const ACTS = [
  { id: "beginning", label: "Beginning" },
  { id: "problem", label: "Problem" },
  { id: "adventure", label: "Adventure" },
  { id: "resolution", label: "Resolution" },
  { id: "celebration", label: "Celebration" },
];

export function StoryActProgress({ currentAct }: { currentAct: string }) {
  const idx = ACTS.findIndex((a) => a.id === currentAct);
  return (
    <ol className="mb-8 flex w-full items-center gap-2">
      {ACTS.map((a, i) => {
        const done = i < idx;
        const here = i === idx;
        return (
          <li key={a.id} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold " +
                (done ? "bg-mint-500 text-white" : here ? "bg-coral text-white" : "bg-cream-200 text-ink-500")
              }
            >
              {i + 1}
            </div>
            <span className={"text-xs " + (here ? "font-bold text-ink" : "text-ink-500")}>{a.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
