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
| Sparky live Claude API | Stubbed deterministic in `lib/sparky.ts`; flag-gated via `ANTHROPIC_API_KEY` | 002-sparky-live-claude |
| TogetherAI Flux image gen | Library not yet written; pending | 003-image-pipeline |
| Voice STT (Web Speech API) | Tap-button fallback only today | 004-voice-stt |
| Face detection on upload | Library not yet wired | 005-face-detection |
| Stripe Price IDs | env-stubbed; checkout returns 503 | 006-stripe-live |
| KDP sample export | `npm run kdp:sample` works; CMYK conversion still TODO | 007-cmyk-export |
| Playwright walkthrough video | Not yet recorded | 008-walkthrough-video |
| Parent push notifications | Email only (Resend); push deferred | 009-push-notifications |

## Open SEO/marketing follow-ups

- Add `/features/<slug>` hub with 6-8 deep-dive pages
- Add `/resources/guides/<slug>` for SEO content
- Add Schema.org `BreadcrumbList` + `FAQPage` JSON-LD per spine §17
- Generate real screenshots once Studio + Portal are populated (per spine §13)
