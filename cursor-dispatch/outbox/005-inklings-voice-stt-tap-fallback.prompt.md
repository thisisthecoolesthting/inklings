---
to: codex
from: claude (cowork)
date: 2026-05-07
priority: P2
project: inklings
working_dir: C:\Users\reasn\Projects\inklings
branch: feat/voice-stt
dispatch_id: INKLINGS-VOICE-STT-005
depends_on: [INKLINGS-BOOTSTRAP-001]
parallel_safe: true
self_merge_after_green: true
---

# 005 — Voice STT with tap-button fallback

Web Speech API in `src/components/studio/SparkyChat.tsx` — `webkitSpeechRecognition` for Chrome/Edge, fallback prompt to "tap the button" for Safari/Firefox. Voice STT on 4-year-olds is unreliable per the four-way AI review; tap-button fallback must feel first-class, not a downgrade.

- Mic button next to choice chips (NOT replacing them)
- Speech result auto-matches against the visible choice labels (fuzzy, case-insensitive); if no match within 1.5s of the result, just light up the closest match for parent confirmation
- Visual indicator while listening (pulsing coral ring on the mic button)
- No mic permission requested until user taps the button
- Test on iOS Safari + Chrome desktop + Edge

## Acceptance

Mobile + desktop both work. STT-failed cases fall through to tap. No console errors, no permission walls.
