import fs from "node:fs/promises";
import path from "node:path";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/stripe";
import { resolveShipping } from "./resolve-shipping";

// CJS modules — loaded at runtime on the Node server (same as StoryFawn print stack)
// eslint-disable-next-line
const { buildInteriorPDF, buildCoverPDF } = require("./print-pdf.js") as {
  buildInteriorPDF: (opts: {
    title: string;
    childName: string;
    pages: string[];
    pageImages: (Buffer | null)[];
  }) => Promise<Uint8Array>;
  buildCoverPDF: (opts: {
    title: string;
    childName: string;
    blurb: string;
    coverImage: Buffer | null;
    pageCount: number;
    binding: string;
  }) => Promise<Uint8Array>;
};
// eslint-disable-next-line
const { submitPrintOrder } = require("./print-order-lulu.js") as {
  submitPrintOrder: (opts: {
    interiorPdfUrl: string;
    coverPdfUrl: string;
    pageCount: number;
    shipping: ReturnType<typeof resolveShipping>;
    contactEmail: string;
    externalId: string;
    title: string;
  }) => Promise<{ jobId: string | number; status?: string }>;
};

async function readPublicAsset(relativeUrl: string | null | undefined): Promise<Buffer | null> {
  if (!relativeUrl) return null;
  const filepath = path.join(process.cwd(), "public", relativeUrl.replace(/^\//, ""));
  try {
    return await fs.readFile(filepath);
  } catch {
    return null;
  }
}

/**
 * Build Lulu-ready PDFs and submit a print job (same printer as StoryFawn).
 * Idempotent: skips if order already has a Lulu job id.
 */
export async function fulfillPrintOrder(
  orderId: string,
  session: Stripe.Checkout.Session,
): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      book: {
        include: {
          pages: { orderBy: { pageNumber: "asc" } },
          child: true,
        },
      },
      user: true,
    },
  });

  if (!order) {
    console.error("[fulfill-print] order not found:", orderId);
    return;
  }
  if (order.luluJobId) {
    console.log("[fulfill-print] already submitted:", orderId, order.luluJobId);
    return;
  }

  const book = order.book;
  const childName = book.child.name || "your child";
  const pageTexts = book.pages.map((p) => p.textContent);
  const pageImages: (Buffer | null)[] = [];

  for (const p of book.pages) {
    pageImages.push(await readPublicAsset(p.imageUrlHd ?? p.imageUrlLowres));
  }

  let coverImage = await readPublicAsset(book.coverUrl);
  if (!coverImage) coverImage = pageImages.find(Boolean) ?? null;

  const title = book.title;
  const interiorBytes = await buildInteriorPDF({
    title,
    childName,
    pages: pageTexts,
    pageImages,
  });
  const pageCount = Math.ceil((1 + pageTexts.length) / 4) * 4;
  const binding = pageCount >= 24 ? "hardcover" : "softcover";
  const blurb = `A personalized illustrated storybook made just for ${childName}.`;
  const coverPdfBytes = await buildCoverPDF({
    title,
    childName,
    blurb,
    coverImage,
    pageCount,
    binding,
  });

  const printDir = path.join(process.cwd(), "public", "uploads", "print", orderId);
  await fs.mkdir(printDir, { recursive: true });
  await fs.writeFile(path.join(printDir, "print-interior.pdf"), Buffer.from(interiorBytes));
  await fs.writeFile(path.join(printDir, "print-cover.pdf"), Buffer.from(coverPdfBytes));

  const base = siteUrl().replace(/\/$/, "");
  const interiorPdfUrl = `${base}/uploads/print/${orderId}/print-interior.pdf`;
  const coverPdfUrl = `${base}/uploads/print/${orderId}/print-cover.pdf`;

  const shipping = resolveShipping(session);
  const contactEmail = session.customer_details?.email ?? order.user.email;

  if (!shipping.line1 || !shipping.city || !shipping.country) {
    console.error("[fulfill-print] incomplete shipping for order", orderId, shipping);
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "paid_needs_shipping" },
    });
    return;
  }

  const luluResult = await submitPrintOrder({
    interiorPdfUrl,
    coverPdfUrl,
    pageCount,
    shipping,
    contactEmail,
    externalId: `inklings-print-${orderId}`,
    title,
  });

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "fulfilled",
      luluJobId: String(luluResult.jobId),
      luluStatus: luluResult.status ?? "submitted",
      printSubmittedAt: new Date(),
    },
  });

  await prisma.book.update({
    where: { id: book.id },
    data: { status: "ordered", kdpReady: true },
  });

  console.log("[fulfill-print] Lulu job submitted:", orderId, luluResult.jobId);
}
