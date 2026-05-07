/**
 * Canonical site URL for metadata, JSON-LD, sitemap, and email links.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL ?? "https://inklings.shop";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}
