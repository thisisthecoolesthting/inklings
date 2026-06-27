import type { MetadataRoute } from "next";
import { AUDIENCE_LANDINGS } from "@/content/audience-landings";
import { FEATURES } from "@/content/feature-pages";
import { getSiteUrl } from "@/lib/site-url";

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }> = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/watch", priority: 0.7, changeFrequency: "monthly" },
  { path: "/features", priority: 0.8, changeFrequency: "weekly" },
  { path: "/features/voice-first-studio", priority: 0.75, changeFrequency: "monthly" },
  { path: "/features/character-bible", priority: 0.75, changeFrequency: "monthly" },
  { path: "/features/parent-approval", priority: 0.75, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.85, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/how-it-works", priority: 0.85, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/security", priority: 0.6, changeFrequency: "monthly" },
  { path: "/trial", priority: 0.9, changeFrequency: "weekly" },
  { path: "/gift", priority: 0.85, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const audienceEntries = AUDIENCE_LANDINGS.map((l) => ({
    url: `${base}${l.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const dynamicFeatureEntries = FEATURES.filter(
    (f) => !["voice-first-studio", "character-bible", "parent-approval"].includes(f.slug),
  ).map((f) => ({
    url: `${base}/features/${f.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticEntries, ...audienceEntries, ...dynamicFeatureEntries];
}
