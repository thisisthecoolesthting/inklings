import { PrimaryCta } from "@/components/PrimaryCta";

export interface CtaBandProps {
  eyebrow?: string;
  title: string;
  body?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  microcopy?: string;
}

/**
 * Plum/cream closing band — same look as the homepage final CTA. Uses PrimaryCta
 * so the trust microcopy is consistent.
 */
export function CtaBand({ eyebrow, title, body, primary, secondary, microcopy }: CtaBandProps) {
  return (
    <section className="hero-final-cta py-14 md:py-20">
      <div className="container-ink mx-auto max-w-3xl text-center">
        {eyebrow ? <span className="eyebrow-on-dark">{eyebrow}</span> : null}
        <h2 className="text-3xl font-bold tracking-tight text-cream-100 md:text-4xl">{title}</h2>
        {body ? <p className="mx-auto mt-4 max-w-xl text-cream-200/85">{body}</p> : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start">
          <PrimaryCta href={primary.href} microcopy={microcopy} onDark>
            {primary.label}
          </PrimaryCta>
          {secondary ? (
            <PrimaryCta href={secondary.href} variant="secondary" microcopy={false} onDark>
              {secondary.label}
            </PrimaryCta>
          ) : null}
        </div>
      </div>
    </section>
  );
}
