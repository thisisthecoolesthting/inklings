import Link from "next/link";
import Image from "next/image";
import { readdir } from "node:fs/promises";
import path from "node:path";

async function sampleUploads(limit = 6): Promise<string[]> {
  try {
    const dir = path.join(process.cwd(), "public", "uploads", "preview");
    const files = (await readdir(dir)).filter((f) => f.endsWith(".jpg")).slice(0, limit);
    return files.map((f) => `/uploads/preview/${f}`);
  } catch {
    return [];
  }
}

export async function SampleStoryGallery() {
  const samples = await sampleUploads();
  if (samples.length === 0) return null;

  return (
    <section className="section bg-cream-100">
      <div className="container-ink">
        <div className="section-header-center">
          <span className="eyebrow">From real stories</span>
          <h2 className="section-title">Pages kids actually made</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {samples.map((src) => (
            <div key={src} className="overflow-hidden rounded-card border border-ink-100 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Sample storybook illustration from Inklings" className="aspect-square w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PRINT_IMAGES = {
  hardcover: "/images/marketing/print-hardcover.jpg",
  childBook: "/images/marketing/child-holding-book.jpg",
  openPages: "/images/marketing/open-storybook-pages.jpg",
};

export function PrintShowcase() {
  return (
    <section className="section">
      <div className="container-ink">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[3/4] overflow-hidden rounded-card shadow-card">
              <Image
                src={PRINT_IMAGES.hardcover}
                alt="Hardcover Inklings storybook on a table — printed keepsake"
                width={768}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] translate-y-6 overflow-hidden rounded-card shadow-card">
              <Image
                src={PRINT_IMAGES.childBook}
                alt="Child proudly holding their printed Inklings storybook"
                width={768}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <span className="eyebrow">Real keepsakes</span>
            <h2 className="mt-2 text-3xl font-bold text-ink">Hold the universe in your hands</h2>
            <p className="mt-4 text-lg text-ink-700">
              After you approve a story, order an 8.5″ hardcover — a real book your child can keep on the shelf
              and read again and again.
            </p>
            <div className="mt-6 overflow-hidden rounded-card border border-ink-100 shadow-card">
              <Image
                src={PRINT_IMAGES.openPages}
                alt="Open storybook showing illustrated pages from a child's adventure"
                width={1024}
                height={768}
                className="w-full object-cover"
              />
            </div>
            <Link href="/gift" className="btn-primary mt-6 inline-flex">
              Gift Premium or a printed book
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
