"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export function FAQ({
  items,
  headingLevel = "h3",
}: {
  items: FaqItem[];
  /** Heading level for each question. Use "h2" when the page has no section heading above the list. */
  headingLevel?: "h2" | "h3";
}) {
  return (
    <div className="mx-auto max-w-3xl">
      {items.map((item, idx) => (
        <FAQRow key={idx} item={item} headingLevel={headingLevel} />
      ))}
    </div>
  );
}

function FAQRow({ item, headingLevel }: { item: FaqItem; headingLevel: "h2" | "h3" }) {
  const [open, setOpen] = useState(false);
  const Heading = headingLevel;
  return (
    <div
      className={`mb-4 overflow-hidden rounded-xl border transition-colors duration-300 ${
        open ? "border-mint-500" : "border-ink-100"
      }`}
    >
      <Heading className="font-sans text-base font-semibold text-ink">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 bg-white p-6 text-left transition-colors hover:bg-cream-100"
        >
          <span>{item.q}</span>
          <Plus
            aria-hidden
            className={`h-5 w-5 flex-none text-mint-700 transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          />
        </button>
      </Heading>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 text-sm leading-relaxed text-muted">{item.a}</div>
        </div>
      </div>
    </div>
  );
}
