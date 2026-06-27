import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Sign in — ${brand.name}`,
  description: "Sign in to your Inklings parent account.",
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "That email or password didn't match. Please try again.",
  missing: "Please enter your email and password.",
  server: "Something went wrong on our end. Please try again, or email hello@inklings.shop.",
  rate_limited: "Too many attempts. Please wait a minute and try again.",
};

interface LoginSearchParams {
  error?: string;
  next?: string;
}

export default async function LoginPage(props: {
  searchParams?: Promise<LoginSearchParams>;
}) {
  const params: LoginSearchParams = (await props?.searchParams) ?? {};

  const errorMsg = params.error
    ? ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.server
    : undefined;

  return (
    <section className="hero-storybook">
      <div className="container-ink section">
        <div className="mx-auto max-w-xl">
          <span className="eyebrow">Sign in</span>
          <h1 className="text-4xl font-bold text-ink md:text-5xl">Welcome back.</h1>
          <p className="mt-4 text-lg text-ink-700">
            Sign in with the email and password you used when you created your account.
          </p>

          {errorMsg && (
            <div
              role="alert"
              className="mt-6 rounded-card border-2 px-4 py-3 text-sm"
              style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}
            >
              <strong className="font-semibold">Couldn&apos;t sign you in.</strong> {errorMsg}
            </div>
          )}

          <form action="/api/auth/login" method="POST" className="mt-8 space-y-4">
            {params.next && <input type="hidden" name="next" value={params.next} />}
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
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-ink">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-ink-500 underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                minLength={8}
                className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-4 py-3 text-base focus:border-coral focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary btn-large btn-full">
              Sign in
            </button>
            <p className="text-xs text-ink-500">
              New to Inklings?{" "}
              <Link href="/trial" className="underline">
                Create a free account
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
