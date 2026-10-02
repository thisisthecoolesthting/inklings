"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Footer link group. Below md it is a collapsible <details> accordion (44px+ summary row);
 * from md up it is always expanded and the summary is a plain heading. Server-rendered open
 * so links are visible without JS; collapses on phones after mount.
 */
export function FooterGroup({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      if (ref.current) ref.current.open = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <details ref={ref} open className="group border-b border-cream-200/10 md:border-0">
      <summary
        className="flex min-h-[48px] cursor-pointer list-none items-center justify-between text-sm font-semibold text-white marker:hidden [&::-webkit-details-marker]:hidden md:pointer-events-none md:mb-3 md:min-h-0 md:cursor-default"
        onClick={(e) => {
          if (window.matchMedia("(min-width: 768px)").matches) e.preventDefault();
        }}
      >
        {title}
        <ChevronDown
          aria-hidden
          className="h-5 w-5 transition-transform group-open:rotate-180 motion-reduce:transition-none md:hidden"
        />
      </summary>
      {children}
    </details>
  );
}
