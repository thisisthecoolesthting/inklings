import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { getStripe, premiumPriceId, printPriceId, siteUrl } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

const Schema = z.object({
  tier: z.enum(["premium", "print"]),
  bookId: z.string().min(8).max(40).optional(),
  quantity: z.coerce.number().int().min(1).max(10).optional(),
});

/**
 * POST /api/billing/checkout
 * Body: { tier: 'premium' | 'print', bookId?, quantity? }
 * Returns 303 redirect to Stripe Checkout, OR 503 if Stripe is not configured.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "stripe_not_configured", message: "Premium checkout will be live once Price IDs are minted." },
      { status: 503 },
    );
  }

  const form = await req.formData().catch(() => null);
  const body = form
    ? { tier: form.get("tier"), bookId: form.get("bookId") ?? undefined, quantity: form.get("quantity") ?? undefined }
    : await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });

  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/login?next=/pricing", getSiteUrl()), { status: 303 });

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "user_not_found" }, { status: 404 });

  // Ensure Stripe customer
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  if (parsed.data.tier === "premium") {
    const priceId = premiumPriceId();
    if (!priceId) {
      return NextResponse.json({ error: "premium_price_id_unset" }, { status: 503 });
    }
    const checkout = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 14, metadata: { userId: user.id } },
      success_url: `${siteUrl()}/portal?upgraded=1`,
      cancel_url: `${siteUrl()}/pricing`,
      allow_promotion_codes: true,
    });
    return NextResponse.redirect(checkout.url!, { status: 303 });
  }

  // tier === 'print'
  const priceId = printPriceId();
  if (!priceId) return NextResponse.json({ error: "print_price_id_unset" }, { status: 503 });
  const bookId = parsed.data.bookId;
  if (!bookId) return NextResponse.json({ error: "bookId_required_for_print" }, { status: 400 });
  const book = await prisma.book.findFirst({
    where: { id: bookId, child: { parentId: user.id } },
  });
  if (!book) return NextResponse.json({ error: "book_not_found" }, { status: 404 });
  if (book.status !== "approved") return NextResponse.json({ error: "book_not_approved" }, { status: 400 });

  const quantity = parsed.data.quantity ?? 1;
  const checkout = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [{ price: priceId, quantity }],
    metadata: { userId: user.id, bookId: book.id, kind: "print" },
    success_url: `${siteUrl()}/portal/orders?ordered=1`,
    cancel_url: `${siteUrl()}/portal/orders`,
    shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU"] },
  });
  return NextResponse.redirect(checkout.url!, { status: 303 });
}

export async function GET(req: NextRequest) {
  // Convenience: GET with query string also works for the [Try Premium] link.
  const tier = req.nextUrl.searchParams.get("tier");
  if (!tier) return NextResponse.json({ error: "tier_required" }, { status: 400 });
  const fakeBody = new FormData();
  fakeBody.set("tier", tier);
  const fakeReq = new NextRequest(req.url, { method: "POST", body: fakeBody as any });
  return POST(fakeReq);
}
