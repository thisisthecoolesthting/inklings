import Link from "next/link";
import { BreadcrumbJsonLd } from "@/lib/jsonld";
import { FEATURES } from "@/content/feature-pages";
import type { DeepDive } from "@/content/feature-deep-dives";
import { CharacterShelf } from "@/components/marketing/CharacterShelf";
import { CtaBand } from "@/components/CtaBand";
import { PrimaryCta } from "@/components/PrimaryCta";

/**
 * One shared template for all six /features/* deep-dives: hero, optional
 * showcase, H2 section cards (with a no-account "Try Sparky" nudge after the
 * first), a "Next feature" row, and a closing CTA band.
 */
export function FeatureDeepDive({ dive }: { dive: DeepDive }) {
  const idx = FEATURES.findIndex((f) => f.slug === dive.slug);
  const feature = FEATURES[idx];
  const next = FEATURES[(idx + 1) % FEATURES.length]!;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
          { name: feature?.title ?? dive.metaTitle, path: `/features/${dive.slug}` },
        ]}
      />
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow">Feature deep-dive</span>
            <h1 className="text-4xl font-bold text-ink md:text-5xl">{dive.title}</h1>
            <p className="mt-6 text-lg text-ink-700">{dive.intro}</p>
          </div>
        </div>
      </section>

      {dive.showcase === "character-shelf" && (
        <section className="section bg-cream-100">
          <div className="container-ink">
            <div className="section-header-center">
              <span className="eyebrow">Watch it accumulate</span>
              <h2 className="section-title">A shelf that keeps growing</h2>
              <p className="section-subtitle">
                Every approved story adds a new spine, same characters inside. This is what the
                Character Bible looks like after a few months of play.
              </p>
            </div>
            <CharacterShelf />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container-ink mx-auto max-w-3xl space-y-6 text-ink-700">
          {dive.sections.map((s, i) => (
            <div key={s.heading} className="space-y-6">
              <div className="card-base">
                <h2 className="text-2xl font-bold text-ink">{s.heading}</h2>
                <div className="mt-3">{s.body}</div>
              </div>
              {i === 0 && (
                <div className="flex justify-center">
                  <PrimaryCta href="/try" variant="secondary" microcopy={false}>
                    Try Sparky — no account
                  </PrimaryCta>
                </div>
              )}
            </div>
          ))}

          <nav
            aria-label="More features"
            className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-6 text-sm font-semibold"
          >
            <Link href="/features" className="text-ink-600 underline underline-offset-4 hover:text-ink">
              All features
            </Link>
            <Link href={`/features/${next.slug}`} className="text-coral hover:underline">
              Next feature: {next.title} &rarr;
            </Link>
          </nav>
        </div>
      </section>

      <CtaBand
        title={dive.cta.title}
        body={dive.cta.body}
        primary={dive.cta.primary}
        secondary={dive.cta.secondary}
        microcopy={dive.cta.microcopy}
      />
    </>
  );
}
