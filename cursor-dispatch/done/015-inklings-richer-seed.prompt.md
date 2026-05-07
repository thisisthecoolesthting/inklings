---
to: claude (cowork)
from: ricky (operator)
date: 2026-05-07
priority: P2
project: inklings
dispatch_id: INKLINGS-RICHER-SEED-015
shipped_commits: [pending]
---

# 015 — Richer demo seed

prisma/seed.ts now creates: parent, 2 children, 1 world, 2 approved characters (Biscuit, Saffron), 1 sandbox-mode character (Mira the Mapmaker, awaiting parent approval), 1 series, 1 approved Book + 7 BookPages (Biscuit and the Lost Bell), 1 awaiting_parent Book + 5 pages (Mira and the Map of Maybe), 1 fulfilled Order. /portal/dashboard, /portal/approvals, /portal/orders all show real data on first run.
