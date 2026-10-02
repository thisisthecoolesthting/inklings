"use client";

import { useState } from "react";
import { Check } from "lucide-react";

/**
 * Feature bullets for a pricing card. On phones only the first `collapseAfter` bullets show,
 * with a 44px "Show N more" toggle; from `md` up every bullet is always visible.
 * Content is in the DOM either way (collapsed items are only hidden with CSS).
 */
export function PricingFeatureList({
  features,
  collapseAfter = 3,
  collapsible = true,
}: {
  features: string[];
  collapseAfter?: number;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const extra = collapsible ? Math.max(0, features.length - collapseAfter) : 0;

  return (
    <div className="mt-5 flex-1 md:mt-6">
      <ul className="space-y-3 text-sm text-ink-700">
        {features.map((f, i) => (
          <li
            key={f}
            className={"items-start gap-2 " + (i >= collapseAfter && extra > 0 && !open ? "hidden md:flex" : "flex")}
          >
            <Check className="mt-0.5 h-4 w-4 flex-none text-mint-700" aria-hidden />
            <span dangerouslySetInnerHTML={{ __html: f }} />
          </li>
        ))}
      </ul>
      {extra > 0 && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-1 inline-flex min-h-[44px] items-center text-sm font-semibold text-coral-dark underline underline-offset-4 md:hidden"
        >
          {open ? "Show fewer" : `Show ${extra} more`}
        </button>
      )}
    </div>
  );
}
