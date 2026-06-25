import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { createGiftCode, giftPlanMonths } from "@/lib/gift-codes";
import { sendGiftCodeEmail, sendPrintOrderConfirmation } from "@/lib/email";

export const runtime = "nodejs";

const GIFT_LABELS: Record<string, string> = {
  gift_1m: "1 month of Premium",
  gift_6m: "6 months of Premium",
  gift_12m: "1 year of Premium",
};

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

      if (cs.mode === "subscription" && cs.customer) {
        const customer = typeof cs.customer === "string" ? cs.customer : cs.customer.id;
        await prisma.user.updateMany({
          where: { stripeCustomerId: customer },
          data: { subscriptionTier: "premium", subscriptionStatus: "active" },
        });
      } else if (cs.mode === "payment" && cs.metadata?.kind === "gift") {
        const plan = cs.metadata.giftPlan ?? "gift_1m";
        const purchaserEmail =
          cs.customer_details?.email ?? cs.customer_email ?? cs.metadata.purchaserEmail ?? "";
        const recipientEmail = cs.metadata.recipientEmail || null;

        if (purchaserEmail) {
          const gift = await createGiftCode({
            plan,
            purchaserEmail,
            recipientEmail,
            stripeSessionId: cs.id,
          });
          void sendGiftCodeEmail({
            to: purchaserEmail,
            code: gift.code,
            planLabel: GIFT_LABELS[plan] ?? `${giftPlanMonths(plan)} months Premium`,
            recipientEmail,
          }).catch((e) => console.error("[webhook] gift email failed", e));
        }
      } else if (
        cs.mode === "payment" &&
        cs.metadata?.bookId &&
        cs.metadata?.userId &&
        cs.metadata?.kind === "print"
      ) {
        const order = await prisma.order.create({
          data: {
            userId: cs.metadata.userId,
            bookId: cs.metadata.bookId,
            stripePaymentIntent: typeof cs.payment_intent === "string" ? cs.payment_intent : null,
            quantity: 1,
            unitPriceCents: cs.amount_total ?? 1999,
            status: "paid",
          },
        });

        const book = await prisma.book.findUnique({ where: { id: cs.metadata.bookId } });
        const user = await prisma.user.findUnique({ where: { id: cs.metadata.userId } });
        if (user?.email && book?.title) {
          void sendPrintOrderConfirmation({ to: user.email, bookTitle: book.title }).catch((e) =>
            console.error("[webhook] print confirm email failed", e),
          );
        }

        void (async () => {
          try {
            const fullSession =
              cs.shipping_details?.address?.line1 != null
                ? cs
                : await stripe.checkout.sessions.retrieve(cs.id);
            const { fulfillPrintOrder } = await import("@/lib/lulu/fulfill-print-order");
            await fulfillPrintOrder(order.id, fullSession);
          } catch (err) {
            console.error("[webhook] print fulfillment failed", order.id, err);
          }
        })();
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
