import Link from "next/link";
import Image from "next/image";
import { getSampleUploads } from "@/components/marketing/StoryVisuals";

const STEPS = [
  "Your child taps choices with Sparky — no typing required.",
  "Illustrated pages appear as the story grows.",
  "You approve the finished book in your portal.",
  "Order a printed softcover when you are ready.",
];

function PageTile({ src, index }: { src: string; index: number }) {
  return (
    <div className="relative aspect-square min-h-0 w-full overflow-hidden rounded-lg border border-ink-100 bg-cream-50">
      <Image
        src={src}
        alt={`Story page ${index + 1} with readable text`}
        fill
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 280px"
        className="object-contain p-0.5"
      />
    </div>
  );
}

export async function StudioPreviewSection() {
  const pages = await getSampleUploads(4);
  const tiles = pages.length >= 4 ? pages.slice(0, 4) : pages.length > 0 ? pages : [];

  if (tiles.length === 0) return null;

  return (
    <section className="section scroll-mt-28 bg-cream-100">
      <div className="container-ink">
        <div className="mx-auto max-w-3xl xl:max-w-none xl:grid xl:grid-cols-2 xl:items-start xl:gap-16">
          <div>
            <span className="eyebrow">See it in action</span>
            <h2 className="mt-2 text-3xl font-bold text-ink md:text-4xl">
              A kid makes a book in about 20 minutes
            </h2>
            <p className="mt-4 text-lg text-ink-700">
              These pages are from a complete demo story — art on top, clear story text below. No garbled AI words in the pictures.
            </p>
            <ol className="mt-8 space-y-4">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-3 text-ink-700">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <Link href="/trial" className="btn-primary btn-large mt-8 inline-flex">
              Create your first book free
            </Link>
          </div>

          <div className="mt-10 rounded-card border border-ink-100 bg-white shadow-card xl:mt-0">
            <div className="flex items-center gap-2 border-b border-ink-100 bg-cream-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-gold/80" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-mint-400" aria-hidden />
              <span className="ml-2 text-xs font-medium text-ink-500">Sparky Studio · sample story</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-5 sm:gap-5 sm:p-6">
              {tiles.map((src, i) => (
                <PageTile key={`${src}-${i}`} src={src} index={i} />
              ))}
            </div>
            <p className="border-t border-ink-100 px-4 py-3 text-center text-xs text-ink-500">
              Milo and the Moonbeam Map · demo story built in Inklings
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
