import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Mic2, MousePointerClick, ShieldCheck, Sparkles } from "lucide-react";

const STORY_PAGES = [
  "/images/showcase/milo-moonbeam/page-01.jpg",
  "/images/showcase/milo-moonbeam/page-02.jpg",
  "/images/showcase/milo-moonbeam/page-03.jpg",
  "/images/showcase/milo-moonbeam/page-04.jpg",
];

const STEPS = [
  { icon: Mic2, label: "Imagine", body: "Sparky asks playful questions with voice and giant tap choices." },
  { icon: Sparkles, label: "Create", body: "Characters and illustrated pages appear as the adventure grows." },
  { icon: ShieldCheck, label: "Approve", body: "You review the complete story once in your parent portal." },
  { icon: Check, label: "Keep", body: "Save it to the family library or order a printed softcover." },
];

export function StudioPreviewSection() {
  return (
    <section className="studio-journey section" aria-labelledby="studio-heading">
      <div className="container-ink">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <span className="eyebrow-on-dark">Inside a twenty-minute adventure</span>
            <h2 id="studio-heading" className="mt-2 text-4xl font-bold leading-tight tracking-tight text-cream-50 md:text-5xl">
              A little conversation becomes a whole world.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cream-200/80">
              No blank-page panic and no typing required. Sparky offers just enough structure for young storytellers to make choices that feel completely their own.
            </p>

            <ol className="mt-9 space-y-5">
              {STEPS.map(({ icon: Icon, label, body }, index) => (
                <li key={label} className="journey-step">
                  <div className="journey-number">{index + 1}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-mint" aria-hidden />
                      <h3 className="font-bold text-cream-50">{label}</h3>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-cream-200/65">{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link href="/trial" className="btn-primary btn-large group mt-9 inline-flex">
              Create a story free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>

          <div className="storyboard-window">
            <div className="storyboard-toolbar">
              <div className="flex gap-2" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-coral" />
                <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                <span className="h-2.5 w-2.5 rounded-full bg-mint" />
              </div>
              <span>Sparky Studio · Milo and the Moonbeam Map</span>
              <span className="hidden items-center gap-1 sm:flex"><MousePointerClick className="h-3.5 w-3.5" aria-hidden /> Explore the pages</span>
            </div>
            <div className="storyboard-pages">
              {STORY_PAGES.map((src, index) => (
                <figure key={src} className={`storyboard-page storyboard-page-${index + 1}`}>
                  <Image
                    src={src}
                    alt={`Illustrated sample story page ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 34vw, 310px"
                    className="object-cover"
                  />
                  <figcaption>Page {index + 1}</figcaption>
                </figure>
              ))}
            </div>
            <div className="storyboard-status">
              <span className="flex items-center gap-2"><span className="status-pulse" aria-hidden /> Story remembered</span>
              <span>Readable type · parent review ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
