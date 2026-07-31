import Link from "next/link";
import { Wand2, ShieldCheck } from "lucide-react";
import { AUDIENCE_LANDINGS } from "@/content/audience-landings";

/**
 * Two promises, side by side: kids make things here, and parents hold the pen.
 */
export function PrinciplesBand() {
  return (
    <section className="section paper-grain relative overflow-hidden bg-cream-100">
      <div className="container-ink">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="card-base group !p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/10 text-coral ring-1 ring-coral/25 transition-transform duration-500 ease-silk group-hover:-rotate-6 group-hover:scale-110">
              <Wand2 className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink">
              Making, not watching.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-700">
              Your child picks what happens next. Sparky turns their choices into
              illustrated pages. You review once — then order a softcover that
              ships to your door.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream-100 px-4 py-2 text-sm font-bold text-ink-600 ring-1 ring-gold/30">
              Softcover keepsake · $19.99 · ships in 7–10 days
            </p>
          </article>

          <article className="card-base group !p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/20 text-mint-600 ring-1 ring-mint/40 transition-transform duration-500 ease-silk group-hover:rotate-6 group-hover:scale-110">
              <ShieldCheck className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink">
              Built for families like yours.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-700">
              Parents and grandparents of children ages 5 to 8 — especially
              families who want a keepsake, not another passive app.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {AUDIENCE_LANDINGS.map((l) => (
                <li key={l.path}>
                  <Link
                    href={l.path}
                    className="inline-block rounded-full bg-white px-4 py-1.5 text-sm font-bold text-ink-600 ring-1 ring-mint/50 transition-all duration-300 ease-silk hover:-translate-y-0.5 hover:bg-mint-100 hover:ring-mint-500"
                  >
                    {l.breadcrumbLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
