import { access } from "node:fs/promises";
import path from "node:path";
import { getShowcaseManifest } from "@/lib/marketing-showcase";
import { JourneyStage, type JourneyPage } from "@/components/marketing/StorybookJourney";

/**
 * page-*.jpg files have the story text baked into the image; the journey also
 * renders that text as a live caption — so baked-text images would show every
 * sentence twice. Prefer the art-only ill-*.jpg companions when they exist.
 */
async function artOnly(publicPath: string): Promise<string> {
  const candidate = publicPath.replace(/page-(\d+)\.jpg$/, "ill-$1.jpg");
  if (candidate === publicPath) {
    const coverCandidate = publicPath.replace(/cover\.jpg$/, "ill-cover.jpg");
    if (coverCandidate !== publicPath && (await exists(coverCandidate))) return coverCandidate;
    return publicPath;
  }
  return (await exists(candidate)) ? candidate : publicPath;
}

async function exists(publicPath: string): Promise<boolean> {
  try {
    await access(path.join(process.cwd(), "public", publicPath.replace(/^\//, "")));
    return true;
  } catch {
    return false;
  }
}

/**
 * Scroll-driven page-turn through the real showcase story. Server wrapper
 * reads the manifest; the client stage handles the scroll choreography.
 */
export async function StorybookJourneySection() {
  const m = await getShowcaseManifest();
  if (!m?.pages?.length) return null;

  const v = m.builtAt.replace(/[^0-9]/g, "").slice(0, 14);
  const bust = (u: string) => `${u}?v=${v}`;

  const pages: JourneyPage[] = [
    {
      src: bust(await artOnly(m.cover)),
      text: `${m.title} — ${m.childName}'s very first book, dreamed up with Sparky.`,
    },
    ...(await Promise.all(
      m.pages.map(async (p) => ({ src: bust(await artOnly(p.file)), text: p.text })),
    )),
  ];

  return (
    <section id="story-journey" aria-label="Read the demo story" className="paper-grain relative scroll-mt-16 bg-cream-100">
      <JourneyStage title={m.title} childName={m.childName} pages={pages} />
    </section>
  );
}
