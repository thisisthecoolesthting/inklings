import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { BreadcrumbJsonLd, FaqPageJsonLd } from "@/lib/jsonld";
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
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink md:text-5xl">{config.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-700">{config.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
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
          <div className="grid gap-6 md:grid-cols-3">
            {config.bullets.map((b) => (
              <div key={b.title} className="card-base">
                <h2 className="text-xl font-bold text-ink">{b.title}</h2>
                <p className="mt-3 text-ink-700">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {config.steps && config.steps.length > 0 && (
        <section className="section">
          <div className="container-ink mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-ink">Sample session flow</h2>
            <ol className="mt-6 space-y-4">
              {config.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
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

      <section className="section">
        <div className="container-ink mx-auto max-w-3xl">
          <h2 className="text-lg font-bold text-ink">Related</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
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
    </>
  );
}
