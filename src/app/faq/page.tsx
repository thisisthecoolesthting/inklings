import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";
import { FAQ_HOME } from "@/content/faq-data";
import { BreadcrumbJsonLd, FaqPageJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { PrimaryCta } from "@/components/PrimaryCta";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "FAQ — questions parents ask first",
  description:
    "Answers to what parents ask first about Inklings: safety, parent approval, pricing, printed books, voice input, photos, and COPPA, for kids ages 4-8.",
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
          <FAQ items={FAQ_HOME} headingLevel="h2" />
        </div>
      </section>
      <section className="section bg-cream-100 pt-12 md:pt-16">
        <div className="container-ink mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-ink">Still deciding?</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-700">
            The quickest way to know is to try it. Tap through a story beat with Sparky, or start a
            free story with your child.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start">
            <PrimaryCta href="/trial">Start free</PrimaryCta>
            <PrimaryCta href="/try" variant="secondary" microcopy={false}>
              Try Sparky — no account
            </PrimaryCta>
          </div>
          <p className="mt-6 text-sm text-ink-600">
            Still have a question?{" "}
            <Link href="/contact" className="font-semibold text-coral underline underline-offset-4">
              Ask us
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
