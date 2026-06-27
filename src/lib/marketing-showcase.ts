import { readFile } from "node:fs/promises";
import path from "node:path";

export type ShowcaseManifest = {
  slug: string;
  title: string;
  childName: string;
  builtAt: string;
  pages: Array<{
    n: number;
    file: string;
    text: string;
  }>;
  cover: string;
};

const MANIFEST = path.join(process.cwd(), "public", "images", "showcase", "manifest.json");

export async function getShowcaseManifest(): Promise<ShowcaseManifest | null> {
  try {
    const raw = await readFile(MANIFEST, "utf8");
    return JSON.parse(raw) as ShowcaseManifest;
  } catch {
    return null;
  }
}

function withCacheBust(url: string, builtAt?: string): string {
  if (!builtAt) return url;
  const v = builtAt.replace(/[^0-9]/g, "").slice(0, 14);
  return `${url}?v=${v}`;
}

/** Ordered page image paths for marketing (cover first optional, then story pages). */
export async function getShowcasePageUrls(limit = 8): Promise<string[]> {
  const m = await getShowcaseManifest();
  if (!m?.pages?.length) return [];
  return m.pages.slice(0, limit).map((p) => withCacheBust(p.file, m.builtAt));
}

export async function getShowcaseCoverUrl(): Promise<string | null> {
  const m = await getShowcaseManifest();
  return m?.cover ? withCacheBust(m.cover, m.builtAt) : null;
}
