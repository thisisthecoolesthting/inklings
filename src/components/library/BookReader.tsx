"use client";

import { useState } from "react";
import { StoryPageCard } from "@/components/studio/StoryPageCard";

interface Page {
  pageNumber: number;
  textContent: string;
  imageUrl: string | null;
}

export function BookReader({ title, pages }: { title: string; pages: Page[] }) {
  const [idx, setIdx] = useState(0);
  const page = pages[idx];
  const atStart = idx === 0;
  const atEnd = idx >= pages.length - 1;

  if (!page) {
    return <p className="text-center text-ink-600">This book has no pages yet.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-center text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-1 text-center text-sm text-ink-500">
        Page {idx + 1} of {pages.length}
      </p>

      <div className="mt-6">
        <StoryPageCard
          pageNumber={page.pageNumber}
          imageUrl={page.imageUrl}
          text={page.textContent}
          imageAlt={`Page ${page.pageNumber} illustration`}
        />
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <button
          type="button"
          disabled={atStart}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          className="big-button-mint flex-1 disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={atEnd}
          onClick={() => setIdx((i) => Math.min(pages.length - 1, i + 1))}
          className="big-button flex-1 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
