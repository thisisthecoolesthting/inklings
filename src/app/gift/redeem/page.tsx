import Link from "next/link";
import { CheckCircle2, Gift, Sparkles, AlertCircle, LogIn } from "lucide-react";
import { brand } from "@/lib/brand";
import { getSession } from "@/lib/session";
import { redeemGiftAction } from "./actions";
import { GiftCodeInput } from "@/components/gift/GiftCodeInput";

const ERROR_COPY: Record<string, string> = {
  invalid_code: "That code doesn't look right. Check your gift email and try again.",
  already_redeemed: "This code was already used. Each gift code works once.",
  expired: "This gift code has expired. Ask the giver for a new one.",
  user_not_found: "We couldn't find your account. Try signing in again.",
  login_required: "Sign in first, then enter your gift code.",
};

function formatMonths(months: number): string {
  if (months >= 120) return "Lifetime Premium";
  if (months === 12) return "1 year of Premium";
  if (months === 1) return "1 month of Premium";
  return `${months} months of Premium`;
}

function formatUntil(iso: string | undefined): string {
  if (!iso) return "your account";
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function GiftRedeemPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; until?: string; months?: string }>;
}) {
  const sp = await searchParams;
  const session = await getSession();
  const months = sp.months ? Number(sp.months) : 0;
  const errorMsg = sp.error ? (ERROR_COPY[sp.error] ?? "Something went wrong. Please try again.") : null;

  if (sp.success === "1") {
    return (
      <section className="section">
        <div className="container-ink mx-auto max-w-lg">
          <div className="card-base border-mint-200 bg-gradient-to-b from-mint-50 to-cream-50 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint-100">
              <CheckCircle2 className="h-9 w-9 text-mint-700" aria-hidden />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-ink">Premium unlocked!</h1>
            <p className="mt-3 text-lg text-ink-700">
              {months > 0 ? formatMonths(months) : "Premium"} is now active on your account.
            </p>
            {sp.until && (
              <p className="mt-2 text-sm text-ink-600">
                Enjoy unlimited stories through <strong>{formatUntil(sp.until)}</strong>.
              </p>
            )}
            <ul className="mx-auto mt-8 max-w-sm space-y-2 text-left text-sm text-ink-700">
              <li className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 flex-none text-coral" aria-hidden />
                Unlimited stories and characters
              </li>
              <li className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 flex-none text-coral" aria-hidden />
                HD print-ready PDFs (no watermark)
              </li>
              <li className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 flex-none text-coral" aria-hidden />
                Series memory — characters return every story
              </li>
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/studio" className="btn-primary inline-flex justify-center">
                Start a story with your child
              </Link>
              <Link href="/portal" className="btn-secondary inline-flex justify-center">
                Open parent portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-ink mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <span className="eyebrow">Gift Premium</span>
          <h1 className="section-title mt-2">Redeem your gift code</h1>
          <p className="mx-auto mt-3 max-w-md text-ink-700">
            Unlock {brand.name} Premium — unlimited stories, series memory, and print-ready books.
          </p>
        </div>

        <ol className="mb-8 flex justify-center gap-2 text-xs font-medium text-ink-500 sm:gap-4 sm:text-sm">
          <li className={session ? "text-mint-700" : "text-coral font-semibold"}>
            1. Sign in {session ? "✓" : ""}
          </li>
          <li className="text-ink-300">→</li>
          <li className={session ? "text-coral font-semibold" : ""}>2. Enter code</li>
          <li className="text-ink-300">→</li>
          <li>3. Create stories</li>
        </ol>

        {errorMsg && (
          <div
            className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden />
            <p>{errorMsg}</p>
          </div>
        )}

        {!session ? (
          <div className="card-base text-center">
            <LogIn className="mx-auto h-10 w-10 text-coral" aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-ink">Sign in to redeem</h2>
            <p className="mt-2 text-sm text-ink-700">
              Gift codes attach to your parent account. Sign in (or create one) first — we&apos;ll bring you
              right back here.
            </p>
            <Link href="/login?next=/gift/redeem" className="btn-primary btn-full mt-6 inline-flex justify-center">
              Sign in to redeem
            </Link>
            <p className="mt-4 text-xs text-ink-500">
              New here?{" "}
              <Link href="/trial" className="text-coral underline">
                Start a free story
              </Link>{" "}
              then redeem from this page.
            </p>
          </div>
        ) : (
          <div className="card-base">
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-cream-100 px-4 py-3 text-sm">
              <Gift className="h-5 w-5 flex-none text-coral" aria-hidden />
              <p className="text-ink-700">
                Redeeming as <strong className="text-ink">{session.email}</strong>
                {" · "}
                <Link href="/login?next=/gift/redeem" className="text-coral underline">
                  Switch account
                </Link>
              </p>
            </div>

            <form action={redeemGiftAction} className="space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Gift code</span>
                <GiftCodeInput />
                <span className="mt-2 block text-xs text-ink-500">
                  From your gift email — usually looks like INK-XXXX-XXXX
                </span>
              </label>
              <button type="submit" className="btn-primary btn-full">
                Redeem Premium
              </button>
            </form>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-ink-500">
          Don&apos;t have a code yet?{" "}
          <Link href="/gift" className="text-coral underline">
            Gift Premium to a family
          </Link>
        </p>
      </div>
    </section>
  );
}
