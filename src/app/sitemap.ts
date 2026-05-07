import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const ROUTES = ["/features", "/features/voice-first-studio", "/features/character-bible", "/features/parent-approval", "", "/pricing", "/faq", "/how-it-works", "/about", "/security", "/trial", "/contact", "/legal/privacy", "/legal/terms"];
  return ROUTES.map((path) => ({ url: `${base}${path}`, lastModified: now, changeFrequency: "weekly" as const, priority: path === "" ? 1.0 : 0.7 }));
}
