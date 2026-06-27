import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Reset password — ${brand.name}`,
  description: "Choose a new password for your Inklings parent account.",
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Please choose a valid password.",
  weak_password: "Password must be at least 8 characters.",
  mismatch: "Passwords didn't match. Please try again.",
  expired: "This reset link has expired. Request a new one.",
  rate_limited: "Too many attempts. Please wait a minute and try again.",
};

interface ResetSearchParams {
  token?: string;
  error?: string;
}

export default async function ResetPasswordPage(props: {
  searchParams?: Promise<ResetSearchParams>;
}) {
  const params: ResetSearchParams = (await props?.searchParams) ?? {};
  const errorMsg = params.error
    ? ERROR_MESSAGES[params.error] ?? "Something went wrong. Please try again."
    : undefined;
  const hasToken = Boolean(params.token);

  return (
    <section className="hero-storybook">
      <div className="container-ink section">
        <div className="mx-auto max-w-xl">
          <span className="eyebrow">Password reset</span>
          <h1 className="text-4xl font-bold text-ink md:text-5xl">Choose a new password</h1>

          {!hasToken ? (
            <div className="mt-6 space-y-4">
              <p className="text-lg text-ink-700">
                This reset link is missing or invalid. Request a fresh link from the forgot
                password page.
              </p>
              <Link href="/forgot-password" className="btn-primary btn-large inline-block">
                Request reset link
              </Link>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div
                  role="alert"
                  className="mt-6 rounded-card border-2 px-4 py-3 text-sm"
                  style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}
                >
                  {errorMsg}
                </div>
              )}

              <form action="/api/auth/reset-password" method="POST" className="mt-8 space-y-4">
                <input type="hidden" name="token" value={params.token} />
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-ink">
                    New password
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
                </div>
                <div>
                  <label
                    htmlFor="password_confirm"
                    className="block text-sm font-semibold text-ink"
                  >
                    Confirm new password
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
                <button type="submit" className="btn-primary btn-large btn-full">
                  Update password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
