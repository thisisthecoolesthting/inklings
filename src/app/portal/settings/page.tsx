import { getSession } from "@/lib/session";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) return null;
  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-ink-700">Account, billing, and data controls.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-base">
          <h2 className="text-xl font-bold text-ink">Account</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div><dt className="text-ink-500">Email</dt><dd className="text-ink">{session.email}</dd></div>
            <div><dt className="text-ink-500">Plan</dt><dd className="text-ink">{session.tier}</dd></div>
          </dl>
        </div>
        <div className="card-base">
          <h2 className="text-xl font-bold text-ink">Billing</h2>
          <p className="mt-2 text-sm text-ink-700">Manage your subscription via Stripe Customer Portal.</p>
          <form action="/api/billing/portal" method="POST"><button type="submit" className="btn-secondary mt-4">Open billing portal</button></form>
        </div>
      </div>

      {/* ── Your data / Danger zone ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card-base">
          <h2 className="text-xl font-bold text-ink">Your data</h2>
          <p className="mt-2 text-sm text-ink-700">
            Download a complete copy of your account data — children, characters, worlds, series, books, and orders — as a JSON file.
          </p>
          <a href="/api/portal/export" className="btn-secondary mt-4 inline-block">
            Download my data
          </a>
        </div>

        <div className="card-base">
          <h2 className="text-xl font-bold text-ink">Danger zone</h2>
          <p className="mt-2 text-sm text-ink-700">
            Permanently deletes your account and <strong>all</strong> associated children, characters, and books. This action cannot be undone.
          </p>
          <form action="/api/portal/delete-account" method="POST" className="mt-4">
            <button
              type="submit"
              className="btn-secondary border-coral text-coral hover:bg-coral hover:text-white"
            >
              Delete my account
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
