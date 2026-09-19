import type { Metadata } from "next";
import { ContactForm, type TopicValue } from "@/components/ContactForm";
import { PrimaryCta } from "@/components/PrimaryCta";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact us",
  description:
    "Questions, support, classroom pilots, press, or a safety concern? Message the Inklings team and we will reply. We read every note ourselves.",
  path: "/contact",
});

const TOPIC_VALUES: TopicValue[] = ["support", "classroom", "press", "safety", "sample-story"];

/** Accepts the canonical values plus the short `?topic=sample` alias. */
function normalizeTopic(raw: string | undefined): TopicValue {
  if (raw === "sample") return "sample-story";
  return TOPIC_VALUES.find((t) => t === raw) ?? "support";
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const sp = await searchParams;
  const initialTopic = normalizeTopic(sp.topic);

  return (
    <>
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-4xl">
            <span className="eyebrow">Say hello</span>
            <h1 className="text-4xl font-bold text-ink md:text-5xl">We read every email.</h1>
            <p className="mt-4 max-w-2xl text-lg text-ink-700">
              For questions, support, partnerships, or to send us a story your kid made. Use the form,
              or write to us directly at{" "}
              <a className="text-coral underline" href="mailto:hello@inklings.shop">
                hello@inklings.shop
              </a>
              .
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-ink">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ContactForm initialTopic={initialTopic} />

          <aside className="space-y-6 lg:pt-1">
            <div className="card-base">
              <h2 className="text-xl font-bold text-ink">Want to see it first?</h2>
              <p className="mt-2 text-sm text-ink-700">
                Tap through a real story beat with Sparky in about 30 seconds. No account needed.
              </p>
              <div className="mt-4">
                <PrimaryCta href="/try" variant="secondary" microcopy={false}>
                  Try Sparky first
                </PrimaryCta>
              </div>
            </div>
            <div className="card-base">
              <h2 className="text-xl font-bold text-ink">Prefer email?</h2>
              <p className="mt-2 text-sm text-ink-700">
                Press, safety reports, and everything else go to the same inbox:{" "}
                <a className="font-semibold text-coral underline" href="mailto:hello@inklings.shop">
                  hello@inklings.shop
                </a>
                .
              </p>
            </div>
          </aside>
          </div>
        </div>
      </section>
    </>
  );
}
