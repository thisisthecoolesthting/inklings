import Link from "next/link";
import { Sparkles, BookOpen, Library } from "lucide-react";

export function KidShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-100">
      <header className="border-b border-ink-100/60 bg-cream-50">
        <div className="container-ink flex items-center justify-between py-4">
          <Link href="/studio" className="flex items-center gap-2 font-bold text-ink">
            <Sparkles className="h-7 w-7 text-coral" aria-hidden />
            Sparky&apos;s Studio
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/studio"
              className="flex items-center gap-1 rounded-button px-3 py-2 text-sm font-medium text-ink-700 hover:bg-mint-100"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Create</span>
            </Link>
            <Link
              href="/library"
              className="flex items-center gap-1 rounded-button px-3 py-2 text-sm font-medium text-ink-700 hover:bg-mint-100"
            >
              <Library className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">My books</span>
            </Link>
            <Link
              href="/grownup"
              className="rounded-button border border-ink-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-500 hover:bg-cream-200"
            >
              Grown-ups
            </Link>
          </nav>
        </div>
      </header>
      <main className="container-ink py-8">{children}</main>
    </div>
  );
}
