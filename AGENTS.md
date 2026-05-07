# AGENTS.md — Inklings repo

**This file is read by Codex, Claude Code, Cursor, and any compatible agent at session start.** Treat as load-bearing.

## TL;DR

1. Before any non-trivial UI/route/component change, read `docs/SOLUTIONSTORE_SAAS_SPINE.md` (cloned from PriceScout) and `docs/INKLINGS_SPINE_DEVIATIONS.md`.
2. Push to `origin` = `https://github.com/thisisthecoolesthting/inklings.git`, branch `main` (LIVE 2026-05-07) (PRs from `feat/<slug>`).
3. Audience is **parents of children ages 4-8** plus grandparents and homeschool families. Never marketing copy aimed at kids — kids see only the Studio.
4. Two product surfaces: **(1) Kid Studio** at `/studio` — voice-first, parent-launched. **(2) Parent Portal** at `/portal` — approval queue, orders, settings.
5. Visual tokens: cream `#FFF6E5`, ink `#4A2545`, coral `#F4815C`, mint `#A8DDB5`, gold `#D4A574`. Section padding 80/56. Button radius 12px. No new colors without operator approval.

## Required reading

| File | Why |
|---|---|
| `docs/SOLUTIONSTORE_SAAS_SPINE.md` | Canonical SaaS template inherited from PriceScout. Section recipe, mobile rules, deploy, copy conventions. |
| `docs/INKLINGS_SPINE_DEVIATIONS.md` | Inklings-specific brand/architecture overrides vs the spine. |
| `prisma/schema.prisma` | Database shape. Read before any model change. |
| `saas_spec.json` | Niche config (audience, tiers, brand). |
| `src/content/sparky-prompts.ts` | The locked branching flows Sparky uses. **Do not turn Sparky into an open chatbot.** |

## Spine sections to follow verbatim

- §6 — Six-section page recipe on every marketing route
- §7 — Visual tokens (overridden in `tailwind.config.ts` → cream/ink/coral/mint/gold)
- §8 — Mobile drawer is a sibling of `<header>`, never a child
- §9 — Forms always render a visible red error banner above on failure
- §10 — Magic-link auth: `signMagicLinkToken` → email → `/api/auth/verify` → `ink_session` cookie
- §15 — Deploy: `pm2 stop inklings && pm2 start inklings --update-env`
- §16 — Copy: `&apos;` not `'` in JSX; no "Book a demo"; CTAs `Start a free story` / `How it works`

## Audience — parents, NEVER kids

Marketing pages target parents and grandparents. Inside `/studio` we speak to the kid; everywhere else (homepage, pricing, FAQ, about, security) we speak to the adult who is paying. Do not blur this — adults need to feel safe before kids touch anything.

Forbidden phrases on marketing pages: "edutainment", "engagement", "screen time", "AI character generator", "kid-safe AI" (instead: "parent-approved", "private to your account", "real printed books").

## Two product surfaces

1. **Kid Studio** at `/studio` — voice-first, giant tap-buttons. Sparky is a *bounded* branching flow, not an open chatbot. Voice STT has a tap-button fallback because STT on 4-year-olds is unreliable.
2. **Parent Portal** at `/portal` — approval queue (sandbox-mode characters, awaiting-parent stories), orders, billing, settings. Nothing publishes/exports/prints without parent approval here first.

## Safety rules baked in

- New characters live in `sandbox_mode = true` until parent approves.
- Photos run on-device face detection before upload; faces are blurred before any byte reaches the server.
- All AI text passes through `lib/safety.ts` sanitization (input) and moderation (output).
- Sparky redirects unsafe inputs playfully (never error messages to children).
- Content moderation enabled on TogetherAI Flux calls.
- COPPA-compliant: parent owns account, only first name + age collected for child.

## Git push convention

- Remote: `origin` = `https://github.com/thisisthecoolesthting/inklings.git`
- Default branch: `main`
- Branch naming: `feat/<slug>` features, `fix/<slug>` bugs, `chore/<slug>` housekeeping
- PR target: `main` always
- Merge: squash via `gh pr merge <num> --squash --delete-branch=false`
- Force-push: never on `main`. Feature branches only with operator confirmation.
- Author: `Ricky Reasner <reasner196@gmail.com>`
- Commit format: conventional commits

## Workflow per dispatch

1. `git pull origin main --ff-only`
2. `git checkout -b feat/<slug>`
3. Implement against the spine + handoff doc
4. `npm run typecheck && npm run test && npm run build` — all three green
5. `npx tsx scripts/generate_sample_kdp.ts` if you touched `src/lib/kdp/*` (verify PDF still opens)
6. Write `build/proof/<DISPATCH_ID>.json`
7. Conventional commit + `git push -u origin feat/<slug>`
8. `gh pr create --base main --head feat/<slug> --title "..." --body "..."`

## Stop conditions (refuse and surface)

- Money ops without operator confirmation (Stripe live mode, refunds)
- Force-push to `main`, prod DB drops, schema column delete with data
- Posting on social media as the operator
- Creating new repos under accounts other than `thisisthecoolesthting`
- Anything that bypasses the parent-approval gate (auto-publishing, auto-printing)

## Known fragility

- `&apos;` in JSX (Next 15's `react/no-unescaped-entities`)
- Mobile drawer must be sibling of `<header>` (z-stacking trap — see spine §8)
- `pm2 stop && start --update-env` after every deploy — never `pm2 reload`
- Don't turn Sparky into an open chatbot, ever. The branching flow IS the safety model.
