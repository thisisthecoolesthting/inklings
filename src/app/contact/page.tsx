import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Contact — ${brand.name}`,
  description: "Get in touch with the Inklings team.",
};

export default function ContactPage() {
  return (
    <>
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-2xl">
            <span className="eyebrow">Say hello</span>
            <h1 className="text-4xl font-bold text-ink md:text-5xl">We read every email.</h1>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-ink mx-auto max-w-2xl">
          <p className="text-lg text-ink-700">
            For questions, support, partnerships, or to send us a story your kid made:
          </p>
          <a
            href="mailto:hello@inklings.shop"
            className="mt-6 inline-flex rounded-button bg-coral px-6 py-4 text-lg font-bold text-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-cardHover"
          >
            hello@inklings.shop
          </a>
          <p className="mt-8 text-sm text-ink-500">
            Press inquiries: hello@inklings.shop &middot;
            Safety reports: hello@inklings.shop
          </p>
        </div>
      </section>
    </>
  );
}
