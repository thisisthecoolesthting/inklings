import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { brand } from "@/lib/brand";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { StarField } from "@/components/marketing/StarField";
import { HeroStage } from "@/components/marketing/HeroStage";
import { getShowcaseCoverUrl, getShowcasePageUrls } from "@/lib/marketing-showcase";
import { getSampleUploads } from "@/components/marketing/StoryVisuals";

function SwashWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="swash-underline font-display italic text-gradient-warm">
      {children}
      <svg viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden>
        <path
          d="M3 9 C 30 3, 55 11, 78 6 S 110 4, 117 7"
          fill="none"
          stroke="#F4815C"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </span>
  );
}

export async function HomeHero() {
  const [showcase, coverHint] = await Promise.all([
    getShowcasePageUrls(4),
    getShowcaseCoverUrl(),
  ]);

  let pages = showcase;
  if (pages.length < 3) {
    const samples = await getSampleUploads(3);
    if (samples.length >= 1) pages = samples;
  }
  if (pages.length < 1) pages = ["/images/site/hero-storybook.jpg"];

  const cover = coverHint ?? pages[0]!;
  const floaters = pages.filter((p) => p !== cover).slice(0, 2);
  if (floaters.length === 0) floaters.push("/images/marketing/open-storybook-pages.jpg");

  return (
    <section className="hero-storybook paper-grain relative overflow-hidden">
      <StarField />
      {/* oversized soft glows for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-coral/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-40 h-[30rem] w-[30rem] rounded-full bg-mint/20 blur-3xl"
      />

      <div className="container-ink relative flex flex-col justify-center pb-16 pt-8 md:pt-12 lg:min-h-[calc(100dvh-4.5rem)] lg:pb-20 lg:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          <div className="max-w-xl lg:max-w-none">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink-600 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-coral" aria-hidden />
              The storybook atelier · ages 5–8
            </span>

            <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:mt-6 lg:text-[4.4rem]">
              Your kid is the <SwashWord>author</SwashWord>
              <span className="text-ink-400"> — </span>
              not just the hero.
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-700 md:text-xl lg:mt-6">
              {brand.heroSub}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink/[0.06] px-4 py-2 text-sm font-bold text-ink-700 lg:mt-5">
              Approve once <span aria-hidden className="text-coral">→</span> $19.99 softcover ships in 7–10 days
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-8">
              <Link
                href="/trial"
                className="btn-primary btn-large shadow-glow-coral hover:shadow-[0_18px_54px_rgba(244,129,92,0.5)]"
              >
                {brand.primaryCta}
              </Link>
              <Link href="/for-grandparents" className="btn-ghost btn-large bg-white/60 backdrop-blur-sm">
                Gift for grandparents
              </Link>
            </div>

            <TrustBadges className="mt-7" />
            <p className="mt-4 text-sm font-medium text-ink-500">{brand.trustStrip}</p>
          </div>

          <HeroStage coverSrc={cover} pageSrcs={floaters} />
        </div>

        <Link
          href="#story-journey"
          className="group absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-bold uppercase tracking-[0.18em] text-ink-500 transition-colors hover:text-coral md:flex"
        >
          Watch a real story unfold
          <ChevronDown className="h-4 w-4 animate-cue-bounce" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
