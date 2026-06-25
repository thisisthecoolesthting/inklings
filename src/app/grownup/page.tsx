import Link from "next/link";
import { GrownupHoldButton } from "@/components/grownup/GrownupHoldButton";

export default async function GrownupUnlockPage({
  searchParams,
}: {
  searchParams?: Promise<{ intent?: string; book?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const redirectPath = sp.intent === "print" ? "/portal/approvals" : "/portal";

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-4">
      <div className="card-base max-w-md text-center">
        <h1 className="text-2xl font-bold text-ink">Grown-up area</h1>
        {sp.intent === "print" ? (
          <p className="mt-3 text-ink-700">
            Your child finished a story and wants a <strong>real printed book</strong>!
            Unlock below, approve their story, then order a hardcover from Approvals.
          </p>
        ) : (
          <p className="mt-3 text-ink-700">
            This part is for parents and grandparents — settings, approvals, and billing.
          </p>
        )}
        <p className="mt-2 text-sm text-ink-500">Hold the button below for 2 seconds. No password needed.</p>
        <div className="mt-8">
          <GrownupHoldButton redirectPath={redirectPath} />
        </div>
        <Link href="/studio" className="mt-6 inline-block text-sm text-ink-500 underline">
          ← Back to Sparky
        </Link>
      </div>
    </div>
  );
}
