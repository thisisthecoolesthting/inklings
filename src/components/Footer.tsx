import Link from "next/link";
import { Sparkles } from "lucide-react";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="bg-ink py-16 text-cream-100">
      <div className="container-ink">
        <div className="mb-12 grid gap-12 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-coral" aria-hidden />
              <span className="text-base font-bold tracking-tight">{brand.name}</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-cream-200/80">
              {brand.shortPitch}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Product</h4>
              <ul className="space-y-2 text-sm text-cream-200/80">
                <li><Link href="/how-it-works" className="transition-colors hover:text-coral">How it works</Link></li>
                <li><Link href="/pricing" className="transition-colors hover:text-coral">Pricing</Link></li>
                <li><Link href="/security" className="transition-colors hover:text-coral">Safety &amp; privacy</Link></li>
                <li><Link href="/trial" className="transition-colors hover:text-coral">Start a free story</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-sm text-cream-200/80">
                <li><Link href="/about" className="transition-colors hover:text-coral">About</Link></li>
                <li><Link href="/contact" className="transition-colors hover:text-coral">Contact</Link></li>
                <li><Link href="/faq" className="transition-colors hover:text-coral">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-cream-200/80">
                <li><Link href="/legal/privacy" className="transition-colors hover:text-coral">Privacy</Link></li>
                <li><Link href="/legal/terms" className="transition-colors hover:text-coral">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-cream-200/10 pt-6 text-xs text-cream-200/60">
          &copy; {new Date().getFullYear()} {brand.name}. Built with care for families. AI-assisted illustrations &amp; storytelling — every page is parent-approved before anything publishes.
        </div>
      </div>
    </footer>
  );
}
