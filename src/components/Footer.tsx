import Link from "next/link";
import { Sparkles } from "lucide-react";
import { brand } from "@/lib/brand";
import { AUDIENCE_LANDINGS } from "@/content/audience-landings";
import { LeadCapture } from "@/components/LeadCapture";
import { FooterGroup } from "@/components/FooterGroup";

/** ≥44px tap height on phones (py-2.5 on a 20px line), compact on desktop. */
const LINK = "flex min-h-[44px] items-center py-2 transition-colors hover:text-coral md:min-h-[32px] md:py-1";

export function Footer() {
  return (
    <footer className="bg-ink py-8 text-cream-100 md:py-16">
      <h2 className="sr-only">Footer</h2>
      <div className="container-ink">
        <div className="mb-6 md:mb-10">
          <LeadCapture />
        </div>
        <div className="mb-8 grid gap-6 md:mb-12 md:grid-cols-2 md:gap-12">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-coral" aria-hidden />
              <span className="text-base font-bold tracking-tight">{brand.name}</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-cream-200/80 md:mt-4">{brand.shortPitch}</p>
            <Link href="/trial" className="btn-primary btn-full mt-4 md:mt-6 md:w-auto">
              {brand.primaryCta}
            </Link>
            <p className="mt-2 text-[13px] text-cream-200/80">Free · no credit card · you approve every page</p>
          </div>
          <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2 md:gap-y-6 lg:grid-cols-4">
            <FooterGroup title="Product">
              <ul className="text-sm text-cream-200/80">
                <li><Link href="/how-it-works" className={LINK}>How it works</Link></li>
                <li><Link href="/features" className={LINK}>Features</Link></li>
                <li><Link href="/pricing" className={LINK}>Pricing</Link></li>
                <li><Link href="/gift" className={LINK}>Gift Premium</Link></li>
                <li><Link href="/try" className={LINK}>Try Sparky (no account)</Link></li>
              </ul>
            </FooterGroup>
            <FooterGroup title="Who it&apos;s for">
              <ul className="text-sm text-cream-200/80">
                {AUDIENCE_LANDINGS.map((l) => (
                  <li key={l.path}>
                    <Link href={l.path} className={LINK}>
                      {l.breadcrumbLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterGroup>
            <FooterGroup title="Help">
              <ul className="text-sm text-cream-200/80">
                <li><Link href="/faq" className={LINK}>FAQ</Link></li>
                <li><Link href="/watch" className={LINK}>Watch the tour</Link></li>
                <li><Link href="/security" className={LINK}>Safety &amp; privacy</Link></li>
                <li><Link href="/about" className={LINK}>About</Link></li>
                <li><Link href="/contact" className={LINK}>Contact</Link></li>
              </ul>
            </FooterGroup>
            <FooterGroup title="Legal">
              <ul className="text-sm text-cream-200/80">
                <li><Link href="/legal/privacy" className={LINK}>Privacy</Link></li>
                <li><Link href="/legal/terms" className={LINK}>Terms</Link></li>
                <li>
                  <Link href="/legal/terms#cancellation" className="flex min-h-[44px] items-center py-2 font-semibold text-coral transition-colors hover:text-cream-100 md:min-h-[32px] md:py-1">
                    Cancel anytime (1-click)
                  </Link>
                </li>
              </ul>
            </FooterGroup>
          </div>
        </div>
        <div className="border-t border-cream-200/10 pt-6 text-xs text-cream-200/70">
          &copy; {new Date().getFullYear()} {brand.name}. Built with care for families. Every page is parent-approved before anything publishes.
        </div>
      </div>
    </footer>
  );
}
