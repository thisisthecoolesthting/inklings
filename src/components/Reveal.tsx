"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps children with an IntersectionObserver-based reveal-on-scroll.
 * Mirrors getrevalue.com's `.animate-on-scroll` pattern (translate(30px) -> 0,
 * opacity 0 -> 1) but actually fires from a real observer instead of always-on
 * CSS keyframes.
 *
 * `delay` staggers reveals when wrapping a sequence of cards.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Content is visible by default (SSR, no-JS, reduced motion, no IntersectionObserver).
  // Only after hydration do we "arm" the hidden state, and only for blocks that are still
  // below the fold, so nothing can be stuck at opacity 0.
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return; // already on screen
    setArmed(true);
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const hidden = armed && !seen;
  const style: React.CSSProperties = {
    transition: "opacity 600ms ease, transform 600ms ease",
    transitionDelay: `${delay}ms`,
    opacity: hidden ? 0 : 1,
    transform: hidden ? "translateY(30px)" : "translateY(0)",
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
