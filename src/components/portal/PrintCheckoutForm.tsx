interface Props {
  bookId: string;
  label?: string;
  className?: string;
}

/** POST → Stripe Checkout for a parent-approved book print order. */
export function PrintCheckoutForm({ bookId, label = "Order printed book — $19.99", className = "btn-primary" }: Props) {
  return (
    <form action="/api/billing/checkout" method="POST">
      <input type="hidden" name="tier" value="print" />
      <input type="hidden" name="bookId" value={bookId} />
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
