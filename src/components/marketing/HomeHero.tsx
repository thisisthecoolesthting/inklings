import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { getShowcaseCoverUrl, getShowcasePageUrls } from "@/lib/marketing-showcase";
import { getSampleUploads } from "@/components/marketing/StoryVisuals";

/** Subtle tilt per tile — playful stack, no overlap. */
const TILE_TILT = ["-rotate-2", "rotate-2", "-rotate-[1.5deg]", "rotate-[1.5deg]"] as const;

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
        sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 280px"
        className="object-contain"
      />
    </div>
  );
}

export async function HomeHero() {
  const showcase = await getShowcasePageUrls(4);
  const pages =
    showcase.length >= 3
      ? showcase
      : (await getSampleUploads(4)).length >= 1
        ? await getSampleUploads(4)
        : ["/images/site/hero-storybook.jpg"];

  const innerPages = pages.length >= 4 ? pages.slice(1, 4) : pages.slice(0, 3);
  const cover = (await getShowcaseCoverUrl()) ?? pages[0]!;

  const gridItems = [
    { src: cover, alt: "Sample storybook cover — Milo and the Moonbeam Map", priority: true },
    ...innerPages.slice(0, 3).map((src, i) => ({
      src,
      alt: `Story page ${i + 2} — illustration with readable text below`,
      priority: i === 0,
    })),
  ].slice(0, 4);

  return (
    <section className="hero-storybook">
      <div className="container-ink section pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl lg:max-w-none">
            <span className="eyebrow">Story studio for kids 5–8</span>
            <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight text-ink md:text-5xl lg:text-[3.25rem]">
              Your kid is the{" "}
              <span className="text-coral">author</span>
              {" — "}not just the hero.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-700 md:text-xl">
              {brand.heroSub}
            </p>
            <TrustBadges className="mt-8" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/trial" className="btn-primary btn-large">
                {brand.primaryCta}
              </Link>
              <Link href="/how-it-works" className="btn-ghost btn-large">
                {brand.secondaryCta}
              </Link>
            </div>
            <p className="mt-6 text-sm font-medium text-ink-500">{brand.trustStrip}</p>
          </div>

          <div className="w-full lg:max-w-none">
            <div
              className="rounded-[2rem] bg-gradient-to-br from-mint-100/90 via-cream-100 to-coral/15 p-4 shadow-inner sm:p-6 lg:p-7"
              aria-label="Sample story pages from Inklings"
            >
              <div className="grid grid-cols-2 gap-4 overflow-visible p-2 sm:gap-5 sm:p-3">
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
              <p className="mt-4 text-center text-xs font-semibold text-ink-600 sm:mt-5">
                Real story · art on top, readable text below every page
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
