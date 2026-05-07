---
to: claude (cowork)
from: ricky (operator)
date: 2026-05-07
priority: P2
project: inklings
dispatch_id: INKLINGS-CI-SMOKE-013
shipped_commits: [pending]
---

# 013 — Wire CI smoke-test job

`tests/smoke.spec.ts` exists with 5 Playwright cases (home renders hero, pricing has 3 tiers, login has email input, /studio gated, /portal gated) but the CI workflow only ran build+typecheck+kdp-sample. Add a second job that boots Postgres 17, runs prisma db push, builds, starts the server, runs Playwright against it. Both jobs run on every push and PR.
