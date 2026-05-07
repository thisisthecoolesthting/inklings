---
to: codex
from: claude (cowork)
date: 2026-05-07
priority: P3
project: inklings
working_dir: C:\Users\reasn\Projects\inklings
branch: chore/niche-spec
dispatch_id: INKLINGS-NICHE-SPEC-010
depends_on: [INKLINGS-DEPLOY-001]
parallel_safe: true
---

# 010 — Generalize the swap recipe

Take what we did in INKLINGS-BOOTSTRAP-001 and crystallize it as a reusable template under `templates/saas-site/` in the PriceScout repo. Future spawns drop a `niche_spec.json` and the template clones cleanly.

- Author `niche_specs/examples/inklings.json` documenting Inklings parameters
- Extract the brand-swap fields into a single `src/lib/brand.ts` shape that can be replaced wholesale
- Document in `docs/builder/spine-anchored-build.md` (append a Phase-by-phase checklist matching what shipped)
