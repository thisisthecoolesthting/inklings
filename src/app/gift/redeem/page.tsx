import Link from "next/link";
import { brand } from "@/lib/brand";

export default function GiftRedeemPage() {
  return (
    <section className="section">
      <div className="container-ink mx-auto max-w-md">
        <div className="card-base">
          <h1 className="text-2xl font-bold text-ink">Redeem a gift code</h1>
          <p className="mt-2 text-sm text-ink-700">
            Enter the code from your gift email to unlock Premium on {brand.name}.
          </p>
          <form action="/api/gift/redeem" method="POST" className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-ink">Gift code</span>
              <input
                name="code"
                required
                placeholder="INK-XXXX-XXXX"
                className="mt-1 w-full rounded-button border border-ink-100 px-4 py-3 font-mono uppercase"
              />
            </label>
            <button type="submit" className="btn-primary btn-full">
              Redeem Premium
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-ink-500">
            Need an account?{" "}
            <Link href="/login?next=/gift/redeem" className="text-coral underline">
              Sign in first
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
