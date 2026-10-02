import Link from "next/link";
import { Sparkles, BookOpen, Library } from "lucide-react";
import { ReadAloudToggle } from "./ReadAloudToggle";

export function KidShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-cream-100 pb-[env(safe-area-inset-bottom)]">
      <header className="sticky top-0 z-30 border-b-2 border-coral/20 bg-cream-50/95 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-1 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] py-2">
          <Link
            href="/studio"
            aria-label="Sparky home"
            className="flex min-h-[64px] items-center gap-2 text-xl font-bold text-ink"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white">
              <Sparkles className="h-6 w-6" aria-hidden />
            </span>
            <span className="hidden sm:inline">Sparky</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Kid studio">
            <Link
              href="/studio"
              className="flex h-16 min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-2xl bg-mint-100 px-2 text-sm font-bold text-ink hover:bg-mint-500 focus-visible:outline focus-visible:outline-4 focus-visible:outline-coral sm:flex-row sm:gap-1 sm:px-3 sm:text-base"
            >
              <BookOpen className="h-6 w-6 sm:h-5 sm:w-5" aria-hidden />
              <span>Make</span>
            </Link>
            <Link
              href="/library"
              className="flex h-16 min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-2xl bg-cream-200 px-2 text-sm font-bold text-ink hover:bg-mint-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-coral sm:flex-row sm:gap-1 sm:px-3 sm:text-base"
            >
              <Library className="h-6 w-6 sm:h-5 sm:w-5" aria-hidden />
              <span>Books</span>
            </Link>
            <ReadAloudToggle />
            <Link
              href="/grownup"
              className="flex min-h-[44px] items-center rounded-2xl px-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500 hover:bg-cream-200"
            >
              Grown-up
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
