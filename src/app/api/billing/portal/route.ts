import { NextResponse } from "next/server";
/** Stripe customer portal — MVP stub. Wire in dispatch 006-stripe-live. */
export async function POST() { return NextResponse.json({ error: "stripe-not-configured" }, { status: 503 }); }
