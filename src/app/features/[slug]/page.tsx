import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand";
import { FEATURE_DEEP_DIVES, getFeatureDeepDive } from "@/content/feature-deep-dives";
import { FeatureDeepDive } from "@/components/marketing/FeatureDeepDive";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return FEATURE_DEEP_DIVES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dive = getFeatureDeepDive(slug);
  if (!dive) return { title: `Feature — ${brand.name}` };
  return pageMetadata({
    title: dive.metaTitle,
    description: dive.metaDescription,
    path: `/features/${dive.slug}`,
  });
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dive = getFeatureDeepDive(slug);
  if (!dive) notFound();
  return <FeatureDeepDive dive={dive} />;
}
