import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Sign in — ${brand.name}`,
  description: "Sign in to your Inklings parent account.",
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "That email doesn't look right. Please try again.",
  not_found: "We couldn't find an account with that email. Try starting a free story instead.",
  server: "Something went wrong. Please try again, or email hello@inklings.shop.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const params = await searchParams;
  const errorMsg = params.error ? ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.server : undefined;
  const ok = params.ok === "1";

  return (
    <section className="flex min-h-screen items-center justify-center bg-cream-100 p-6">
      <div className="w-full max-w-md card-base">
        <Link href="/" className="text-sm text-ink-500 underline">&larr; Back to {brand.name}</Link>
        <h1 className="mt-2 text-3xl font-bold text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-ink-700">We&apos;ll email you a magic link &mdash; no password.</p>

        {errorMsg && (
          <div role="alert" className="mt-6 rounded-card border-2 px-4 py-3 text-sm"
            style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}>
            <strong className="font-semibold">Couldn&apos;t sign in.</strong> {errorMsg}
          </div>
        )}
        {ok && (
          <div role="alert" className="mt-6 rounded-card border-2 px-4 py-3 text-sm"
            style={{ background: "#F0FDF4", borderColor: "#BBF7D0", color: "#166534" }}>
            Check your email for a sign-in link.
          </div>
        )}

        <form action="/api/auth/login" method="POST" className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-ink">Your email</label>
            <input id="email" name="email" type="email" required autoComplete="email"
              className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-4 py-3 text-base focus:border-coral focus:outline-none"
              placeholder="parent@example.com" />
          </div>
          <button type="submit" className="btn-primary btn-full btn-large">Email me a sign-in link</button>
          <p className="text-xs text-ink-500">
            New here? <Link href="/trial" className="text-coral underline">Start a free story</Link>.
          </p>
        </form>
      </div>
    </section>
  );
}
