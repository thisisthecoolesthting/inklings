import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { getStripe, siteUrl } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/login?next=/portal/settings", getSiteUrl()), { status: 303 });

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user?.stripeCustomerId) return NextResponse.json({ error: "no_customer" }, { status: 400 });

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${siteUrl()}/portal/settings`,
  });
  return NextResponse.redirect(portal.url, { status: 303 });
}
