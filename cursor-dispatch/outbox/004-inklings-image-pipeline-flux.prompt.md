---
to: codex
from: claude (cowork)
date: 2026-05-07
priority: P1-HIGH
project: inklings
fleet: inklings-product
working_dir: C:\Users\reasn\Projects\inklings
branch: feat/image-pipeline-flux
dispatch_id: INKLINGS-IMAGE-PIPELINE-004
depends_on: [INKLINGS-SPARKY-LIVE-003]
parallel_safe: false
self_merge_after_green: false
operator_blocked_on: ["TOGETHER_API_KEY", "Supabase Storage bucket OR S3 bucket for image hosting"]
---

# 004 — TogetherAI Flux image pipeline (staged rendering)

## Why

Stories need illustrations. Per Inklings handoff: TogetherAI Flux.1 Dev for MVP. Staged rendering (low-res preview → HD on parent approve) is the cost-control mechanism — kids regenerate endlessly if we let them.

## Tasks

### A — `src/lib/image-gen.ts`

- `generatePreview(prompt, seed)` → 512×512 JPEG, returns URL
- `generateHd(prompt, seed)` → 2048×2048 JPEG, returns URL
- Both call `https://api.together.xyz/v1/images/generations` with model `black-forest-labs/FLUX.1-dev`
- Pass `seed` from the Character Bible so the same character renders consistently across pages
- Append the locked style prefix from `lib/sparky.ts:buildImagePrompt`

### B — Storage

Upload returned image URL to Supabase Storage (or S3) under `image/<bookId>/<pageNumber>-{preview,hd}.jpg`. Store the storage URL on `BookPage.imageUrlLowres` / `imageUrlHd`.

### C — Approval gate

`BookPage.imageApproved = false` blocks `/api/book/export`. The `/portal/approvals` page shows preview thumbnails inline; parent clicks Approve → flips flag → kicks off HD generation.

### D — Quota

Per Inklings handoff: free tier 20 image generations/story, premium 50. Enforce in `lib/image-gen.ts` via `UsageEvent kind='image_generated'` counts.

## Acceptance

- Preview images render in `/studio/story` after each beat
- HD images only generate after parent approval
- Quota block test passes
- Stub fallback if `TOGETHER_API_KEY` missing (returns placeholder URL)
