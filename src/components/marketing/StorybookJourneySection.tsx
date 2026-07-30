import { getShowcaseManifest } from "@/lib/marketing-showcase";
import { JourneyStage, type JourneyPage } from "@/components/marketing/StorybookJourney";

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
      src: bust(m.cover),
      text: `${m.title} — ${m.childName}'s very first book, dreamed up with Sparky.`,
    },
    ...m.pages.map((p) => ({ src: bust(p.file), text: p.text })),
  ];

  return (
    <section id="story-journey" aria-label="Read the demo story" className="paper-grain relative scroll-mt-16 bg-cream-100">
      <JourneyStage title={m.title} childName={m.childName} pages={pages} />
    </section>
  );
}
