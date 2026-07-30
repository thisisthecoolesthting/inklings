import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";
import { StarField } from "@/components/marketing/StarField";
import { getShowcaseCoverUrl } from "@/lib/marketing-showcase";

/**
 * Night-sky finale: the cover floats under the stars, one clear invitation.
 */
export async function FinalCta() {
  const cover = (await getShowcaseCoverUrl()) ?? "/images/showcase/milo-moonbeam/cover.jpg";

  return (
    <section className="night-sky relative overflow-hidden py-28 md:py-36">
      <StarField tone="night" />
      {/* moon glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl"
      />

      <div className="container-ink relative">
        <div className="mx-auto grid max-w-4xl items-center gap-12 md:grid-cols-[1fr_auto]">
          <div className="text-center md:text-left">
            <span className="eyebrow-on-dark">A book they can hold</span>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-cream-100 md:text-5xl">
              Their first book is about <em className="text-gradient-night not-italic font-display italic">twenty minutes</em> away.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-cream-200/85 md:mx-0">
              Free to try. No credit card. You approve everything before it prints —
              then one day the mail brings a book with their name in it.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link href="/trial" className="btn-primary btn-large shadow-glow-coral">
                {brand.primaryCta}
              </Link>
              <Link
                href="/for-grandparents"
                className="btn-ghost btn-large border-cream-200/60 text-cream-100 hover:bg-cream-100/10"
              >
                Gift for grandparents
              </Link>
              <Link
                href="/gift"
                className="btn-ghost btn-large border-cream-200/60 text-cream-100 hover:bg-cream-100/10"
              >
                Gift Premium
              </Link>
            </div>
            <p className="mt-6 text-sm font-semibold text-cream-200/60">{brand.trustStrip}</p>
          </div>

          <div className="relative mx-auto w-48 md:w-60">
            <div
              aria-hidden
              className="absolute inset-[-18%] rounded-full bg-gold/25 blur-2xl"
            />
            <div className="book-3d animate-float-y relative">
              <div className="book-3d-inner">
                <div className="relative aspect-square overflow-hidden rounded-r-xl rounded-l-md shadow-book ring-1 ring-white/20">
                  <Image
                    src={cover}
                    alt="Milo and the Moonbeam Map — printed softcover"
                    fill
                    sizes="(max-width: 768px) 192px, 240px"
                    className="object-cover"
                  />
                  <div aria-hidden className="book-spine-shadow absolute inset-y-0 left-0 w-[12%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
