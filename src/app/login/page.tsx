import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Sign in — ${brand.name}`,
  description: "Sign in to your Inklings parent account.",
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Please double-check the email address and try again.",
  missing: "Please enter your email address.",
  server: "Something went wrong on our end. Please try again, or email hello@inklings.shop.",
};

interface LoginSearchParams {
  error?: string;
  ok?: string;
}

export default async function LoginPage(props: {
  searchParams?: Promise<LoginSearchParams> | LoginSearchParams;
}) {
  const raw = props?.searchParams;
  const params: LoginSearchParams =
    raw && typeof (raw as Promise<unknown>).then === "function"
      ? await (raw as Promise<LoginSearchParams>)
      : ((raw as LoginSearchParams) ?? {});

  const errorMsg = params.error
    ? ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.server
    : undefined;
  const ok = params.ok === "1";

  return (
    <section className="hero-storybook">
      <div className="container-ink section">
        <div className="mx-auto max-w-xl">
          <span className="eyebrow">Sign in</span>
          <h1 className="text-4xl font-bold text-ink md:text-5xl">Welcome back.</h1>
          <p className="mt-4 text-lg text-ink-700">
            We&apos;ll email you a secure sign-in link. No password needed.
          </p>

          {errorMsg && (
            <div
              role="alert"
              className="mt-6 rounded-card border-2 px-4 py-3 text-sm"
              style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}
            >
              <strong className="font-semibold">Couldn&apos;t sign you in.</strong>{" "}
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
            <button type="submit" className="btn-primary btn-large btn-full">
              Email me a sign-in link
            </button>
            <p className="text-xs text-ink-500">
              New to Inklings?{" "}
              <Link href="/trial" className="underline">Start free</Link>.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
