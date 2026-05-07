import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { BreadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `Voice-first kid Studio — ${brand.name}`,
  description: "How Inklings's kid Studio works for ages 4-8. Voice STT with tap-button fallback. No reading required. Bounded branching with Sparky.",
};

export default function FeatureVoice() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Features", path: "/features" }, { name: "Voice-first kid Studio", path: "/features/voice-first-studio" }]} />
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow">Feature deep-dive</span>
            <h1 className="text-4xl font-bold text-ink md:text-5xl">Voice-first, no reading required.</h1>
            <p className="mt-6 text-lg text-ink-700">
              Most apps for kids ages 4 to 8 assume the kid can read. Most ages 4 to 8 can&apos;t — at least not at the speed needed to enjoy a creative tool. Inklings flips it: your child <em>talks</em> to Sparky, and Sparky narrates the story back. Reading is optional everywhere.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-ink mx-auto max-w-3xl space-y-6 text-ink-700">
          <div className="card-base">
            <h2 className="text-2xl font-bold text-ink">How it works</h2>
            <p className="mt-3">
              Sparky asks one question at a time — &ldquo;Where are we today?&rdquo; — and shows three or four giant tap-buttons with emoji. Your child can <strong>tap</strong> a button or <strong>say</strong> the answer out loud. We use the browser&apos;s built-in speech recognition — no audio leaves the device unless your child taps the mic.
            </p>
          </div>
          <div className="card-base">
            <h2 className="text-2xl font-bold text-ink">Why tap-first instead of voice-first</h2>
            <p className="mt-3">
              Voice recognition on small kids is unreliable. Their pronunciation isn&apos;t consistent, browsers vary, ambient noise is real. We built it as <em>tap with optional voice</em>, not the other way around. If voice fails, the kid taps. They never see an error message — Sparky just keeps going.
            </p>
          </div>
          <div className="card-base">
            <h2 className="text-2xl font-bold text-ink">Sparky is bounded, not a chatbot</h2>
            <p className="mt-3">
              Every choice your child sees is a chip we wrote and tested. Sparky doesn&apos;t take freeform input. There&apos;s no way for your child to wander into an open conversation with an AI — every path leads somewhere safe.
            </p>
          </div>
        </div>
      </section>

      <section className="hero-final-cta py-20">
        <div className="container-ink mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-cream-100">Try the Studio with your child.</h2>
          <p className="mt-3 text-cream-200/85">Free to start. No credit card.</p>
          <Link href="/trial" className="btn-primary btn-large mt-8 inline-flex">{brand.primaryCta}</Link>
        </div>
      </section>
    </>
  );
}
