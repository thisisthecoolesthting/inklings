import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { CtaBand } from "@/components/CtaBand";
import { BreadcrumbJsonLd, FaqPageJsonLd } from "@/lib/jsonld";
import { SwipeStrip } from "@/components/marketing/SwipeStrip";
import type { AudienceLandingConfig } from "@/content/audience-landings";

export function AudienceLanding({ config }: { config: AudienceLandingConfig }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: config.breadcrumbLabel, path: config.path },
        ]}
      />
      <FaqPageJsonLd items={config.faq} />

      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow">{config.eyebrow}</span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">{config.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-ink-700 md:mt-6 md:text-lg">{config.subtitle}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-8">
              <Link href={config.primaryCta.href} className="btn-primary btn-large">
                {config.primaryCta.label}
              </Link>
              {config.secondaryCta && (
                <Link href={config.secondaryCta.href} className="btn-ghost btn-large">
                  {config.secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-ink">
          <SwipeStrip label="Highlights" gridClassName="md:grid-cols-3 md:gap-6">
            {config.bullets.map((b) => (
              <div key={b.title} className="card-base h-full">
                <h2 className="text-xl font-bold text-ink">{b.title}</h2>
                <p className="mt-3 text-ink-700">{b.body}</p>
                {b.link && (
                  <p className="mt-2 md:mt-4">
                    <Link
                      href={b.link.href}
                      className="inline-flex min-h-[44px] items-center text-sm font-semibold text-coral underline underline-offset-4"
                    >
                      {b.link.label} &rarr;
                    </Link>
                  </p>
                )}
              </div>
            ))}
          </SwipeStrip>
        </div>
      </section>

      {config.steps && config.steps.length > 0 && (
        <section className="section">
          <div className="container-ink mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-ink">Sample session flow</h2>
            <ol className="mt-5 space-y-4 md:mt-6">
              {config.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-coral-dark text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-ink">{step.title}</h3>
                    <p className="mt-1 text-ink-700">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="section bg-cream-100">
        <div className="container-ink mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-ink">Common questions</h2>
          <div className="mt-6">
            <FAQ items={config.faq} />
          </div>
        </div>
      </section>

      {!config.hideRelated && (
      <section className="section">
        <div className="container-ink mx-auto max-w-3xl">
          <h2 className="text-lg font-bold text-ink">Related</h2>
          <ul className="mt-3 flex flex-wrap gap-2 md:mt-4 md:gap-3">
            {config.related.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="btn-secondary text-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}
      {config.endBand && (
        <CtaBand
          title={config.endBand.title}
          body={config.endBand.body}
          primary={config.endBand.primary}
          secondary={config.endBand.secondary}
          microcopy={config.endBand.microcopy}
        />
      )}
    </>
  );
}
