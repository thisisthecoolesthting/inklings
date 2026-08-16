"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpen, MousePointer2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/lib/brand";
import { TrustBadges } from "@/components/marketing/TrustBadges";

const StorybookUniverse = dynamic(
  () => import("@/components/marketing/StorybookUniverse").then((mod) => mod.StorybookUniverse),
  {
    ssr: false,
    loading: () => (
      <div className="storybook-fallback" aria-hidden>
        <Image
          src="/images/showcase/milo-moonbeam/cover.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 56vw"
          className="object-cover"
        />
      </div>
    ),
  },
);

export function HomeHero() {
  const [page, setPage] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [staticScene, setStaticScene] = useState(true);
  const [sceneActive, setSceneActive] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 720px)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const supportsWebGL = (() => {
      try {
        const probe = document.createElement("canvas");
        return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
      } catch {
        return false;
      }
    })();
    const updateMode = () => setStaticScene(!supportsWebGL || reduceMotion.matches || coarsePointer.matches || connection?.saveData === true || (compact.matches && memory <= 4));
    updateMode();
    reduceMotion.addEventListener("change", updateMode);
    compact.addEventListener("change", updateMode);
    coarsePointer.addEventListener("change", updateMode);
    const timer = window.setTimeout(() => setSceneReady(true), 350);
    return () => {
      window.clearTimeout(timer);
      reduceMotion.removeEventListener("change", updateMode);
      compact.removeEventListener("change", updateMode);
      coarsePointer.removeEventListener("change", updateMode);
    };
  }, []);

  useEffect(() => {
    if (!stageRef.current || staticScene) return;
    const observer = new IntersectionObserver(([entry]) => setSceneActive(entry?.isIntersecting ?? true), { threshold: 0.08 });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, [staticScene]);

  return (
    <section className="cinematic-hero">
      <div className="cinematic-grain" aria-hidden />
      <div className="cinematic-orb cinematic-orb-coral" aria-hidden />
      <div className="cinematic-orb cinematic-orb-mint" aria-hidden />

      <div className="container-ink relative z-10 grid min-h-[calc(100svh-81px)] items-center gap-4 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-0 lg:py-0">
        <div className="relative z-20 max-w-2xl pb-4 pt-4 lg:-mr-20 lg:pb-0">
          <div className="hero-kicker">
            <span className="hero-kicker-dot" aria-hidden />
            A living storybook studio for ages {brand.ageAudience}
          </div>
          <h1 className="hero-display mt-6">
            Your kid is the author.
            <span className="hero-display-accent"> Not just the hero.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700 md:text-xl">
            Their imagination, bound forever. Your child invents the characters, chooses what happens, and builds a world that remembers them. You approve it. We turn it into a real book.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/trial" className="btn-primary btn-large group">
              {brand.primaryCta}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link href="#inside-the-story" className="btn-story-ghost btn-large">
              <BookOpen className="mr-2 h-4 w-4" aria-hidden />
              Open the story
            </Link>
          </div>

          <TrustBadges className="mt-7" />
          <p className="mt-5 text-sm font-semibold text-ink-500">
            First story free · No credit card · Parent-approved · No ads
          </p>
        </div>

        <div className="relative min-h-[500px] w-full lg:min-h-[calc(100svh-81px)]">
          <div ref={stageRef} className={`storybook-stage ${sceneReady ? "storybook-stage-ready" : ""}`}>
            {staticScene ? (
              <div className="storybook-static-poster" role="img" aria-label="An illustrated Inklings book opening into a magical story world">
                <Image
                  src="/images/og.png"
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 720px) 100vw, 56vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <StorybookUniverse page={page} active={sceneActive} />
            )}
          </div>

          {!staticScene && <div className="story-scene-controls" aria-label="Interactive storybook controls">
            <button
              type="button"
              className="story-scene-button"
              onClick={() => setPage((value) => value + 1)}
              aria-label="Turn the storybook page"
            >
              <MousePointer2 className="h-4 w-4" aria-hidden />
              Turn the page
              <span className="story-page-count">{(page % 3) + 1}/3</span>
            </button>
          </div>}

          {!staticScene && <div className="story-scene-note" aria-hidden>
            <Sparkles className="h-4 w-4 text-gold" />
            Drag to explore
          </div>}
        </div>
      </div>

      <a href="#inside-the-story" className="hero-scroll-cue" aria-label="Continue to see how Inklings works">
        <span>Follow the story</span>
        <ArrowDown className="h-4 w-4" aria-hidden />
      </a>
    </section>
  );
}
