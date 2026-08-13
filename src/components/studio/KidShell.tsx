import Link from "next/link";
import { Sparkles, BookOpen, Library } from "lucide-react";

export function KidShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-100">
      <header className="sticky top-0 z-30 border-b-2 border-coral/20 bg-cream-50/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/studio" className="flex items-center gap-2 text-xl font-bold text-ink">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral text-white">
              <Sparkles className="h-6 w-6" aria-hidden />
            </span>
            Sparky
          </Link>
          <nav className="flex items-center gap-2" aria-label="Kid studio">
            <Link
              href="/studio"
              className="flex min-h-[52px] min-w-[52px] items-center justify-center gap-1 rounded-2xl bg-mint-100 px-3 text-base font-bold text-ink hover:bg-mint-500"
            >
              <BookOpen className="h-5 w-5" aria-hidden />
              <span>Make</span>
            </Link>
            <Link
              href="/library"
              className="flex min-h-[52px] min-w-[52px] items-center justify-center gap-1 rounded-2xl bg-cream-200 px-3 text-base font-bold text-ink hover:bg-mint-100"
            >
              <Library className="h-5 w-5" aria-hidden />
              <span>Books</span>
            </Link>
            <Link
              href="/grownup"
              className="rounded-2xl px-2 py-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500 hover:bg-cream-200"
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
