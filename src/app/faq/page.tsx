import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { FAQ } from "@/components/FAQ";
import { FAQ_HOME } from "@/content/faq-data";

export const metadata: Metadata = {
  title: `FAQ — ${brand.name}`,
  description: "Answers to the questions parents ask before signing up.",
};

export default function FaqPage() {
  return (
    <>
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
