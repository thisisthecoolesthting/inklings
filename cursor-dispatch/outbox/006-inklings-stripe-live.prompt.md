---
to: codex
from: claude (cowork)
date: 2026-05-07
priority: P1-HIGH
project: inklings
working_dir: C:\Users\reasn\Projects\inklings
branch: feat/stripe-live
dispatch_id: INKLINGS-STRIPE-LIVE-006
depends_on: [INKLINGS-BOOTSTRAP-001]
parallel_safe: true
self_merge_after_green: false
operator_blocked_on: ["Mint Stripe Price IDs (live mode): premium monthly $9.99, print book $19.99 one-time"]
---

# 006 — Stripe live wiring

Currently `/api/billing/{checkout,webhook,portal}` return 503 stubs. Replace with real Stripe SDK calls.

## Tasks

### A — Premium subscription checkout

`/api/billing/checkout?tier=premium` → `stripe.checkout.sessions.create({ mode: 'subscription', line_items: [{ price: STRIPE_PRICE_PREMIUM_MONTHLY, quantity: 1 }], customer_email, success_url: /portal?upgraded=1, cancel_url: /pricing })`

### B — Print book one-time charge

`/api/billing/checkout?tier=print&bookId=...` → `mode: 'payment'`. Webhook on success creates `Order` row with `status='paid'`.

### C — Customer portal

`/api/billing/portal` → `stripe.billingPortal.sessions.create({ customer: user.stripeCustomerId, return_url: /portal/settings })`. Wire `[Open billing portal]` button in `/portal/settings`.

### D — Webhook

`/api/billing/webhook` verifies `STRIPE_WEBHOOK_SECRET`, handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` → updates `User.subscriptionTier` / `subscriptionStatus`.

## Acceptance

- Stripe Dashboard test: subscribe → cancel → resubscribe → all 3 webhooks fire and DB stays consistent
- Print book purchase creates Order row
