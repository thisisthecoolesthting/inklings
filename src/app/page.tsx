import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookHeart,
  Check,
  Fingerprint,
  Gift,
  LibraryBig,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { FAQ } from "@/components/FAQ";
import { PricingTiers } from "@/components/PricingTiers";
import { FAQ_HOME } from "@/content/faq-data";
import { FaqPageJsonLd } from "@/lib/jsonld";
import { StudioPreviewSection } from "@/components/marketing/StudioPreviewSection";
import { HomeHero } from "@/components/marketing/HomeHero";
import { pageMetadata } from "@/lib/seo";

const FAQ_TEASERS = FAQ_HOME.slice(0, 4);

export const metadata: Metadata = pageMetadata({
  title: `${brand.name} — Their imagination, bound forever`,
  description:
    "Inklings is the parent-approved storybook studio where kids ages 4 and up create recurring characters, illustrated adventures, and real printed books.",
  path: "/",
});

const DIFFERENCE = [
  {
    icon: WandSparkles,
    eyebrow: "They direct",
    title: "Not a name dropped into somebody else&apos;s story.",
    body: "Your child chooses the characters, the world, and what happens next. Sparky keeps the process playful and bounded.",
  },
  {
    icon: Fingerprint,
    eyebrow: "The world remembers",
    title: "Their characters return exactly as they imagined them.",
    body: "A Character Bible keeps every cape, color, personality, and friendship consistent from one adventure to the next.",
  },
  {
    icon: BookHeart,
    eyebrow: "You make it real",
    title: "The best stories leave the screen.",
    body: "Approve the finished story once, then order a full-color softcover that belongs on the family bookshelf.",
  },
];

const TRUST = [
  [ShieldCheck, "Parent-approved", "Nothing publishes, exports, or prints until you say so."],
  [Sparkles, "Bounded by design", "Sparky follows tested story paths instead of open-ended chat."],
  [PackageCheck, "A real keepsake", "8.5-inch full-color softcovers ship in 7–10 days."],
] as const;

export default function HomePage() {
  return (
    <>
      <FaqPageJsonLd items={FAQ_TEASERS} />
      <HomeHero />

      <section className="marquee-proof" aria-label="What makes Inklings different">
        <div className="container-ink grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {["Kid-authored", "Parent-approved", "Characters return", "Printed for keeps"].map((label, index) => (
            <div key={label} className="flex items-center justify-center gap-2 text-sm font-bold text-ink-700">
              <span className={`proof-gem proof-gem-${index + 1}`} aria-hidden />
              {label}
            </div>
          ))}
        </div>
      </section>

      <section className="story-manifesto section" id="inside-the-story">
        <div className="container-ink">
          <div className="mx-auto max-w-4xl text-center">
            <span className="eyebrow">Making, not watching</span>
            <h2 className="display-section-title">
              Most personalized books put your child in the picture.
              <span> Inklings puts them in the director&apos;s chair.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {DIFFERENCE.map(({ icon: Icon, eyebrow, title, body }, index) => (
              <article key={eyebrow} className="difference-card" data-number={`0${index + 1}`}>
                <div className="difference-icon"><Icon className="h-6 w-6" aria-hidden /></div>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-coral">{eyebrow}</p>
                <h3 className="mt-3 text-2xl font-bold leading-tight text-ink" dangerouslySetInnerHTML={{ __html: title }} />
                <p className="mt-4 leading-relaxed text-ink-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <StudioPreviewSection />

      <section className="section overflow-hidden bg-cream-50">
        <div className="container-ink grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative mx-auto w-full max-w-[620px]">
            <div className="keepsake-halo" aria-hidden />
            <div className="keepsake-stack">
              <div className="keepsake-book keepsake-book-back" aria-hidden />
              <div className="keepsake-book keepsake-book-front">
                <Image
                  src="/images/showcase/milo-moonbeam/cover.jpg"
                  alt="Milo and the Moonbeam Map — a sample printed Inklings story"
                  fill
                  sizes="(max-width: 1024px) 80vw, 520px"
                  className="object-cover"
                />
                <div className="keepsake-spine" aria-hidden />
              </div>
            </div>
            <div className="keepsake-caption">
              <span className="h-2 w-2 rounded-full bg-mint-600" aria-hidden />
              Printed in full color · 8.5″ square
            </div>
          </div>

          <div className="max-w-xl">
            <span className="eyebrow">The moment it becomes real</span>
            <h2 className="display-section-title text-left">
              From a rainy-day idea to the book they pull off the shelf.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-600">
              Digital creation is only the beginning. The real magic is watching your child read a story they authored—and knowing the next book can bring the same characters home again.
            </p>
            <ul className="mt-7 space-y-4">
              {["Up to 32 illustrated pages", "Readable story text, never baked into AI art", "A matte softcover made for rereading", "Duplicate copies for grandparents"].map((item) => (
                <li key={item} className="flex items-center gap-3 font-semibold text-ink-700">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint-100 text-mint-600">
                    <Check className="h-4 w-4" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/trial" className="btn-primary btn-large group">
                Start their first story
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link href="/gift" className="btn-story-ghost btn-large">
                <Gift className="mr-2 h-4 w-4" aria-hidden />
                Give Inklings
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-section section">
        <div className="container-ink">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <span className="eyebrow-on-dark">Built for families, not feeds</span>
              <h2 className="mt-2 text-4xl font-bold leading-tight tracking-tight text-cream-50 md:text-5xl">
                Wonder without the wild west.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed text-cream-200/80 lg:justify-self-end">
              Inklings is deliberately not an open chatbot. Kids make meaningful choices inside a creative path; parents remain in control of every character, story, export, and order.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {TRUST.map(([Icon, title, body]) => (
              <article key={title} className="trust-card">
                <Icon className="h-7 w-7 text-mint" aria-hidden />
                <h3 className="mt-6 text-xl font-bold text-cream-50">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream-200/70">{body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/security" className="inline-flex items-center gap-2 font-semibold text-mint hover:text-cream-50">
              Read our safety promise <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section className="pricing-stage section" id="pricing">
        <div className="container-ink">
          <div className="section-header-center mx-auto max-w-3xl">
            <span className="eyebrow">Start with a blank page</span>
            <h2 className="display-section-title">Create free. Print when the story deserves a spine.</h2>
            <p className="section-subtitle mt-5">
              Try a complete first story with no credit card. Premium keeps every world growing; books are always a one-time choice.
            </p>
          </div>
          <PricingTiers />
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-ink grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <span className="eyebrow">Questions parents ask first</span>
            <h2 className="display-section-title text-left">Before you hand them the pencil.</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">
              Clear answers about age, privacy, approvals, consistency, and what happens when a story is finished.
            </p>
            <Link href="/faq" className="mt-7 inline-flex items-center gap-2 font-bold text-coral hover:text-coral-700">
              Explore every answer <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <FAQ items={FAQ_TEASERS} />
        </div>
      </section>

      <section className="final-story-cta">
        <div className="final-story-stars" aria-hidden />
        <div className="container-ink relative z-10 mx-auto max-w-4xl py-24 text-center md:py-32">
          <LibraryBig className="mx-auto h-10 w-10 text-gold" aria-hidden />
          <span className="eyebrow-on-dark mt-6">Every series starts with book one</span>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-cream-50 md:text-6xl">
            Their first universe is about twenty minutes away.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-cream-200/80">
            Free to try. No credit card. No kid login. Nothing leaves your private family library until you approve it.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/trial" className="btn-primary btn-large group">
              {brand.primaryCta}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link href="/for-grandparents" className="btn-dark-ghost btn-large">
              Gift for grandparents
            </Link>
          </div>
          <p className="mt-6 text-sm font-semibold text-cream-200/60">$19.99 softcover · ships in 7–10 days</p>
        </div>
      </section>
    </>
  );
}
