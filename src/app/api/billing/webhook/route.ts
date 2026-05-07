import { NextResponse, type NextRequest } from "next/server";

/** Stripe webhook — MVP stub. Wire in dispatch 006-stripe-live. */
export async function POST(req: NextRequest) {
  return NextResponse.json({ received: true, stub: true });
}
