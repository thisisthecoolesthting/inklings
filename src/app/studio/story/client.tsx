"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { SparkyChat } from "@/components/studio/SparkyChat";
import { StoryPageCard } from "@/components/studio/StoryPageCard";
import type { SparkyBeat, SparkyChoice } from "@/content/sparky-prompts";
import type { SparkyContext } from "@/lib/sparky";
import { submitStoryForApproval } from "./actions";

interface PersistedPage {
  text: string;
  imagePrompt: string;
  imageUrl: string | null;
}

/** Kids need time to discover and play the wait game before the next beat. */
const MIN_WAIT_MS = 4500;

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
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
  const [pendingPage, setPendingPage] = useState<PersistedPage | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [submittedBookId, setSubmittedBookId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const pagesEndRef = useRef<HTMLDivElement>(null);

  const beat = flow[beatIdx];
  const done = beatIdx >= flow.length;

  useEffect(() => {
    pagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [pages.length, pendingPage?.text, pendingPage?.imageUrl]);

  async function pick(choice: SparkyChoice) {
    if (showGame) return;

    const started = Date.now();
    setPendingPage({
      text: "Sparky is writing this page…",
      imagePrompt: "",
      imageUrl: null,
    });
    setShowGame(true);

    let newPage: PersistedPage | null = null;
    try {
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
        const data = (await res.json()) as {
          paragraph: string;
          imagePrompt: string;
          imageUrl: string | null;
        };
        newPage = {
          text: data.paragraph,
          imagePrompt: data.imagePrompt,
          imageUrl: data.imageUrl ?? null,
        };
        setPendingPage(newPage);
      }
    } catch {
      /* keep pending placeholder; advance anyway */
    }

    const elapsed = Date.now() - started;
    if (elapsed < MIN_WAIT_MS) {
      await sleep(MIN_WAIT_MS - elapsed);
    }

    if (newPage) {
      setPages((p) => [...p, newPage!]);
    }
    setPendingPage(null);
    setBeatIdx((i) => i + 1);
    setShowGame(false);
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
            <li key={i}>
              <StoryPageCard
                pageNumber={i + 1}
                imageUrl={p.imageUrl}
                text={p.text}
                imageAlt={`illustration for page ${i + 1}`}
                textSize="xl"
              />
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
          <div className="mt-10 space-y-4">
            <div className="card-base inline-block bg-mint-100">
              <p className="text-ink-700">
                Ask your grown-up to open their <strong>Approvals</strong> page — your book is waiting there!
              </p>
            </div>
            <div className="card-base border-2 border-coral/30 bg-cream-50">
              <p className="text-lg font-bold text-ink">Want a real book in your hands?</p>
              <p className="mt-2 text-sm text-ink-600">
                Ask a grown-up to help you order a hardcover version of your story!
              </p>
              <Link
                href={`/grownup?intent=print${submittedBookId ? `&book=${submittedBookId}` : ""}`}
                className="btn-secondary mt-4 inline-flex"
              >
                Get a grown-up to help
              </Link>
            </div>
          </div>
        )}
        {submitState === "error" && (
          <div className="mt-8 card-base border-coral/20 bg-coral-50">
            <p className="font-bold text-ink">Oh no! Sparky had a little trouble saving your story.</p>
            <button onClick={() => setSubmitState("idle")} className="btn-primary mt-4">
              Try again
            </button>
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/studio" className="btn-ghost">
            Back to Sparky
          </Link>
          <Link href="/library" className="btn-ghost">
            My collection
          </Link>
          {submitState === "submitted" && (
            <Link href={`/studio/story?child=${childId}`} className="btn-primary">
              Start another story
            </Link>
          )}
        </div>
      </div>
    );
  }

  const displayPages: Array<{ page: PersistedPage; pending: boolean; key: string }> = [
    ...pages.map((p, i) => ({ page: p, pending: false, key: `done-${i}` })),
    ...(pendingPage ? [{ page: pendingPage, pending: true, key: "pending" }] : []),
  ];

  return (
    <>
      {(displayPages.length > 0 || showGame) && (
        <div className="mx-auto mb-8 max-w-2xl space-y-4">
          {displayPages.map(({ page, pending, key }, i) => (
            <StoryPageCard
              key={key}
              pageNumber={i + 1}
              imageUrl={page.imageUrl}
              text={page.text}
              imageAlt={`Story page ${i + 1} illustration`}
              imagePending={pending && !page.imageUrl}
              textPending={pending && page.text.startsWith("Sparky is")}
              textSize="xl"
            />
          ))}
          <div ref={pagesEndRef} />
        </div>
      )}
      <SparkyChat
        beat={beat}
        onChoose={pick}
        waiting={showGame}
        pageNumber={pages.length + (pendingPage ? 1 : 0)}
        isFirstPage={pages.length === 0 && showGame}
      />
    </>
  );
}
