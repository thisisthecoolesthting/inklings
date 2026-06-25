"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { SparkyChat } from "@/components/studio/SparkyChat";
import type { SparkyBeat, SparkyChoice } from "@/content/sparky-prompts";
import type { SparkyContext } from "@/lib/sparky";
import { submitStoryForApproval } from "./actions";

interface PersistedPage { text: string; imagePrompt: string; imageUrl: string | null }

function StoryIllustration({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="mb-3 w-full rounded-card border border-ink-100" width={512} height={512} />
  );
}

export function StudioStoryClient({
  ctx,
  flow,
  childId,
  seriesId,
  variantKey,
}: {
  ctx: SparkyContext;
  flow: SparkyBeat[];
  childId: string;
  seriesId: string;
  variantKey: string;
}) {
  const [beatIdx, setBeatIdx] = useState(0);
  const [pages, setPages] = useState<PersistedPage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [submittedBookId, setSubmittedBookId] = useState<string | null>(null);
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
        variantKey,
        ctx: { ...ctx, storyState: ctx.storyState.concat({ beatId: beat.id, choiceId: choice.id }) },
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { paragraph: string; imagePrompt: string; imageUrl: string | null };
      setPages((p) => [...p, { text: data.paragraph, imagePrompt: data.imagePrompt, imageUrl: data.imageUrl ?? null }]);
    }
    setBeatIdx((i) => i + 1);
    setThinking(false);
  }

  function handleSubmit() {
    setSubmitState("submitting");
    const hero = ctx.characters[0]?.name ?? ctx.childName;
    const friend = ctx.characters[1]?.name;
    const title = friend ? `${hero} and ${friend}` : `${hero}'s Adventure`;
    startTransition(async () => {
      const result = await submitStoryForApproval({
        childId,
        seriesId,
        variantKey,
        title,
        pages: pages.map((p) => ({
          text: p.text,
          imagePrompt: p.imagePrompt,
          imageUrl: p.imageUrl,
          act: "story",
        })),
      });
      if ("ok" in result && result.ok) {
        setSubmitState("submitted");
        setSubmittedBookId(result.bookId);
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
        <ol className="mt-8 space-y-6 text-left">
          {pages.map((p, i) => (
            <li key={i} className="card-base">
              <span className="text-xs font-semibold uppercase tracking-wider text-coral">Page {i + 1}</span>
              {p.imageUrl && <StoryIllustration src={p.imageUrl} alt={`illustration for page ${i + 1}`} />}
              <p className="mt-3 text-xl text-ink">{p.text}</p>
            </li>
          ))}
        </ol>
        {submitState === "idle" && (
          <button onClick={handleSubmit} className="btn-primary btn-large mt-10 inline-flex">Show grown-up</button>
        )}
        {submitState === "submitting" && (
          <button disabled className="btn-primary btn-large mt-10 inline-flex opacity-60">Sending…</button>
        )}
        {submitState === "submitted" && (
          <div className="mt-10 space-y-4">
            <div className="card-base inline-block bg-mint-100">
              <p className="text-ink-700">Your grown-up can approve it. It will land on your collection shelf!</p>
            </div>
            <div className="card-base border-2 border-coral/30 bg-cream-50">
              <p className="text-lg font-bold text-ink">Want a real book in your hands?</p>
              <p className="mt-2 text-sm text-ink-600">Ask a grown-up to order a hardcover after they approve your story.</p>
              <Link
                href={`/grownup?intent=print${submittedBookId ? `&book=${submittedBookId}` : ""}`}
                className="btn-primary mt-4 inline-flex"
              >
                Print this book
              </Link>
            </div>
          </div>
        )}
        {submitState === "error" && (
          <div className="mt-8 card-base bg-coral-50 border-coral/20">
            <p className="text-ink font-bold">Oh no! Sparky had a little trouble saving your story.</p>
            <button onClick={() => setSubmitState('idle')} className="btn-primary mt-4">Try again</button>
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/studio" className="btn-ghost">Back to Sparky</Link>
          <Link href="/library" className="btn-ghost">My collection</Link>
          {submitState === "submitted" && (
            <Link href={`/studio/story?child=${childId}`} className="btn-primary">Start another story</Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {pages.length > 0 && (
        <div className="mx-auto mb-8 max-w-2xl space-y-4">
          {pages.map((p, i) => (
            <div key={i} className="card-base bg-cream-50">
              {p.imageUrl ? (
                <StoryIllustration src={p.imageUrl} alt={`Story page ${i + 1} illustration`} />
              ) : (
                i === pages.length - 1 && <p className="mb-3 text-sm italic text-ink-500">Sparky is writing and painting…</p>
              )}
              <p className="text-xl text-ink">{p.text}</p>
            </div>
          ))}
        </div>
      )}
      <SparkyChat beat={beat} onChoose={pick} thinking={thinking} />
    </>
  );
}
