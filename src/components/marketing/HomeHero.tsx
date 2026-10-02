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
    <div className="relative aspect-square w-full overflow-hidden rounded-button border-[3px] border-white bg-cream-50 shadow-[0_10px_28px_rgba(74,37,69,0.14)]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        sizes="(max-width: 640px) 44vw, (max-width: 1024px) 44vw, 280px"
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
      priority: true,
    },
  ];

  return (
    <section className="hero-storybook">
      <div className="container-ink section pb-10 pt-6 md:pb-16 md:pt-14">
        {/* Phones: headline -> compact sample book -> CTAs. lg+: copy left, book right (spans both rows). */}
        <div className="grid items-start gap-5 md:gap-8 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-0">
          <div className="max-w-xl lg:col-start-1 lg:row-start-1 lg:max-w-none lg:self-end">
            <span className="eyebrow">For kids {brand.ageAudience}</span>
            <h1 className="mt-2 text-[2rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl md:mt-3 md:text-5xl lg:text-[3.25rem]">
              Your kid is the{" "}
              <span className="text-coral-dark">author</span>
              {" — "}not just the hero.
            </h1>
            <p className="mt-3 text-base leading-relaxed text-ink-700 md:mt-5 md:text-xl">
              {brand.heroSub}
            </p>
          </div>

          <div className="w-full lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
            <div
              className="mx-auto max-w-[16rem] rounded-[1.5rem] bg-gradient-to-br from-mint-100/90 via-cream-100 to-coral/15 p-2 shadow-inner sm:max-w-none sm:rounded-[2rem] sm:p-5 lg:p-6"
              aria-label="Sample story pages from Inklings"
            >
              <div className="grid grid-cols-2 gap-2 overflow-visible p-1 sm:gap-4 sm:p-2">
                {gridItems.map((item, i) => (
                  <div
                    key={`${item.src}-${i}`}
                    className={`transform transition-transform duration-300 motion-safe:hover:rotate-0 ${TILE_TILT[i] ?? "rotate-0"}`}
                  >
                    <ShowcaseCard
                      src={item.src}
                      alt={item.alt}
                      priority={item.priority}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-center text-[11px] font-semibold text-ink-600 sm:mt-4 sm:text-xs">
                Sample story · art on top, readable text below every page
              </p>
            </div>
          </div>

          <div className="flex max-w-xl flex-col lg:col-start-1 lg:row-start-2 lg:max-w-none lg:self-start">
            <p className="order-2 mt-4 text-sm font-semibold text-ink-600 lg:order-none lg:mt-0">
              Approve once → $19.99 softcover ships in 7–10 days
            </p>
            <TrustBadges className="order-3 mt-4 md:mt-6 lg:order-none" />
            <div data-hero-cta className="order-1 flex flex-col gap-3 lg:order-none lg:mt-7 sm:flex-row sm:flex-wrap">
              <Link href="/trial" className="btn-primary btn-large">
                {brand.primaryCta}
              </Link>
              <Link href="/try" className="btn-secondary btn-large">
                Try Sparky — no account
              </Link>
            </div>
            <p className="order-4 mt-4 hidden text-sm font-medium text-ink-500 sm:block md:mt-5 lg:order-none">{brand.trustStrip}</p>
            <p className="order-5 mt-2 hidden text-sm md:block lg:order-none">
              <Link href="/for-grandparents" className="inline-flex min-h-[44px] items-center font-semibold text-coral underline underline-offset-4">
                Gift for grandparents
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
