"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { SparkyChat } from "@/components/studio/SparkyChat";
import { StoryPageCard } from "@/components/studio/StoryPageCard";
import { StoryActProgress } from "@/components/studio/StoryActProgress";
import type { SparkyBeat, SparkyChoice } from "@/content/sparky-prompts";
import type { SparkyContext } from "@/lib/sparky";
import { titleFromChoices, type SeriesChoice } from "@/lib/series-bible";
import { submitStoryForApproval } from "./actions";

interface PersistedPage {
  text: string;
  imagePrompt: string;
  imageUrl: string | null;
  act: string;
}

const MIN_WAIT_MS = 2800;

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
  const [choices, setChoices] = useState<SeriesChoice[]>([]);
  const [pendingPage, setPendingPage] = useState<PersistedPage | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [submittedBookId, setSubmittedBookId] = useState<string | null>(null);
  const [savedTitle, setSavedTitle] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const pagesEndRef = useRef<HTMLDivElement>(null);

  const beat = flow[beatIdx];
  const done = beatIdx >= flow.length;
  const currentAct = beat?.act ?? "celebration";

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
      act: beat.act,
    });
    setShowGame(true);

    const nextChoice: SeriesChoice = { beatId: beat.id, choiceId: choice.id, label: choice.label };
    const nextChoices = [...choices, nextChoice];
    let newPage: PersistedPage | null = null;
    try {
      const res = await fetch("/api/sparky/beat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beatId: beat.id,
          choiceId: choice.id,
          variantKey,
          ctx: {
            ...ctx,
            pagesSoFar: pages.map((p) => p.text),
            storyState: nextChoices,
          },
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
          act: beat.act,
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

    setChoices(nextChoices);
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
    const pal = ctx.characters[1]?.name;
    const title = titleFromChoices({
      hero,
      friend: pal,
      choices,
      bookNumber: ctx.bookNumber,
    });
    startTransition(async () => {
      const result = await submitStoryForApproval({
        childId,
        seriesId,
        variantKey,
        title,
        choices,
        pages: pages.map((p) => ({
          text: p.text,
          imagePrompt: p.imagePrompt,
          imageUrl: p.imageUrl,
          act: p.act,
        })),
      });
      if ("ok" in result && result.ok) {
        setSubmitState("submitted");
        setSubmittedBookId(result.bookId);
        setSavedTitle(result.title);
      } else {
        setSubmitState("error");
      }
    });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-5xl" aria-hidden>
          🎉
        </p>
        <h2 className="mt-3 text-3xl font-bold text-ink">The end!</h2>
        <p className="mt-3 text-xl text-ink-700">
          {submitState === "submitted"
            ? `“${savedTitle}” is ready for a grown-up to look at.`
            : "Tap the big button so a grown-up can see your book."}
        </p>
        <StoryActProgress currentAct="celebration" className="mt-6" />
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
          <button onClick={handleSubmit} className="big-button mt-10">
            Show a grown-up
          </button>
        )}
        {submitState === "submitting" && (
          <button disabled className="big-button mt-10 opacity-60">
            Sending…
          </button>
        )}
        {submitState === "submitted" && (
          <div className="mt-10 space-y-4">
            <div className="card-base bg-mint-100">
              <p className="text-lg text-ink-700">
                Ask a grown-up to open <strong>Approvals</strong>. Your book is waiting!
              </p>
            </div>
            <Link href={`/studio/story?child=${childId}`} className="big-button">
              Make book {(ctx.bookNumber ?? 1) + 1}
            </Link>
          </div>
        )}
        {submitState === "error" && (
          <div className="mt-8 card-base border-coral/20 bg-coral-50">
            <p className="text-lg font-bold text-ink">Oops — Sparky couldn&apos;t save it. Try again!</p>
            <button onClick={() => setSubmitState("idle")} className="big-button mt-4">
              Try again
            </button>
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/studio" className="btn-ghost">
            Home
          </Link>
          <Link href="/library" className="btn-ghost">
            My books
          </Link>
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
      <StoryActProgress currentAct={currentAct} className="mb-4" />
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
        stepLabel={`${beatIdx + 1} of ${flow.length}`}
      />
    </>
  );
}
