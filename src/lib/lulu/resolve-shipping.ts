import type Stripe from "stripe";

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

/** Resolve shipping from a completed Stripe Checkout Session (same logic as StoryFawn). */
export function resolveShipping(session: Stripe.Checkout.Session): ShippingAddress {
  const sd = session.shipping_details;
  const addr: Stripe.Address | null | undefined =
    sd?.address ?? session.customer_details?.address ?? null;
  const name = (sd?.name ?? session.customer_details?.name ?? "").trim();

  return {
    name,
    line1: addr?.line1 ?? "",
    line2: addr?.line2 ?? undefined,
    city: addr?.city ?? "",
    state: addr?.state ?? "",
    postal_code: addr?.postal_code ?? "",
    country: addr?.country ?? "",
    phone: session.customer_details?.phone ?? undefined,
  };
}
