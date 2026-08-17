"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpen } from "lucide-react";
import { brand } from "@/lib/brand";
import { TrustBadges } from "@/components/marketing/TrustBadges";

export function HomeHero() {
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
          <div className="storybook-stage storybook-stage-ready">
            <div className="storybook-static-poster cinematic-story-poster" role="img" aria-label="A moonlit Inklings story emerging from an open book">
              <Image
                src="/images/hero-night.png"
                alt=""
                fill
                priority
                sizes="(max-width: 720px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="cinematic-story-glow" aria-hidden />
            </div>
          </div>
        </div>
      </div>

      <a href="#inside-the-story" className="hero-scroll-cue" aria-label="Continue to see how Inklings works">
        <span>Follow the story</span>
        <ArrowDown className="h-4 w-4" aria-hidden />
      </a>
    </section>
  );
}
