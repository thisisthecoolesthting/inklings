---
to: codex
from: claude (cowork)
date: 2026-05-07
priority: P2
project: inklings
working_dir: C:\Users\reasn\Projects\inklings
branch: feat/cmyk-export
dispatch_id: INKLINGS-CMYK-EXPORT-007
depends_on: [INKLINGS-IMAGE-PIPELINE-004]
parallel_safe: true
self_merge_after_green: true
---

# 007 — sRGB → CMYK conversion on KDP export

Current `src/lib/kdp/page-template.ts` writes sRGB. KDP accepts sRGB but PDF/X-1a strictly requires CMYK. Convert images to CMYK before embedding via `sharp`.

- `sharp(input).toColorspace('cmyk').jpeg({ quality: 90 })` before `embedJpg()`
- Add bleed-mark crop guides at corners (faint thin lines, only printed in the bleed area)
- Test: open exported PDF in Adobe Acrobat → File → Properties → Color Space should show DeviceCMYK
- Verify at least one image survives the round-trip without color shift > 5% (compare a known mid-coral pixel)

## Acceptance

`build/proof/INKLINGS-CMYK-EXPORT-007.json` with Acrobat Color-Space screenshot reference and the test pixel deltas.
