"use client";

import { useRef, useState } from "react";
import Link from "next/link";

/**
 * Signup form for /trial.
 *
 * - Preserves the entered email + consent checkbox across a failed
 *   server-side submit (values come back via `defaultEmail`/`defaultConsent`,
 *   populated from the redirect's query string).
 * - Adds basic client-side validation (password length + match) so an
 *   obviously-bad submit never round-trips to the server.
 */
export function TrialForm({
  defaultEmail,
  defaultConsent,
  defaultTier,
}: {
  defaultEmail?: string;
  defaultConsent?: boolean;
  defaultTier?: string;
}) {
  const [clientError, setClientError] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const password = passwordRef.current?.value ?? "";
    const confirm = confirmRef.current?.value ?? "";

    if (password.length < 8) {
      e.preventDefault();
      setClientError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      e.preventDefault();
      setClientError("Passwords didn't match. Please try again.");
      return;
    }
    setClientError(null);
  }

  return (
    <>
      {clientError && (
        <div
          role="alert"
          className="mt-6 rounded-card border-2 px-4 py-3 text-sm"
          style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}
        >
          <strong className="font-semibold">Couldn&apos;t create your account.</strong> {clientError}
        </div>
      )}

      <form
        action="/api/auth/signup"
        method="POST"
        className="mt-8 space-y-4"
        onSubmit={handleSubmit}
      >
        {defaultTier && <input type="hidden" name="tier" value={defaultTier} />}
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
            defaultValue={defaultEmail}
            className="mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-4 py-3 text-base focus:border-coral focus:outline-none"
            placeholder="parent@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-ink">
            Password
          </label>
          <input
            ref={passwordRef}
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
            ref={confirmRef}
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
              defaultChecked={defaultConsent}
              className="mt-0.5 shrink-0 accent-coral"
            />
            <label htmlFor="coppa_consent" className="text-xs text-ink-600 leading-relaxed">
              I am this child&apos;s parent or legal guardian, and I consent to Inklings
              collecting the information my child provides to create their stories.
            </label>
          </div>
          <p className="text-xs text-ink-500">
            Inklings is designed for children ages 4-8 and is operated for parents. We never
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
    </>
  );
}
