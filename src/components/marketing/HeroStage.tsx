"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Hero art stage: the showcase cover as a 3D book on a glowing desk, with
 * real story pages floating behind it. Pointer position drives a gentle
 * parallax (each layer has its own depth); inner elements carry the idle
 * float animation so the two transforms never fight.
 */
export function HeroStage({
  coverSrc,
  pageSrcs,
}: {
  coverSrc: string;
  pageSrcs: string[];
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduced || e.pointerType === "touch" || !stageRef.current) return;
      const r = stageRef.current.getBoundingClientRect();
      setTilt({
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      });
    },
    [reduced],
  );

  const layer = (depth: number): React.CSSProperties => ({
    transform: `translate3d(${(-tilt.x * depth).toFixed(1)}px, ${(-tilt.y * depth).toFixed(1)}px, 0)`,
    transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
  });

  const pageA = pageSrcs[0];
  const pageB = pageSrcs[1] ?? pageSrcs[0];

  return (
    <div
      ref={stageRef}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative mx-auto aspect-[10/11] w-full max-w-[520px] select-none sm:aspect-square lg:max-w-none"
      aria-label="Milo and the Moonbeam Map — a real storybook made in Inklings"
      role="img"
    >
      {/* desk glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[62%] h-[70%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(244,129,92,0.30) 0%, rgba(212,165,116,0.18) 45%, transparent 70%)",
        }}
      />

      {/* floating page — back left */}
      {pageA && (
        <div className="absolute left-[-2%] top-[6%] w-[46%] sm:left-[2%]" style={layer(10)}>
          <div className="-rotate-6 animate-float-y-soft" style={{ animationDelay: "0.8s" }}>
            <div className="relative aspect-square overflow-hidden rounded-xl border-[3px] border-white bg-cream-50 shadow-page">
              <Image
                src={pageA}
                alt=""
                fill
                sizes="(max-width: 640px) 40vw, 240px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* floating page — back right */}
      {pageB && (
        <div className="absolute right-[-1%] top-[16%] w-[42%] sm:right-[3%]" style={layer(16)}>
          <div className="rotate-[7deg] animate-float-y" style={{ animationDelay: "1.6s" }}>
            <div className="relative aspect-square overflow-hidden rounded-xl border-[3px] border-white bg-cream-50 shadow-page">
              <Image
                src={pageB}
                alt=""
                fill
                sizes="(max-width: 640px) 38vw, 220px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* the book itself */}
      <div
        className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 sm:w-[58%]"
        style={layer(26)}
      >
        <div className="book-3d animate-float-y-soft">
          <div className="book-3d-inner relative">
            <div className="relative aspect-square overflow-hidden rounded-r-2xl rounded-l-md bg-cream-50 shadow-book ring-1 ring-ink-900/10">
              <Image
                src={coverSrc}
                alt=""
                fill
                priority
                sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 460px"
                className="object-cover"
              />
              {/* spine shading sells the 3D object */}
              <div aria-hidden className="book-spine-shadow absolute inset-y-0 left-0 w-[12%]" />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-ink-900/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* drifting sparkles */}
      <div aria-hidden className="absolute inset-0" style={layer(38)}>
        <svg className="absolute left-[8%] top-[64%] h-5 w-5 text-gold animate-drift-slow" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.1 6.4L21 10l-6.9 1.6L12 18l-2.1-6.4L3 10l6.9-1.6L12 2z" />
        </svg>
        <svg className="absolute right-[10%] top-[8%] h-4 w-4 text-coral animate-drift-slow" style={{ animationDelay: "2.2s" }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.1 6.4L21 10l-6.9 1.6L12 18l-2.1-6.4L3 10l6.9-1.6L12 2z" />
        </svg>
        <svg className="absolute right-[22%] top-[78%] h-3.5 w-3.5 text-mint-600 animate-drift-slow" style={{ animationDelay: "4.1s" }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.1 6.4L21 10l-6.9 1.6L12 18l-2.1-6.4L3 10l6.9-1.6L12 2z" />
        </svg>
      </div>
    </div>
  );
}
