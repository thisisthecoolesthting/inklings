import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { getShowcaseCoverUrl, getShowcasePageUrls } from "@/lib/marketing-showcase";
import { getSampleUploads } from "@/components/marketing/StoryVisuals";

/** Subtle tilt per tile — playful stack, no overlap. */
const TILE_TILT = ["-rotate-2", "rotate-2"] as const;

function ShowcaseCard({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl border-[3px] border-white bg-cream-50 shadow-[0_10px_28px_rgba(74,37,69,0.14)]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 280px"
        className="object-contain"
      />
    </div>
  );
}

export async function HomeHero() {
  const [showcase, coverHint] = await Promise.all([
    getShowcasePageUrls(4),
    getShowcaseCoverUrl(),
  ]);

  let pages = showcase;
  if (pages.length < 3) {
    const samples = await getSampleUploads(3);
    if (samples.length >= 1) pages = samples;
  }
  if (pages.length < 1) pages = ["/images/site/hero-storybook.jpg"];

  const cover = coverHint ?? pages[0]!;
  const second =
    pages.find((p) => p !== cover) ??
    "/images/marketing/open-storybook-pages.jpg";

  const gridItems = [
    { src: cover, alt: "Sample storybook cover — Milo and the Moonbeam Map", priority: true },
    {
      src: second,
      alt: "Open storybook page — illustration with readable text below",
      priority: false,
    },
  ];

  return (
    <section className="hero-storybook">
      <div className="container-ink section pb-12 pt-10 md:pb-16 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="max-w-xl lg:max-w-none">
            <span className="eyebrow">Story studio for kids 5–8</span>
            <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight text-ink md:text-5xl lg:text-[3.25rem]">
              Your kid is the{" "}
              <span className="text-coral">author</span>
              {" — "}not just the hero.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-700 md:text-xl">
              {brand.heroSub}
            </p>
            <p className="mt-3 text-sm font-semibold text-ink-600">
              Approve once → $19.99 hardcover ships in 7–10 days
            </p>
            <TrustBadges className="mt-6" />
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/trial" className="btn-primary btn-large">
                {brand.primaryCta}
              </Link>
              <Link href="/for-grandparents" className="btn-ghost btn-large">
                Gift for grandparents
              </Link>
            </div>
            <p className="mt-5 text-sm font-medium text-ink-500">{brand.trustStrip}</p>
          </div>

          <div className="w-full lg:max-w-none">
            <div
              className="rounded-[2rem] bg-gradient-to-br from-mint-100/90 via-cream-100 to-coral/15 p-4 shadow-inner sm:p-5 lg:p-6"
              aria-label="Sample story pages from Inklings"
            >
              <div className="grid grid-cols-2 gap-3 overflow-visible p-1 sm:gap-4 sm:p-2">
                {gridItems.map((item, i) => (
                  <div
                    key={`${item.src}-${i}`}
                    className={`transform transition-transform duration-300 hover:rotate-0 ${TILE_TILT[i] ?? "rotate-0"}`}
                  >
                    <ShowcaseCard
                      src={item.src}
                      alt={item.alt}
                      priority={item.priority}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center text-xs font-semibold text-ink-600 sm:mt-4">
                Real story · art on top, readable text below every page
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
