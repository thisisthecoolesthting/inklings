import Link from "next/link";
import Image from "next/image";
import { getSampleUploads } from "@/components/marketing/StoryVisuals";

const STEPS = [
  "Your child taps choices with Sparky — no typing required.",
  "Illustrated pages appear as the story grows.",
  "You approve the finished book in your portal.",
  "Order a printed hardcover when you are ready.",
];

export async function StudioPreviewSection() {
  const pages = await getSampleUploads(4);
  const tiles = pages.length >= 4 ? pages.slice(0, 4) : pages.length > 0 ? pages : [];

  if (tiles.length === 0) return null;

  return (
    <section className="section bg-cream-100">
      <div className="container-ink">
        <div className="grid items-center gap-12 lg:grid-cols-2">
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

          <div className="overflow-hidden rounded-card border border-ink-100 bg-white shadow-card">
            <div className="flex items-center gap-2 border-b border-ink-100 bg-cream-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-gold/80" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-mint-400" aria-hidden />
              <span className="ml-2 text-xs font-medium text-ink-500">Sparky Studio · sample story</span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              {tiles.map((src, i) => (
                <div key={`${src}-${i}`} className="overflow-hidden rounded-lg border border-ink-100 bg-cream-50">
                  <Image
                    src={src}
                    alt={`Story page ${i + 1} with readable text`}
                    width={480}
                    height={480}
                    className="aspect-square w-full object-cover object-top"
                  />
                </div>
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
