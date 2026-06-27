import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Forgot password — ${brand.name}`,
  description: "Reset your Inklings parent account password.",
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Please enter a valid email address.",
  server: "Something went wrong. Please try again, or email hello@inklings.shop.",
  rate_limited: "Too many attempts. Please wait a minute and try again.",
};

interface ForgotSearchParams {
  error?: string;
  ok?: string;
}

export default async function ForgotPage(props: {
  searchParams?: Promise<ForgotSearchParams>;
}) {
  const params: ForgotSearchParams = (await props?.searchParams) ?? {};
  const errorMsg = params.error
    ? ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.server
    : undefined;
  const ok = params.ok === "1";

  return (
    <section className="hero-storybook">
      <div className="container-ink section">
        <div className="mx-auto max-w-xl">
          <span className="eyebrow">Password reset</span>
          <h1 className="text-4xl font-bold text-ink md:text-5xl">Forgot your password?</h1>
          <p className="mt-4 text-lg text-ink-700">
            Enter your email and we&apos;ll send you a link to choose a new password.
          </p>

          {errorMsg && (
            <div
              role="alert"
              className="mt-6 rounded-card border-2 px-4 py-3 text-sm"
              style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}
            >
              {errorMsg}
            </div>
          )}
          {ok && (
            <div
              role="alert"
              className="mt-6 rounded-card border-2 px-4 py-3 text-sm"
              style={{ background: "#F0FDF4", borderColor: "#BBF7D0", color: "#166534" }}
            >
              If an account exists for that email, we sent password reset instructions.
            </div>
          )}

          <form action="/api/auth/forgot-password" method="POST" className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink">
                Email
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
            <button type="submit" className="btn-primary btn-large btn-full">
              Send reset link
            </button>
            <p className="text-xs text-ink-500">
              <Link href="/login" className="underline">
                Back to sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
