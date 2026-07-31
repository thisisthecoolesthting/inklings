# Bundled book fonts (SIL Open Font License 1.1)

These TTFs are embedded into generated print PDFs (interior + cover) by
`src/lib/lulu/print-pdf.js` and `src/lib/kdp/*.ts`. Both families are
OFL-1.1 licensed — bundling and embedding into produced documents is
expressly permitted. Source: github.com/google/fonts.

| File | Family | Role in the book |
|---|---|---|
| `ZillaSlab-Bold.ttf` | Zilla Slab (Mozilla/Typotheque) | Display: titles, cover, drop caps, "The End" |
| `ZillaSlab-SemiBold.ttf` | Zilla Slab | Name callouts, page-number ornaments |
| `ZillaSlab-Medium.ttf` | Zilla Slab | Colophon, small caps-style labels |
| `ZillaSlab-Regular.ttf` | Zilla Slab | Fallback labels |
| `GentiumBookPlus-Regular.ttf` | Gentium Book Plus (SIL) | Body: story text |
| `GentiumBookPlus-Italic.ttf` | Gentium Book Plus | Dedications, blurbs, captions |
| `GentiumBookPlus-Bold.ttf` | Gentium Book Plus | Emphasis inside body copy |

License texts:
- Zilla Slab: https://github.com/google/fonts/blob/main/ofl/zillaslab/OFL.txt
- Gentium Book Plus: https://github.com/google/fonts/blob/main/ofl/gentiumbookplus/OFL.txt

If a bundled file is missing/unreadable at runtime, the builders fall back to
the system Liberation fonts (`/usr/share/fonts/truetype/liberation/`) so print
fulfillment can never hard-fail on typography.
