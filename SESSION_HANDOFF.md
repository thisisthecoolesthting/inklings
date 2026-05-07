# Inklings — session handoff (2026-05-07, end of bootstrap session)

## Where we are

**Phase 1 shipped, pushed, build-green-lit.** Repo at https://github.com/thisisthecoolesthting/inklings, branch `main`, 4 commits.

```
4cee5b2  chore: gitignore tsbuildinfo + next-env.d.ts; proof for build-verify-002
905519e  fix(studio): map sparky API paragraph→text in story client (typecheck)
824d00d  chore(proof): write INKLINGS-BOOTSTRAP-001.json
f35af52  feat: bootstrap inklings from spine
```

## What's live in the codebase

- Marketing site: spine §6 six-section recipe applied to home, pricing, faq, how-it-works, about, security, contact, trial, login, forgot-password, legal/{privacy,terms}, sitemap, robots
- Magic-link auth (`ink_session` cookie, Resend wrapper with dev-console fallback)
- Parent portal: layout w/ pending-approval badge, dashboard, children, approvals, orders, settings — all backed by Prisma queries
- Kid Studio: 5-act state machine, 7 branching Sparky beats, character-creation shell
- KDP page-template (8.75″×8.75″ incl. bleed, 300 DPI, embedded fonts, sample-generator passes)
- SEO: BreadcrumbList + FaqPage + Organization JSON-LD components in `lib/jsonld.tsx`, brand SVG mark + OG image + favicon, `/sitemap.xml` + `/robots.txt`
- CI: `.github/workflows/ci.yml` runs typecheck + build + KDP sample on every push/PR

## Verified clean (in this session, Linux sandbox)

- `npm install` → 442 packages, 33s
- `npx prisma generate` → OK
- `npx tsc --noEmit` → 0 errors
- `npx next build` → 12 static + 17 dynamic routes, 102 kB shared JS, 40.1 kB middleware
- `npx tsx scripts/generate_sample_kdp.ts` → kdp-sample.pdf 3697 bytes, PDF 1.7

## Blocked on operator

- `ANTHROPIC_API_KEY` — needed for dispatch 003 (Sparky live)
- `TOGETHER_API_KEY` — needed for dispatch 004 (image pipeline)
- VPS SSH + Porkbun DNS A record — needed for DEPLOY-001
- Stripe live Price IDs (premium monthly $9.99, print $19.99 one-time) — needed for dispatch 006
- Database — Supabase Postgres URL or VPS local Postgres

## Pending dispatches in `cursor-dispatch/outbox/`

- `DEPLOY-001-inklings-vps.prompt.md` — P0
- `003-inklings-sparky-live-claude.prompt.md` — P1
- `004-inklings-image-pipeline-flux.prompt.md` — P1
- `005-inklings-voice-stt-tap-fallback.prompt.md` — P2
- `006-inklings-stripe-live.prompt.md` — P1
- `007-inklings-cmyk-export-and-bleed.prompt.md` — P2
- `008-inklings-walkthrough-video.prompt.md` — P2
- `010-inklings-niche-spec-and-template-extraction.prompt.md` — P3

## Recommended next dispatch order

1. **DEPLOY-001** (operator unblocks: SSH, DNS) → site has a public URL within an hour
2. **003 Sparky live** (operator unblocks: ANTHROPIC_API_KEY) → kid Studio actually generates story prose
3. **004 Image pipeline** (operator unblocks: TOGETHER_API_KEY + Storage bucket) → illustrations
4. **006 Stripe live** (operator unblocks: minted Price IDs) → revenue
5. **008 Walkthrough video** — needs 003 + 004 first
6. **005, 007, 010** — parallel-safe, run when bandwidth allows

## Operator directive (load-bearing — read every session)

`~/.claude/memory/feedback_drive_forward_directive.md`. TL;DR: drive forward, single end-of-task report, continuous improvement loop, faster/better/cheaper, Codex executes, stop conditions absolute.
