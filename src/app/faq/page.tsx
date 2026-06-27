import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";
import { FAQ_HOME } from "@/content/faq-data";
import { BreadcrumbJsonLd, FaqPageJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQ — questions parents ask first",
  description: "Answers about safety, pricing, printing, voice input, and parent approval for Inklings ages 5–8.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      />
      <FaqPageJsonLd items={FAQ_HOME} />
      <section className="hero-storybook">
        <div className="container-ink section">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">FAQ</span>
            <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Honest answers to the questions parents ask first.
            </h1>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-ink mx-auto max-w-3xl">
          <FAQ items={FAQ_HOME} />
        </div>
      </section>
    </>
  );
}
