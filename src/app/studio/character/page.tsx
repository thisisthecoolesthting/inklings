import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Sparkles } from "lucide-react";

export default async function CharacterIntro({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/studio");
  const params = await searchParams;
  return (
    <div className="container-ink py-10">
      <Link href="/studio" className="text-sm text-ink-500 underline">&larr; Back</Link>
      <header className="mt-4 mb-10 text-center">
        <Sparkles className="mx-auto h-12 w-12 text-coral" aria-hidden />
        <h1 className="mt-4 text-3xl font-bold text-ink">Let&apos;s make a new character!</h1>
        <p className="mt-2 text-lg text-ink-700">Show Sparky a picture, draw one, or just tell me about them.</p>
      </header>
      <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-3">
        <div className="card-base text-center">
          <div className="text-4xl">📸</div>
          <h2 className="mt-3 text-lg font-bold text-ink">Take a picture</h2>
          <p className="text-sm text-ink-500">Of a stuffed animal or a toy</p>
        </div>
        <div className="card-base text-center">
          <div className="text-4xl">✏️</div>
          <h2 className="mt-3 text-lg font-bold text-ink">Snap your drawing</h2>
          <p className="text-sm text-ink-500">Of a character you drew</p>
        </div>
        <div className="card-base text-center">
          <div className="text-4xl">🗣️</div>
          <h2 className="mt-3 text-lg font-bold text-ink">Tell Sparky</h2>
          <p className="text-sm text-ink-500">Talk about who they are</p>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-md text-center text-xs text-ink-500">
        New characters wait in your sandbox until your grown-up says they&apos;re ready.
      </p>
    </div>
  );
}
