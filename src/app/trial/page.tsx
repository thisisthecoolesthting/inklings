import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { TrialForm } from "@/components/TrialForm";

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
  email?: string;
  consent?: string;
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

          <TrialForm
            defaultEmail={params.email}
            defaultConsent={params.consent === "1"}
            defaultTier={params.tier}
          />
        </div>
      </div>
    </section>
  );
}
