# Inklings vs SolutionStore SaaS spine — documented deviations

**Date:** 2026-05-07
**Spine reference:** `docs/SOLUTIONSTORE_SAAS_SPINE.md` (cloned from PriceScout)
**App:** root of this repo, served at `https://inklings.shop`

These are not gaps; they are intentional brand and architecture choices for a consumer/family product (vs the spine's small-business audience). The spine's §19 "Per-tenant brand swap" recipe explicitly invites them.

## Brand deviations

- **Palette: warm pastel storybook** (`cream #FFF6E5`, `ink #4A2545`, `coral #F4815C`, `mint #A8DDB5`, `gold #D4A574`) instead of spine teal/blue/orange. Storybook tone fits the family audience.
- **Button radius 12px (`rounded-button`) instead of 6px.** Soft-edge for kid-friendly feel.
- **Section padding 80/56 (`py-20` desktop, `py-14` mobile)** instead of 72px. Matches PriceScout deviation.
- **Hero gradient: cream-to-warm-cream radial** with hints of coral and mint, vs spine's teal-blue gradient.
- **No Google Fonts.** System font stack (per spine §3) — performance + privacy.

## Architecture deviations

- **No `/admin/*` shell.** Replaced with two distinct surfaces:
  - `/studio/*` — kid-facing, voice-first
  - `/portal/*` — parent-facing, approval queue + orders + settings
- **Auth is magic-link only** (`ink_session` cookie). No password store — kids' product, fewer attack surfaces.
- **Tenancy is per-user**, not per-org. Each parent is their own tenant; child profiles cascade off the parent.
- **Marketing routes pruned.** No `/industries`, `/compare`, `/blog`, `/resources`, `/support`, `/features` hub yet. We have core pages only: `/`, `/pricing`, `/faq`, `/how-it-works`, `/about`, `/security`, `/trial`, `/contact`, `/legal/{privacy,terms}`. SEO scaffolding ships in a later dispatch.
- **No `/scan` / `/api/identify` / `/api/lookup` / mobile/.** PriceScout-specific surfaces stripped.

## What's stubbed / pending

| Area | Status | Next dispatch |
|---|---|---|
| Sparky live Claude API | DONE — live Anthropic call wired in `lib/sparky.ts` (model claude-sonnet-4-6) with deterministic stub fallback when ANTHROPIC_API_KEY is missing | — |
| TogetherAI Flux image gen | DONE — implemented in `lib/image-gen.ts` (TogetherAI FLUX.1-schnell) | — |
| Voice STT (Web Speech API) | DONE — `components/studio/use-voice-recognition.ts` with tap-button fallback | — |
| Face detection on upload | Library not yet wired | 005-face-detection |
| Stripe Price IDs / checkout | DONE (code) — checkout/portal/webhook implemented; live Price IDs configured in env. Pending only: dashboard acceptance test (subscribe→cancel→resubscribe) and webhook URL verification | — |
| KDP sample export / CMYK | DONE — `npm run kdp:sample` works; KDP templates now emit CMYK vector colors | — |
| Playwright walkthrough video | Not yet recorded | 008-walkthrough-video |
| Parent push notifications | Email only (Resend); push deferred | 009-push-notifications |

## Open SEO/marketing follow-ups

- Add `/features/<slug>` hub with 6-8 deep-dive pages
- Add `/resources/guides/<slug>` for SEO content
- Add Schema.org `BreadcrumbList` + `FAQPage` JSON-LD per spine §17
- Generate real screenshots once Studio + Portal are populated (per spine §13)

## Update 2026-05-24 — production-readiness pass

Completed in the prod-readiness sweep: GA4 injection (layout), magic-link token now SHA-256 hashed (was plaintext slice), rate-limiting on auth, checkout JSON-body 500 fixed, GDPR data export + account deletion (portal/settings), COPPA parental-consent checkbox on /trial, KDP CMYK color, next/image migration, SMTP transport path (Stalwart, env-gated) added alongside Resend.

Still pending (operator action): create hello@inklings.shop mailbox in Stalwart webadmin; verify Stripe webhook URL; run Stripe acceptance test; record walkthrough video; provide Sentry DSN.
