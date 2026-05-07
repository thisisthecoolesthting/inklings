---
to: codex
from: claude (cowork)
date: 2026-05-07
priority: P1-HIGH
project: inklings
fleet: inklings-product
working_dir: C:\Users\reasn\Projects\inklings
branch: feat/sparky-live-claude
dispatch_id: INKLINGS-SPARKY-LIVE-003
depends_on: [INKLINGS-BOOTSTRAP-001, INKLINGS-BUILD-VERIFY-002]
parallel_safe: true
self_merge_after_green: false
operator_blocked_on: ["ANTHROPIC_API_KEY in env / Vercel"]
---

Read `AGENTS.md` and `docs/SOLUTIONSTORE_SAAS_SPINE.md` first. Spine §16 copy conventions and the kid-tone in `src/content/sparky-prompts.ts` are load-bearing.

# 003 — Sparky live Claude API

## Why

`src/lib/sparky.ts` currently returns deterministic stubs in `askSparky()`. Flip it to call Claude (Sonnet 4.6 via `claude-sonnet-4-6`) so the kid Studio actually writes story prose dynamically.

## Tasks

### A — wire the API call

- Read `ANTHROPIC_API_KEY` from env. If missing, fall back to the deterministic stub (don't hard-fail — local dev should still work).
- POST to `https://api.anthropic.com/v1/messages` with `model = claude-sonnet-4-6`, `max_tokens = 200`, system prompt that constrains Sparky to (a) write 1–2 short sentences in storybook voice, (b) reference at least one of `ctx.characters` by name, (c) NEVER ask a question or break character.
- User message contains: prior story state (compact JSON of beat→choice pairs), the current beat's `sparkyLine`, and the chosen `choice.label`.
- Run the response through `lib/safety.ts → moderateAiText`. If `ok=false`, fall back to the deterministic stub for that beat (never error to the kid).

### B — image prompt unchanged

`buildImagePrompt` already returns the Flux-ready prompt. Don't touch.

### C — quota guard

Before the API call, count this user's `UsageEvent kind='story_started'` rows in the last 30 days. If `> tier limit` (3 for free, unlimited for premium), short-circuit with the deterministic stub and log a `story_quota_blocked` UsageEvent.

### D — proof

`build/proof/INKLINGS-SPARKY-LIVE-003.json` with: 5 sample stub responses, 5 sample live responses (manually verified by author), token cost estimate per story.

## Acceptance

- `npx tsc --noEmit` exits 0
- `npx next build` exits 0
- Without `ANTHROPIC_API_KEY` set, Studio works (uses stubs)
- With `ANTHROPIC_API_KEY` set, beats produce dynamic Sparky prose
- Quota block test: free-tier user with 3 stories already this month → stub returned, UsageEvent logged
