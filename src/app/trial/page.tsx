import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Start a free story — ${brand.name}`,
  description: "Create your free Inklings parent account in 60 seconds. No credit card.",
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Please check your email and password, then try again.",
  exists: "An account with that email already exists.",
  weak_password: "Password must be at least 8 characters.",
  mismatch: "Passwords didn't match. Please try again.",
  consent_required: "Parental consent is required to create an account.",
  server: "Something went wrong on our end. Please try again, or email hello@inklings.shop.",
  rate_limited: "Too many attempts. Please wait a minute and try again.",
};

interface TrialSearchParams {
  error?: string;
  tier?: string;
}

export default async function TrialPage(props: {
  searchParams?: Promise<TrialSearchParams>;
}) {
  const params: TrialSearchParams = (await props?.searchParams) ?? {};

  const errorMsg = params.error
    ? ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.server
    : undefined;

  return (
    <section className="hero-storybook">
      <div className="container-ink section">
        <div className="mx-auto max-w-xl">
          <span className="eyebrow">Start free</span>
          <h1 className="text-4xl font-bold text-ink md:text-5xl">Build a story universe.</h1>
          <p className="mt-4 text-lg text-ink-700">
            Create your parent account with email and password. No credit card required.
          </p>

          {errorMsg && (
            <div
              role="alert"
              className="mt-6 rounded-card border-2 px-4 py-3 text-sm"
              style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}
            >
              <strong className="font-semibold">Couldn&apos;t create your account.</strong>{" "}
              {errorMsg}
              {params.error === "exists" && (
                <>
                  {" "}
                  <Link href="/login" className="font-semibold underline">
                    Sign in instead
                  </Link>
                  .
                </>
              )}
            </div>
          )}

          <form action="/api/auth/signup" method="POST" className="mt-8 space-y-4">
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
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-ink">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                minLength={8}
                className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-4 py-3 text-base focus:border-coral focus:outline-none"
              />
              <p className="mt-1 text-xs text-ink-500">At least 8 characters.</p>
            </div>
            <div>
              <label htmlFor="password_confirm" className="block text-sm font-semibold text-ink">
                Confirm password
              </label>
              <input
                id="password_confirm"
                name="password_confirm"
                type="password"
                required
                autoComplete="new-password"
                minLength={8}
                className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-4 py-3 text-base focus:border-coral focus:outline-none"
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
                Inklings is designed for children ages 5–8 and is operated for parents. We never
                market to children directly.
              </p>
            </div>
            <button type="submit" className="btn-primary btn-large btn-full">
              Create account
            </button>
            <p className="text-xs text-ink-500">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
              . By continuing you agree to our{" "}
              <Link href="/legal/terms" className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
