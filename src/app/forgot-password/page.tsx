import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Forgot password — ${brand.name}`,
  description: "We use magic links — no passwords to forget.",
};

export default function ForgotPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-cream-100 p-6">
      <div className="w-full max-w-md card-base text-center">
        <h1 className="text-3xl font-bold text-ink">No password needed</h1>
        <p className="mt-3 text-ink-700">
          Inklings uses email sign-in links &mdash; nothing to forget. Just enter your email
          on the sign-in page and we&apos;ll send you a fresh link.
        </p>
        <Link href="/login" className="btn-primary btn-large btn-full mt-6">Go to sign in</Link>
      </div>
    </section>
  );
}
