"use client";

import { useState } from "react";

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

      <article className="card-base mt-6 min-h-[420px] bg-cream-50">
        {page.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.imageUrl}
            alt=""
            className="mb-4 w-full rounded-card border border-ink-100"
          />
        ) : (
          <div className="mb-4 flex h-48 items-center justify-center rounded-card bg-mint-100 text-sm text-ink-500">
            Illustration coming soon
          </div>
        )}
        <p className="text-lg leading-relaxed text-ink">{page.textContent}</p>
      </article>

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
