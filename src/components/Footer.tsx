import Link from "next/link";
import { Sparkles } from "lucide-react";
import { brand } from "@/lib/brand";
import { AUDIENCE_LANDINGS } from "@/content/audience-landings";
import { LeadCapture } from "@/components/LeadCapture";

/** ≥44px tap height on phones (py-2.5 on a 20px line), compact on desktop. */
const LINK = "block py-2.5 transition-colors hover:text-coral md:py-1";
const TITLE = "mb-2 text-sm font-semibold text-white md:mb-4";

export function Footer() {
  return (
    <footer className="bg-ink py-12 text-cream-100 md:py-16">
      <h2 className="sr-only">Footer</h2>
      <div className="container-ink">
        <div className="mb-10">
          <LeadCapture />
        </div>
        <div className="mb-12 grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-coral" aria-hidden />
              <span className="text-base font-bold tracking-tight">{brand.name}</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-cream-200/80">{brand.shortPitch}</p>
            <Link href="/trial" className="btn-primary btn-full mt-6 md:w-auto">
              {brand.primaryCta}
            </Link>
            <p className="mt-2 text-[13px] text-cream-200/80">Free · no credit card · you approve every page</p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            <div>
              <p className={TITLE}>Product</p>
              <ul className="text-sm text-cream-200/80">
                <li><Link href="/how-it-works" className={LINK}>How it works</Link></li>
                <li><Link href="/features" className={LINK}>Features</Link></li>
                <li><Link href="/pricing" className={LINK}>Pricing</Link></li>
                <li><Link href="/gift" className={LINK}>Gift Premium</Link></li>
                <li><Link href="/try" className={LINK}>Try Sparky (no account)</Link></li>
              </ul>
            </div>
            <div>
              <p className={TITLE}>Who it&apos;s for</p>
              <ul className="text-sm text-cream-200/80">
                {AUDIENCE_LANDINGS.map((l) => (
                  <li key={l.path}>
                    <Link href={l.path} className={LINK}>
                      {l.breadcrumbLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={TITLE}>Help</p>
              <ul className="text-sm text-cream-200/80">
                <li><Link href="/faq" className={LINK}>FAQ</Link></li>
                <li><Link href="/watch" className={LINK}>Watch the tour</Link></li>
                <li><Link href="/security" className={LINK}>Safety &amp; privacy</Link></li>
                <li><Link href="/about" className={LINK}>About</Link></li>
                <li><Link href="/contact" className={LINK}>Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className={TITLE}>Legal</p>
              <ul className="text-sm text-cream-200/80">
                <li><Link href="/legal/privacy" className={LINK}>Privacy</Link></li>
                <li><Link href="/legal/terms" className={LINK}>Terms</Link></li>
                <li>
                  <Link href="/legal/terms#cancellation" className="block py-2.5 font-semibold text-coral transition-colors hover:text-cream-100 md:py-1">
                    Cancel anytime (1-click)
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-cream-200/10 pt-6 text-xs text-cream-200/70">
          &copy; {new Date().getFullYear()} {brand.name}. Built with care for families. Every page is parent-approved before anything publishes.
        </div>
      </div>
    </footer>
  );
}
