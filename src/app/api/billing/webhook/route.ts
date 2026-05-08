import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });

  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    return NextResponse.json({ error: `bad_signature_${(err as Error).message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const cs = event.data.object as Stripe.Checkout.Session;
      const userId = (cs.metadata?.userId ?? cs.subscription ? null : null) as string | null;
      if (cs.mode === "subscription" && cs.customer) {
        const customer = typeof cs.customer === "string" ? cs.customer : cs.customer.id;
        await prisma.user.updateMany({
          where: { stripeCustomerId: customer },
          data: { subscriptionTier: "premium", subscriptionStatus: "active" },
        });
      } else if (cs.mode === "payment" && cs.metadata?.bookId && cs.metadata?.userId) {
        await prisma.order.create({
          data: {
            userId: cs.metadata.userId,
            bookId: cs.metadata.bookId,
            stripePaymentIntent: typeof cs.payment_intent === "string" ? cs.payment_intent : null,
            quantity: 1,
            unitPriceCents: cs.amount_total ?? 1999,
            status: "paid",
          },
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const tier = sub.status === "active" || sub.status === "trialing" ? "premium" : "free";
      await prisma.user.updateMany({
        where: { stripeCustomerId: customer },
        data: { subscriptionTier: tier, subscriptionStatus: sub.status },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
