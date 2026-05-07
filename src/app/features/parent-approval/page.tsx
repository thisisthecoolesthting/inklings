import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { BreadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `Parent approval gate — ${brand.name}`,
  description: "Nothing publishes, exports, or prints without parent approval. Sandbox mode for new characters. The load-bearing safety contract.",
};

export default function FeatureApproval() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Features", path: "/features" }, { name: "Parent approval gate", path: "/features/parent-approval" }]} />
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow">Feature deep-dive</span>
            <h1 className="text-4xl font-bold text-ink md:text-5xl">Nothing leaves the sandbox without you.</h1>
            <p className="mt-6 text-lg text-ink-700">
              When your child invents a new character, it lands in a private sandbox — visible only to them in that session. When they finish a story, it lands in your approval queue. You read every page. You approve, edit, or send back. Then — and only then — does anything export, share, or print.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-ink mx-auto max-w-3xl space-y-6 text-ink-700">
          <div className="card-base">
            <h2 className="text-2xl font-bold text-ink">Sandbox mode for new characters</h2>
            <p className="mt-3">
              When your child creates a character, that character is private to their session. They can play with it. It does NOT enter the shared character family until you approve it from your portal.
            </p>
          </div>
          <div className="card-base">
            <h2 className="text-2xl font-bold text-ink">Page-by-page review</h2>
            <p className="mt-3">
              When a story is finished, you see every page side-by-side: text on the left, illustration on the right. You can approve the whole thing, edit a sentence, regenerate an image, or send the story back to your child for revision. Books in &ldquo;awaiting parent&rdquo; status never reach the printer.
            </p>
          </div>
          <div className="card-base">
            <h2 className="text-2xl font-bold text-ink">Why it&apos;s the safety contract</h2>
            <p className="mt-3">
              We don&apos;t rely on AI moderation alone. Sparky is bounded, the image model is filtered, content moderation runs on every output — but ultimately, you are the gate. If anything slips past every other check, you catch it on review. That layered safety is the only kind worth claiming.
            </p>
          </div>
        </div>
      </section>

      <section className="hero-final-cta py-20">
        <div className="container-ink mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-cream-100">You decide what your child publishes.</h2>
          <Link href="/security" className="btn-ghost btn-large mt-8 inline-flex border-cream-200/60 text-cream-100 hover:bg-cream-100/10">Read our safety architecture</Link>
        </div>
      </section>
    </>
  );
}
