import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand";
import { FEATURES } from "@/content/feature-pages";
import { BreadcrumbJsonLd } from "@/lib/jsonld";

// Slugs that have bespoke static pages under src/app/features/<slug>/page.tsx.
// They must NOT be generated here too, or Next.js sees a route collision
// (static page vs. this dynamic route) and resolution becomes build-order
// dependent — the cause of the intermittent 404s on these three URLs.
const STATIC_FEATURE_SLUGS = ["voice-first-studio", "character-bible", "parent-approval"];

// Only serve the slugs we explicitly generate; everything else 404s (the
// static pages own their three URLs by virtue of being more-specific segments).
export const dynamicParams = false;

export async function generateStaticParams() {
  return FEATURES.filter((f) => !STATIC_FEATURE_SLUGS.includes(f.slug)).map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = FEATURES.find((x) => x.slug === slug);
  if (!f) return { title: `Feature — ${brand.name}` };
  return { title: `${f.title} — ${brand.name}`, description: f.summary };
}

export default async function FeatureDynamic({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // The 3 deep-dive pages take precedence; this route handles other entries in FEATURES.
  if (["voice-first-studio", "character-bible", "parent-approval"].includes(slug)) notFound();
  const f = FEATURES.find((x) => x.slug === slug);
  if (!f) notFound();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
          { name: f.title, path: `/features/${f.slug}` },
        ]}
      />
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow">Feature</span>
            <h1 className="text-4xl font-bold text-ink md:text-5xl">{f.title}</h1>
            <p className="mt-6 text-lg text-ink-700">{f.summary}</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-ink mx-auto max-w-3xl text-center">
          <Link href="/features" className="btn-secondary mt-4">
            All features
          </Link>
          <Link href="/trial" className="btn-primary ml-2 mt-4">
            {brand.primaryCta}
          </Link>
        </div>
      </section>
    </>
  );
}
