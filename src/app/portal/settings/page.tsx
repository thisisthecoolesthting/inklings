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
        <div className="card-base">
          <h2 className="text-xl font-bold text-ink">Delete account</h2>
          <p className="mt-2 text-sm text-ink-700">Erase your account and all your child&apos;s creations. This cannot be undone.</p>
          <button className="btn-secondary mt-4 border-coral text-coral hover:bg-coral hover:text-white" type="button">Delete</button>
        </div>
      </div>
    </>
  );
}
