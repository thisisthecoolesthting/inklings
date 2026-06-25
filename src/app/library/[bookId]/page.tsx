import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { BookReader } from "@/components/library/BookReader";

export default async function LibraryBookPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookId: string }>;
  searchParams?: Promise<{ child?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/library");

  const { bookId } = await params;
  const sp = (await searchParams) ?? {};

  const book = await prisma.book.findFirst({
    where: { id: bookId, child: { parentId: session.userId }, status: { in: ["approved", "exported", "ordered"] } },
    include: { pages: { orderBy: { pageNumber: "asc" } }, series: true },
  });
  if (!book) notFound();

  const childQ = sp.child ? `?child=${sp.child}` : "";
  const seriesHref = book.seriesId ? `/library/series/${book.seriesId}${childQ}` : `/library${childQ}`;

  return (
    <>
      <Link href={seriesHref} className="text-sm text-ink-500 underline">← Back to shelf</Link>
      <div className="mt-4">
        <BookReader
          title={book.title}
          pages={book.pages.map((p) => ({
            pageNumber: p.pageNumber,
            textContent: p.textContent,
            imageUrl: p.imageUrlLowres ?? p.imageUrlHd,
          }))}
        />
      </div>
    </>
  );
}
