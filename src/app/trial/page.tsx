import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Start a free story — ${brand.name}`,
  description: "Create your free Inklings parent account in 60 seconds. No credit card.",
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Please double-check the email address and try again.",
  exists: "An account with that email already exists. Try signing in.",
  server: "Something went wrong on our end. Please try again, or email hello@inklings.shop.",
};

interface TrialSearchParams {
  error?: string;
  ok?: string;
  tier?: string;
}

export default async function TrialPage(props: {
  searchParams?: Promise<TrialSearchParams>;
}) {
  // Defensive: handle both Promise (Next 15+) and plain object (Next 14 fallback) shapes.
  const params: TrialSearchParams = (await props?.searchParams) ?? {};

  const errorMsg = params.error
    ? ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.server
    : undefined;
  const ok = params.ok === "1";

  return (
    <section className="hero-storybook">
      <div className="container-ink section">
        <div className="mx-auto max-w-xl">
          <span className="eyebrow">Start free</span>
          <h1 className="text-4xl font-bold text-ink md:text-5xl">Make your child a storybook.</h1>
          <p className="mt-4 text-lg text-ink-700">
            We&apos;ll email you a sign-in link. No password, no credit card.
          </p>

          {errorMsg && (
            <div
              role="alert"
              className="mt-6 rounded-card border-2 px-4 py-3 text-sm"
              style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}
            >
              <strong className="font-semibold">Couldn&apos;t create your account.</strong>{" "}
              {errorMsg}
            </div>
          )}
          {ok && (
            <div
              role="alert"
              className="mt-6 rounded-card border-2 px-4 py-3 text-sm"
              style={{ background: "#F0FDF4", borderColor: "#BBF7D0", color: "#166534" }}
            >
              Check your email for a sign-in link from Inklings.
            </div>
          )}

          <form action="/api/auth/login" method="POST" className="mt-8 space-y-4">
            {params.tier && <input type="hidden" name="tier" value={params.tier} />}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink">
                Your email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-4 py-3 text-base focus:border-coral focus:outline-none"
                placeholder="parent@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <input
                  id="coppa_consent"
                  type="checkbox"
                  name="coppa_consent"
                  value="yes"
                  required
                  className="mt-0.5 shrink-0 accent-coral"
                />
                <label htmlFor="coppa_consent" className="text-xs text-ink-600 leading-relaxed">
                  I am this child&apos;s parent or legal guardian, and I consent to Inklings
                  collecting the information my child provides to create their stories.
                </label>
              </div>
              <p className="text-xs text-ink-500">
                Inklings is designed for children ages 4–8 and is operated for parents. We never
                market to children directly.
              </p>
            </div>
            <button type="submit" className="btn-primary btn-large btn-full">
              Email me a sign-in link
            </button>
            <p className="text-xs text-ink-500">
              By continuing you agree to our{" "}
              <Link href="/legal/terms" className="underline">Terms</Link> and{" "}
              <Link href="/legal/privacy" className="underline">Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
