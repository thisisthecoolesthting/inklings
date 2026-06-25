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

/** Ordered page image paths for marketing (cover first optional, then story pages). */
export async function getShowcasePageUrls(limit = 8): Promise<string[]> {
  const m = await getShowcaseManifest();
  if (!m?.pages?.length) return [];
  return m.pages.slice(0, limit).map((p) => p.file);
}

export async function getShowcaseCoverUrl(): Promise<string | null> {
  const m = await getShowcaseManifest();
  return m?.cover ?? null;
}
