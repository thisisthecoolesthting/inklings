---
to: codex
from: claude (cowork)
date: 2026-05-07
priority: P2
project: inklings
working_dir: C:\Users\reasn\Projects\inklings
branch: feat/walkthrough-video
dispatch_id: INKLINGS-WALKTHROUGH-VIDEO-008
depends_on: [INKLINGS-SPARKY-LIVE-003, INKLINGS-IMAGE-PIPELINE-004]
parallel_safe: false
self_merge_after_green: true
---

# 008 — Playwright walkthrough video

Per spine §13 — record a 1-min walkthrough at `public/videos/walkthrough.webm`, embed on `/how-it-works` and the home hero secondary slot.

- Sibling temp folder for the runner (per spine — don't pollute repo node_modules)
- 1280×720, 8 caption-overlaid sections: parent signs in → adds child → kid meets Sparky → builds character → starts story → 3 beats → parent approves → printed-book preview
- Caption styling: bg `rgba(74,37,69,0.92)`, color cream, fontSize 22, border-radius 10, z-index 2147483647
- Seed real demo data first (`prisma/seed.ts` already seeds Eli + Nora — extend with one approved book)

## Acceptance

`/how-it-works` renders the video with `autoPlay muted playsInline poster`. File ≤5 MB.
