import type { Metadata } from "next";
import { brand } from "@/lib/brand";

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
      images: [{ url: "/images/site/og-default.svg", alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: ["/images/site/og-default.svg"],
    },
  };
}
