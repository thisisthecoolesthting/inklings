# Changelog

All notable changes to Inklings — appended top-to-bottom, newest first.

Format inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

This file is a human-readable summary; the canonical history is `git log`.
Per-dispatch machine-readable proofs live in `build/proof/<DISPATCH_ID>.json`.

---

## 2026-05-07 — DEPLOY-001 ship: inklings.shop is LIVE

### Added
- **Production deploy** (`INKLINGS-DEPLOY-001`)
  Hostinger VPS (`187.124.246.154`), `/var/www/inklings/`, port 3400, pm2 process `inklings`, Caddy reverse-proxy with auto-LE TLS, cron auto-pull every 2 minutes (`/etc/cron.d/inklings-deploy`).
  DNS programmed via Porkbun API (deleted parking ALIAS + wildcard CNAME, created A record `inklings.shop` → `187.124.246.154`, kept `www.inklings.shop` CNAME).
  Postgres role + DB provisioned on shared PG 17 instance. Schema pushed via `prisma db push`.
  `/var/www/inklings/.env` written with DATABASE_URL + INK_SESSION_SECRET + ANTHROPIC_API_KEY (sourced from `/opt/factory/.env`) + Resend key.
- **Verified**: `https://inklings.shop` returns HTTP 200 with valid TLS cert.

## 2026-05-07 — Sparky goes live (003)

### Added
- **Sparky calls Claude API live** (`INKLINGS-SPARKY-LIVE-003`).
  `src/lib/sparky.ts` rewritten — `askSparky()` now POSTs to Anthropic with a tightly-bounded system prompt (1-2 short sentences, age-appropriate reading level, must reference at least one character by name, forbidden-word block list, no emoji, prose only). Returns `source: 'live' | 'stub' | 'moderation_fallback'`.
- **Fallback chain** — missing API key, network error, empty response, or moderation block all silently fall back to the deterministic stub. The kid never sees an error.
- **Free-tier quota guard** in `src/app/api/sparky/beat/route.ts` — 3 stories per 30-day window enforced via `UsageEvent kind='story_started'`.
- **Telemetry** — every beat logs UsageEvent rows for future analytics + dispatch 004 image quotas.

### Lives at
`https://inklings.shop/studio` — auto-deploys via the 2-min cron after this PR merges.

## 2026-05-07 — Scaffold batch (013 + 014 + 015)

### Added
- **CI smoke job** (`INKLINGS-CI-SMOKE-013`)
  Second GitHub Actions job: spins up Postgres 17 service, runs prisma db push, installs Playwright chromium, boots `next start`, runs the 5 smoke tests in tests/smoke.spec.ts. Both jobs run on every push and PR.
- **Features hub + 3 deep-dive pages** (`INKLINGS-FEATURES-HUB-014`)
  /features (hub linking 6 features), /features/voice-first-studio, /features/character-bible, /features/parent-approval (hand-written deep dives), /features/[slug] (dynamic catch-all with generateStaticParams). BreadcrumbList JSON-LD on every page. Header nav now includes Features. Sitemap updated.
- **Richer demo seed** (`INKLINGS-RICHER-SEED-015`)
  Seed now creates: 2 children, 1 world, 2 approved + 1 sandbox character, 1 series, 1 approved book (7 pages) + 1 awaiting-parent book (5 pages), 1 fulfilled order. /portal/* shows real data on first run.

## 2026-05-07 — Image pipeline (004)

### Added
- **TogetherAI Flux preview + HD pipeline** (`INKLINGS-IMAGE-PIPELINE-004`)
  src/lib/image-gen.ts wraps TogetherAI’s /v1/images/generations. `generatePreview` (512x512 schnell, ~3s, ~$0.0027/image) called from /api/sparky/beat after Sparky text. `generateHd` (1024x1024) fired in the background when parent approves a book.
  Storage: VPS filesystem at /var/www/inklings/public/uploads/{preview,hd}/<id>.jpg, served via Caddy. No Supabase or S3 needed.
  Character consistency: seedFromImageSeed() hashes Character.imageSeed for deterministic renders across beats.
  Quota guard: 60 image_generated UsageEvents per 30d (free), 1500 (premium). Kid never sees an error — imageUrl=null on every failure mode.

### What it looks like to the user
- Kid in /studio/story: each beat now renders an illustration above the text as Sparky writes the prose.
- Parent in /portal/approvals: pending stories show preview thumbnails in a 3-col grid.
- Parent clicks Approve: HD renders in the background, page.imageUrlHd populated, ready for KDP export.

## [Unreleased]

### Pending dispatches in `cursor-dispatch/outbox/`

- **DEPLOY-001** — VPS deploy (blocked: SSH access + Porkbun DNS)
- **003** — Sparky live Claude API (blocked: `ANTHROPIC_API_KEY`)
- **004** — TogetherAI Flux image pipeline (blocked: `TOGETHER_API_KEY` + storage bucket)
- **005** — Voice STT with tap-button fallback
- **006** — Stripe live wiring (blocked: minted Price IDs in Stripe Dashboard)
- **007** — sRGB → CMYK conversion on KDP export
- **008** — Playwright walkthrough video (blocked: 003 + 004)
- **010** — Niche-spec generalization + template extraction

---

## 2026-05-07 — Phase 1 ship

### Added

- **Spine-anchored marketing site** (`INKLINGS-BOOTSTRAP-001`)
  Applied SolutionStore SaaS spine §6 six-section recipe with the warm-storybook palette swap (cream `#FFF6E5`, ink `#4A2545`, coral `#F4815C`, mint `#A8DDB5`, gold `#D4A574`).
  Routes shipped: `/`, `/pricing`, `/faq`, `/how-it-works`, `/about`, `/security`, `/contact`, `/trial`, `/login`, `/forgot-password`, `/legal/privacy`, `/legal/terms`, `/sitemap.xml`, `/robots.txt`.
- **Magic-link auth** (`INKLINGS-BOOTSTRAP-001`)
  `ink_session` JWT cookie (30-day TTL), `lib/auth/magic-link.ts` (30-min token), `lib/email.ts` (Resend wrapper with dev-console fallback). API routes `/api/auth/{login,verify,logout}`. Middleware gates `/portal/*` and `/studio/*`.
- **Parent portal** (`INKLINGS-BOOTSTRAP-001`)
  `/portal` layout with sidebar + pending-approval badge. Pages: dashboard, children, approvals queue (sandbox-mode characters + awaiting-parent stories), orders, settings. All backed by Prisma queries scoped to `parent_id`.
- **Kid Studio** (`INKLINGS-BOOTSTRAP-001`)
  `/studio` (who's-making picker) → `/studio/story` (5-act state machine running through `STORY_FLOW`'s 7 branching beats) and `/studio/character` (creation flow shell). Components: `SparkyChat`, `BigButton`, `StylizationSlider`, `StoryActProgress`. `lib/sparky.ts` Claude API wrapper (currently deterministic stub; live path commented). `lib/safety.ts` (input sanitize + AI moderation).
- **KDP-spec PDF templates** (`INKLINGS-BOOTSTRAP-001`)
  `lib/kdp/page-template.ts` (8.5″×8.5″ trim + 0.125″ bleed = 8.75″×8.75″ = 630pt², 0.375″ inner / 0.25″ outer margins, embedded fonts, sRGB). `lib/kdp/cover-template.ts`. `scripts/generate_sample_kdp.ts` wired via `npm run kdp:sample`.
- **Prisma schema** (`INKLINGS-BOOTSTRAP-001`)
  `User`, `MagicLink`, `Session`, `ChildProfile`, `Character`, `World`, `Series`, `Book`, `BookPage`, `Order`, `UsageEvent` — all per-tenant via cascade off the parent.
- **AGENTS.md + INKLINGS_SPINE_DEVIATIONS.md** (`INKLINGS-BOOTSTRAP-001`)
  Audience definition, forbidden phrases, two-surface architecture, safety doctrine, brand-deviations vs spine.

### Verified

- `npm install` → 442 packages, 33s (`INKLINGS-BUILD-VERIFY-002`)
- `npx prisma generate` → OK
- `npx tsc --noEmit` → 0 errors (after a one-line fix mapping Sparky API `paragraph` → state `text`)
- `npx next build` → 12 static + 17 dynamic routes, 102 kB shared JS, 40.1 kB middleware
- `npm run kdp:sample` → `kdp-sample.pdf` 3697 bytes, PDF 1.7, 8.75″×8.75″ confirmed

### Added (chrome + reproducibility)

- **JSON-LD scaffolding** (`INKLINGS-SEO-CHROME-009`)
  `BreadcrumbJsonLd`, `FaqPageJsonLd`, `OrganizationJsonLd` in `src/lib/jsonld.tsx`. `FaqPageJsonLd` wired into `/` and `/faq`. `OrganizationJsonLd` in root layout.
- **Brand assets** (`INKLINGS-SEO-CHROME-009`)
  `public/favicon.svg`, `public/images/brand/inklings-mark.svg` (coral mark with cream starburst + plum center), `public/images/site/og-default.svg` (1200×630 social card).
- **CI workflow** (`INKLINGS-SEO-CHROME-009`)
  `.github/workflows/ci.yml` runs typecheck + Prisma generate + Next build + KDP sample on every push and PR; uploads `kdp-sample.pdf` as build artifact.
- **`package-lock.json`** committed (442 deps locked).
- **Dispatch outbox seeded** (`INKLINGS-SEO-CHROME-009`)
  8 future dispatches authored in `cursor-dispatch/outbox/` with full frontmatter so Codex / future agents can pick up unblocked work autonomously.
- **`SESSION_HANDOFF.md`** at repo root captures current state + blockers + recommended dispatch order.

### Spawned from

`thisisthecoolesthting/pricescout` @ `617b3c8`, applying spine §19 brand-swap recipe.

### Stripped from PriceScout clone

Scanner / PriceVerdict / `/scan` / `/watch`, `/api/identify`, `/api/lookup`, `lib/{identify,lookup,score}.ts`, the `/admin` shell (renamed to `/portal`), WPBS partner flow, `/api/auth/{forgot,wpbs-grant,magic-login}`, the SEO scaffold hubs (`/industries`, `/compare`, `/blog`, `/resources`, `/support`, `/features`), `mobile/` Expo app, `scripts/{fire_marketing_images.py,sync-mikaela-spine-prompt.ps1,dispatch_watcher.py,download-leonardo-videos.ps1}`, `src/lib/{api-schemas,roles}.ts`, `src/instrumentation.ts`, `tests/demo-walkthrough.spec.ts` (replaced with `tests/smoke.spec.ts`), PriceScout-specific Prisma migrations.

### Operator decisions

- Repo: `thisisthecoolesthting/inklings` (public). Disk: `C:\Users\reasn\Projects\inklings`. Domain: `inklings.shop` (Porkbun).
- Brand palette: warm pastel storybook (cream/ink/coral/mint/gold).
- Pricing: Free / Premium $9.99 mo / Printed Book $19.99 each.
- Audience: parents and grandparents of children ages 4–8. Never marketed to kids directly.
