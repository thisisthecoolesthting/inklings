import Link from "next/link";
import Image from "next/image";
import { BookOpen, Palette, Printer, Truck, HeartHandshake } from "lucide-react";

const SPECS = [
  {
    icon: Palette,
    title: "Art with a memory",
    body: "Every character gets a Character Bible — colors, outfit, personality — so the same puppy looks like the same puppy across every adventure.",
  },
  {
    icon: BookOpen,
    title: "Typeset like a real picture book",
    body: "Art on top, calm readable type below. No garbled AI words baked into the pictures, ever.",
  },
  {
    icon: Printer,
    title: "Printed on real paper",
    body: "8.5\" × 8.5\" softcover, full-color pages, matte cover, professionally bound. Up to 32 illustrated pages.",
  },
  {
    icon: Truck,
    title: "On your shelf in 7–10 days",
    body: "One-time $19.99 on any plan. It arrives ready for bedtime — and for show-and-tell.",
  },
];

const PHOTOS = [
  { src: "/images/marketing/child-holding-book.jpg", alt: "A child holding their printed Inklings book", tilt: "-rotate-3", delay: "0s" },
  { src: "/images/marketing/print-hardcover.jpg", alt: "A finished printed storybook, front cover", tilt: "rotate-2", delay: "0.6s" },
  { src: "/images/marketing/kid-creating-tablet.jpg", alt: "A kid creating their story with Sparky on a tablet", tilt: "-rotate-2", delay: "1.1s" },
  { src: "/images/marketing/open-storybook-pages.jpg", alt: "An open printed book showing illustrated pages", tilt: "rotate-3", delay: "1.7s" },
];

/**
 * The atelier story: independent-studio craft, print specs, and the honest
 * founder note. Photo collage uses real product photography.
 */
export function CraftSection() {
  return (
    <section className="section paper-grain relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-mint/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-24 h-96 w-96 rounded-full bg-coral/10 blur-3xl"
      />

      <div className="container-ink relative">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* collage */}
          <div className="relative mx-auto grid w-full max-w-lg grid-cols-2 gap-5 sm:gap-7 lg:max-w-none">
            {PHOTOS.map((p, i) => (
              <figure
                key={p.src}
                className={`polaroid ${p.tilt} animate-float-y-soft hover:rotate-0`}
                style={{ animationDelay: p.delay, marginTop: i % 2 === 1 ? "1.75rem" : 0 }}
              >
                <div className="relative aspect-square overflow-hidden rounded-md bg-cream-50">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 640px) 44vw, 300px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-2 truncate whitespace-nowrap text-center text-[11px] font-bold text-ink-400">
                  {["Bedtime, upgraded", "The real thing", "Made by kids", "Built to be re-read"][i]}
                </figcaption>
              </figure>
            ))}
          </div>

          {/* specs + founder note */}
          <div>
            <span className="eyebrow">The atelier standard</span>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              From little hands to your shelf — <em className="text-gradient-warm not-italic font-display italic">crafted</em>, not generated-and-shipped.
            </h2>
            <div className="gold-rule !mx-0" />

            <ul className="mt-8 space-y-6">
              {SPECS.map((s) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-cream-100 text-coral ring-1 ring-gold/40">
                    <s.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 leading-relaxed text-ink-700">{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <figure className="mt-10 rounded-card border-l-4 border-coral bg-cream-100/80 p-6 shadow-card">
              <HeartHandshake className="h-5 w-5 text-coral" aria-hidden />
              <blockquote className="mt-3 font-display text-lg italic leading-relaxed text-ink-700">
                We&apos;re a small independent studio — parents building for parents.
                A human reviews every single book before it goes to print. If it
                wouldn&apos;t make our own kids gasp, it doesn&apos;t ship.
              </blockquote>
              <figcaption className="mt-3 text-sm font-bold text-ink-500">
                — The Inklings studio
              </figcaption>
            </figure>

            <Link href="/how-it-works#printed" className="btn-secondary btn-large mt-8 inline-flex">
              See how printing works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
