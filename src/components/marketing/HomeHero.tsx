import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { getShowcaseCoverUrl, getShowcasePageUrls } from "@/lib/marketing-showcase";
import { getSampleUploads } from "@/components/marketing/StoryVisuals";

const PAGE_LAYOUT = [
  { className: "left-[2%] top-[8%] z-10 w-[52%] -rotate-6", label: "Page 1" },
  { className: "right-[2%] top-[4%] z-20 w-[52%] rotate-5", label: "Page 2" },
  { className: "bottom-[6%] left-[22%] z-30 w-[58%] rotate-1", label: "Page 3" },
] as const;

export async function HomeHero() {
  const showcase = await getShowcasePageUrls(3);
  const pages =
    showcase.length >= 3
      ? showcase.slice(0, 3)
      : (await getSampleUploads(3)).length >= 1
        ? (await getSampleUploads(3))
        : ["/images/site/hero-storybook.jpg"];

  const cover = (await getShowcaseCoverUrl()) ?? pages[0]!;

  return (
    <section className="hero-storybook overflow-hidden">
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

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] w-full" aria-label="Sample story pages from Inklings">
              <div
                className="absolute inset-[6%] rounded-[2rem] bg-gradient-to-br from-mint-100/90 via-cream-100 to-coral/15 shadow-inner"
                aria-hidden
              />
              <div className="absolute left-[8%] top-[6%] z-40 w-[38%] overflow-hidden rounded-lg border-[3px] border-white shadow-lg">
                <Image
                  src={cover}
                  alt="Sample storybook cover"
                  width={400}
                  height={500}
                  priority
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              {PAGE_LAYOUT.map((slot, i) => (
                <div
                  key={`${pages[i]}-${i}`}
                  className={`absolute overflow-hidden rounded-xl border-[3px] border-white bg-white shadow-[0_18px_40px_rgba(74,37,69,0.18)] ${slot.className}`}
                >
                  <Image
                    src={pages[i]!}
                    alt={`${slot.label} — illustration with readable story text`}
                    width={640}
                    height={640}
                    priority={i === 0}
                    className="aspect-square w-full object-cover object-top"
                  />
                </div>
              ))}
              <div className="absolute bottom-3 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-ink-100 bg-white/95 px-4 py-1.5 text-xs font-semibold text-ink-600 shadow-sm backdrop-blur-sm">
                Real story · readable text on every page
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
