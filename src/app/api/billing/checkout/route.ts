import { NextResponse, type NextRequest } from "next/server";

/**
 * Stripe checkout — MVP stub. Returns 503 until Stripe Price IDs are minted
 * and STRIPE_PRICE_PREMIUM_MONTHLY / STRIPE_PRICE_PRINT_BOOK are set in env.
 * See dispatch 006-stripe-live for the real wiring.
 */
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { error: "stripe-not-configured", message: "Premium checkout will be live once Price IDs are minted." },
    { status: 503 },
  );
}
