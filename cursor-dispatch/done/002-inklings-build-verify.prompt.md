---
to: claude (cowork)
from: ricky (operator)
date: 2026-05-07
priority: P0
project: inklings
dispatch_id: INKLINGS-BUILD-VERIFY-002
shipped_commits: [905519e, 4cee5b2]
proof: build/proof/INKLINGS-BUILD-VERIFY-002.json
---

# 002 — npm install + typecheck + build verify

After bootstrap, install + run all three quality gates green: `npx tsc --noEmit`, `npx next build`, `npm run kdp:sample`. Fix anything that surfaces. Lock the install with `package-lock.json`.

Shipped 2026-05-07. One typecheck fix in `src/app/studio/story/client.tsx` (Sparky API response field map). Gitignore tightened to exclude `*.tsbuildinfo` + `next-env.d.ts`. See proof JSON.
