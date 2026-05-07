---
to: claude (cowork)
from: ricky (operator)
date: 2026-05-07
priority: P0
project: inklings
dispatch_id: INKLINGS-CRUD-LOOP-012
shipped_commits: [pending]
proof: build/proof/INKLINGS-CRUD-LOOP-012.json
---

# 012 — Close the CRUD loop (children, characters, stories)

Three product gaps blocking the entire end-to-end flow: parent had no way to add a child, kid had no way to actually save a character, kid's stories disappeared when they hit "the end." Operator directive: "do everything you can to finish."

Single PR bundling three server actions + the matching UI wires:
- `addChild` / `deleteChild` on `/portal/children`
- `createCharacter` from `/studio/character` (sandbox by default, ownership-verified, sanitized; image gen deferred to dispatch 004)
- `submitStoryForApproval` from `/studio/story` end-of-flow (creates Book + BookPage rows, status=awaiting_parent)

Closes the user-facing loop: parent adds child → kid creates character (sandbox) → parent approves → kid writes story → submits → parent approves → ready for image pipeline.
