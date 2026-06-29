import type { Metadata } from "next";
import { brand } from "@/lib/brand";

const OG_IMAGE = "/images/showcase/milo-moonbeam/cover.jpg";

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = opts.title.includes(brand.name) ? opts.title : `${opts.title} — ${brand.name}`;
  return {
    title: fullTitle,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      type: "website",
      siteName: brand.name,
      title: fullTitle,
      description: opts.description,
      url: opts.path,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: [OG_IMAGE],
    },
  };
}
