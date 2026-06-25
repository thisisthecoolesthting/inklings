import Link from "next/link";
import Image from "next/image";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { getShowcaseCoverUrl, getShowcasePageUrls } from "@/lib/marketing-showcase";

export async function getSampleUploads(limit = 8): Promise<string[]> {
  const showcase = await getShowcasePageUrls(limit);
  if (showcase.length > 0) return showcase;

  try {
    const dir = path.join(process.cwd(), "public", "uploads", "preview");
    const files = (await readdir(dir)).filter((f) => f.endsWith(".jpg")).slice(0, limit);
    return files.map((f) => `/uploads/preview/${f}`);
  } catch {
    return [];
  }
}

export async function SampleStoryGallery() {
  const samples = await getSampleUploads(6);
  if (samples.length === 0) return null;

  return (
    <section className="section bg-cream-100">
      <div className="container-ink">
        <div className="section-header-center">
          <span className="eyebrow">From a real Sparky story</span>
          <h2 className="section-title">Pages with words kids can read</h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            Illustrations are generated without text — we set the story in a clear, readable typeface below each picture, just like the printed book.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {samples.map((src, i) => (
            <div key={src} className="overflow-hidden rounded-card border border-ink-100 shadow-card">
              <Image
                src={src}
                alt={`Sample storybook page ${i + 1} from Inklings`}
                width={512}
                height={512}
                className="aspect-square w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function PrintShowcase() {
  const pages = await getSampleUploads(4);
  const cover = (await getShowcaseCoverUrl()) ?? "/images/site/hero-storybook.jpg";
  const spreadLeft = pages[0] ?? cover;
  const spreadRight = pages[1] ?? pages[0] ?? cover;

  return (
    <section className="section">
      <div className="container-ink">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="mx-auto max-w-xs overflow-hidden rounded-card shadow-card ring-1 ring-ink-100">
              <Image
                src={cover}
                alt="Cover of Milo and the Moonbeam Map — sample Inklings storybook"
                width={768}
                height={960}
                className="aspect-[4/5] w-full object-cover"
              />
              <p className="bg-cream-50 px-3 py-2 text-center text-xs font-medium text-ink-600">
                8.5″ hardcover · ships to your door
              </p>
            </div>
            <div className="flex gap-1 overflow-hidden rounded-card shadow-card ring-1 ring-ink-100">
              <div className="relative flex-1">
                <Image
                  src={spreadLeft}
                  alt="Inside spread — left page with illustration and story text"
                  width={512}
                  height={512}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div className="w-px shrink-0 bg-ink-200" aria-hidden />
              <div className="relative flex-1">
                <Image
                  src={spreadRight}
                  alt="Inside spread — right page with illustration and story text"
                  width={512}
                  height={512}
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div>
            <span className="eyebrow">Real keepsakes</span>
            <h2 className="mt-2 text-3xl font-bold text-ink">Hold the universe in your hands</h2>
            <p className="mt-4 text-lg text-ink-700">
              After you approve a story, order an 8.5″ hardcover — a real book your child can keep on the shelf
              and read again and again. Every page pairs art with easy-to-read text.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink-700">
              <li className="flex gap-2">
                <span className="font-bold text-coral">✓</span> Professionally printed hardcover
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-coral">✓</span> Ships in 7–10 days
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-coral">✓</span> Readable story text on every page
              </li>
            </ul>
            <Link href="/gift" className="btn-primary mt-6 inline-flex">
              Gift Premium or a printed book
            </Link>
            <Link href="/how-it-works#printed" className="btn-ghost ml-3 mt-6 inline-flex">
              How printing works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
