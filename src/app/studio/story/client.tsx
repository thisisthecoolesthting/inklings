"use client";

import { useState, useTransition } from "react";
import { SparkyChat } from "@/components/studio/SparkyChat";
import type { SparkyBeat, SparkyChoice } from "@/content/sparky-prompts";
import type { SparkyContext } from "@/lib/sparky";
import { submitStoryForApproval } from "./actions";

interface PersistedPage { text: string; imagePrompt: string }

export function StudioStoryClient({
  ctx,
  flow,
  childId,
}: {
  ctx: SparkyContext;
  flow: SparkyBeat[];
  childId: string;
}) {
  const [beatIdx, setBeatIdx] = useState(0);
  const [pages, setPages] = useState<PersistedPage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [bookId, setBookId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const beat = flow[beatIdx];
  const done = beatIdx >= flow.length;

  async function pick(choice: SparkyChoice) {
    setThinking(true);
    const res = await fetch("/api/sparky/beat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        beatId: beat.id,
        choiceId: choice.id,
        ctx: { ...ctx, storyState: pages.length === 0 ? [] : ctx.storyState.concat({ beatId: beat.id, choiceId: choice.id }) },
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { paragraph: string; imagePrompt: string };
      setPages((p) => [...p, { text: data.paragraph, imagePrompt: data.imagePrompt }]);
    }
    setBeatIdx((i) => i + 1);
    setThinking(false);
  }

  function handleSubmit() {
    setSubmitState("submitting");
    const titleHero = ctx.characters[0]?.name ?? ctx.childName;
    const title = `${titleHero} and the Big Day`;
    startTransition(async () => {
      const result = await submitStoryForApproval({
        childId,
        title,
        pages: pages.map((p) => ({ text: p.text, imagePrompt: p.imagePrompt, act: "story" })),
      });
      if ("ok" in result && result.ok) {
        setBookId(result.bookId);
        setSubmitState("submitted");
      } else {
        setSubmitState("error");
      }
    });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-ink">The end!</h2>
        <p className="mt-3 text-ink-700">
          {submitState === "submitted"
            ? "Sparky sent your story to your grown-up to look over."
            : "Tap the button to send your story to your grown-up."}
        </p>
        <ol className="mt-8 space-y-4 text-left">
          {pages.map((p, i) => (
            <li key={i} className="card-base">
              <span className="text-xs font-semibold uppercase tracking-wider text-coral">Page {i + 1}</span>
              <p className="mt-2 text-lg text-ink">{p.text}</p>
            </li>
          ))}
        </ol>
        {submitState === "idle" && (
          <button onClick={handleSubmit} className="btn-primary btn-large mt-10 inline-flex">
            Show grown-up
          </button>
        )}
        {submitState === "submitting" && (
          <button disabled className="btn-primary btn-large mt-10 inline-flex opacity-60">
            Sending…
          </button>
        )}
        {submitState === "submitted" && (
          <div className="mt-10">
            <div className="card-base inline-block bg-mint-100">
              <p className="text-ink-700">Saved to your grown-up&apos;s queue. Story id: <code className="text-xs">{bookId?.slice(0, 8)}</code></p>
            </div>
          </div>
        )}
        {submitState === "error" && (
          <p className="mt-6 text-coral">Something went wrong saving the story. Please try again.</p>
        )}
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
