"use client";

import { useState } from "react";
import { SparkyChat } from "@/components/studio/SparkyChat";
import type { SparkyBeat, SparkyChoice } from "@/content/sparky-prompts";
import type { SparkyContext } from "@/lib/sparky";

export function StudioStoryClient({ ctx, flow }: { ctx: SparkyContext; flow: SparkyBeat[] }) {
  const [beatIdx, setBeatIdx] = useState(0);
  const [pages, setPages] = useState<{ text: string; imagePrompt: string }[]>([]);
  const [thinking, setThinking] = useState(false);

  const beat = flow[beatIdx];
  const done = beatIdx >= flow.length;

  async function pick(choice: SparkyChoice) {
    setThinking(true);
    const res = await fetch("/api/sparky/beat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beatId: beat.id, choiceId: choice.id, ctx }),
    });
    if (res.ok) {
      const data = (await res.json()) as { paragraph: string; imagePrompt: string };
      setPages((p) => [...p, { text: data.paragraph, imagePrompt: data.imagePrompt }]);
    }
    setBeatIdx((i) => i + 1);
    setThinking(false);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-ink">The end!</h2>
        <p className="mt-3 text-ink-700">Sparky is sending your story to mom or dad to look over.</p>
        <ol className="mt-8 space-y-4 text-left">
          {pages.map((p, i) => (
            <li key={i} className="card-base">
              <span className="text-xs font-semibold uppercase tracking-wider text-coral">Page {i + 1}</span>
              <p className="mt-2 text-lg text-ink">{p.text}</p>
            </li>
          ))}
        </ol>
        <a href="/portal/approvals" className="btn-primary btn-large mt-10 inline-flex">
          Show grown-up
        </a>
      </div>
    );
  }

  return (
    <>
      {pages.length > 0 && (
        <div className="mx-auto mb-8 max-w-2xl space-y-4">
          {pages.map((p, i) => (
            <div key={i} className="card-base bg-cream-50">
              <p className="text-base text-ink">{p.text}</p>
            </div>
          ))}
        </div>
      )}
      <SparkyChat beat={beat} onChoose={pick} thinking={thinking} />
    </>
  );
}
