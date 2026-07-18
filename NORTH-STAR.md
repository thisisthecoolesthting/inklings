# NORTH-STAR.md — Inklings

**Status:** Active · **Last updated:** 2026-06-25  
**Domain:** [inklings.shop](https://inklings.shop)

> **Read this before product, pricing, UX, or engineering tradeoffs.**  
> If a feature does not move us toward the north star, deprioritize it.

---

## North star (one sentence)

**Inklings is the storybook studio where your kid is the author — not just the hero — and the “aha” moment is a real printed book on the shelf.**

---

## Vision

Inklings is a **creative studio** for children ages 5–8, not a one-click gift checkout.

| | StoryFawn (sibling product) | Inklings |
|---|---|---|
| **Who acts** | Parent/grandparent buys | **Kid creates**, parent approves |
| **When** | One moment (birthday, holiday) | Ongoing — weekends, rainy days, series |
| **Output** | One finished book in ~2 minutes | A **universe** of characters + many stories |
| **Money** | Pay once ($24–39 + print) | Free tier → subscription → print when ready |

**StoryFawn tagline:** *“The only book in the world that stars your child — ready in minutes.”*  
**Inklings tagline:** *“The storybook studio where your kid is the author, not just the hero.”*

**Parent buyer, kid user.** Parents pay. Kids use the Studio. Marketing speaks to parents; the Studio never sells or upsells to children.

---

## Business thesis

Inklings is a **print-led subscription business**, not pure SaaS.

- Digital creation drives engagement and habit.
- **Print is the conversion event** — the physical book is what parents show grandparents and remember.
- Premium is retention; print is proof and margin.
- Grandparent **gift** is a seasonal revenue channel (Q4 can be 40–60% of annual print if we build for it).

**Bottom line at 24 months (base case):** ~12K registered families · ~950 Premium · ~2K lifetime prints · **~$14K/mo blended revenue** (~$115K–170K ARR run-rate).

The biggest levers are **print attach at parent approval** and **grandparent gift SKUs** — not raising Premium price alone.

---

## Who we serve (customer segments)

| Segment | Who | Why they convert | Print likelihood |
|--------|-----|------------------|------------------|
| **Weekend storyteller** | Parent, 1 kid 5–7, free tier | Rainy-day activity, low commitment | 5–10% ever |
| **Creative family** | 2+ kids, reads aloud nightly | Unlimited stories + series memory | 25–40% / year |
| **Grandparent gifters** | Buys for grandkids | Physical book = shareable proof | 60–80% gift includes print |
| **Homeschool / teacher** | Classroom or co-op | Portfolio of kid work | Bulk print 2–4×/year |
| **Holiday buyer** | Nov–Dec spike | “Better than another toy” | 1 print minimum |

**Addressable pool (English, ages 5–8):** ~22M kids · ~16M households · ~4M “creative parent” skew.

**Serviceable market (year 1–2, no TV budget):** Wonderbly / Hooray Heroes buyers + AI-curious parents on Instagram/TikTok — **~800K–2M US households** reachable with content + paid social.

---

## Funnel (base-case assumptions)

| Stage | Rate | Notes |
|-------|------|-------|
| Landing → trial signup | 8–15% | Strong CTA + trust strip |
| Trial → completed story | 45–60% | Sparky + kid UX is the gate |
| Completed → parent approval | 70–85% | Grown-up gate = friction + trust |
| Approved → Premium (14-day trial) | 12–20% | Lower without print hook |
| Approved → Print ($19.99) | 8–15% | **Primary “aha” moment** |
| Premium monthly churn | 6–10% | ~4–6% if 1 print/yr attached |

---

## 24-month user projection

Assumes organic + modest paid ($500–5K/mo ads ramping), no viral breakout.

| Metric | Month 6 | Month 12 | Month 24 |
|--------|---------|----------|----------|
| **Conservative — registered** | 400 | 1,200 | 3,500 |
| **Conservative — Premium** | 25 | 70 | 180 |
| **Conservative — prints (cum.)** | 40 | 150 | 450 |
| **Base — registered** | 900 | 3,500 | **12,000** |
| **Base — active monthly** | 300 | 1,100 | 3,600 |
| **Base — Premium** | 60 | 280 | **950** |
| **Base — prints (cum.)** | 100 | 500 | **2,000** |
| **Optimistic — registered** | 2,500 | 10,000 | 40,000 |
| **Optimistic — Premium** | 180 | 900 | 3,500 |
| **Optimistic — prints (cum.)** | 350 | 2,000 | 10,000 |

---

## Revenue projection (base case, USD/month)

### Unit economics (approx.)

| SKU | Gross | Net / margin (approx.) |
|-----|-------|------------------------|
| Premium | $9.99/mo | ~$9.70 after Stripe |
| Print softcover 8.5×8.5 | $19.99 | ~$9–11 after print+ship (Lulu) |
| Gift 1mo / 6mo / 12mo | $9.99 / $49.99 / $89.99 | Prepaid Premium access |

### Monthly trajectory (base)

| Month | Premium MRR | Print (that month) | Gift (that month) | **Total** |
|-------|-------------|--------------------|-------------------|-----------|
| 6 | ~$600 | ~$400 (~20 books) | ~$200 | **~$1,200** |
| 12 | ~$2,800 | ~$1,000 (~50 books) | ~$800 | **~$4,600** |
| 18 | ~$6,500 | ~$1,800 | ~$1,500 | **~$9,800** |
| 24 | ~$9,500 | ~$2,500 (~125 books) | ~$2,000 | **~$14,000** |

Print is **~30–40% of revenue early**; Premium becomes majority by ~month 18 if churn is controlled.

---

## Pricing (live)

| Tier | Price | Role |
|------|-------|------|
| **Free** | $0 | Acquisition — 3 stories/mo, 1 child, watermarked PDF |
| **Premium** | $9.99/mo (14-day trial) | Retention — unlimited + HD PDF + series |
| **Print** | $19.99 one-time | **Conversion event** — softcover 8.5×8.5, ships 7–10 days |
| **Gift Premium** | 1mo $9.99 · 6mo $49.99 · 12mo $89.99 | Grandparent / birthday channel |

---

## Pricing variations (test when data supports)

### Variation A — Print-forward *(recommended if churn rises)*

| Change | Price | Expected effect |
|--------|-------|-----------------|
| Premium + Print bundle | $14.99/mo incl. 1 book/quarter | Higher ARPU, lower churn |
| Print add-on at approval | $14.99 single · $34.99 3-pack | Upsell at highest intent |
| Tighter free tier | 1 story/mo | Pushes completion → print |

*Impact:* +40–60% print rate; slight Premium conversion dip but higher LTV.

### Variation B — Freemium wide, monetize print

| Change | Price | Expected effect |
|--------|-------|-----------------|
| Free | Unlimited digital, watermark | Viral kid usage |
| Premium | $6.99/mo — watermark off + series | Lower sub barrier |
| Print | $24.99 (vs Wonderbly ~$35+) | Print as hero SKU |

*Impact:* 2–3× signups; needs print attach ≥20%.

### Variation C — Family plan

| Tier | Price |
|------|-------|
| Family | $14.99/mo — 4 child profiles, 2 prints/yr |
| Classroom | $29/mo — 25 seats, no print |
| Print bulk | $16.99 each at 5+ |

*Impact:* Homeschool/co-op ACV; slower PLG.

### Variation D — Grandparent landing *(seasonal)*

| SKU | Price |
|-----|-------|
| Gift box: 3mo Premium + 1 printed book | **$59** *(not built yet)* |
| Gift box: 12mo + 2 books | **$129** *(not built yet)* |
| Print-only (remote approval) | $24.99 |

*Impact:* Q4 can be 40–60% of annual print volume.

---

## Upgrade paths (priority order)

Build and optimize in this order:

1. **At parent approval** — “Ship this book $19.99” *(shipped 2026-06-25)*
2. **End of free story #3** — soft paywall: Premium or wait until next month
3. **Monthly email** — “You have an approved book ready to print”
4. **Series milestone** — “Book 3 in the series — collect the set” → print bundle
5. **Premium trial day 12** — “Add a printed keepsake — $14.99 intro”

---

## Product upgrades backlog (ranked)

| Upgrade | Price idea | Priority |
|---------|------------|----------|
| Extra softcover (duplicate for grandparent) | $14.99 add-on at checkout | **High** |
| “Yearbook” annual print (all stories) | $49–79 | **High** for power users |
| Grandparent gift box (Premium + print) | $59 / $129 | **High** (Variation D) |
| Premium annual | $79/yr (2 mo free) | Medium — churn reduction |
| Voice narration of finished book | +$2.99/book or Premium perk | Medium |
| Referral credit | $10 per referred family | Medium — cheap CAC |
| Character export (PNG pack) | $4.99 | Low |

---

## KPIs (what we optimize)

| KPI | Base-case target |
|-----|------------------|
| **Print attach rate** (approved → paid print) | **≥12%** |
| **Premium trial → paid** (with print nudge) | **≥35%** |
| **Time to first print** from signup | **<21 days** |
| **Stories per active child / month** | **≥2** = sticky |

Track in dev1 console: [rickyscontrolcenter.com/inklings](https://rickyscontrolcenter.com/inklings)

---

## Decision principles

When choosing what to build next, apply these in order:

1. **Does it increase print attach or shorten time-to-first-print?** → Do it.
2. **Does it reduce parent friction at approval?** → Do it (approval is the money moment).
3. **Does it increase kid completion rate (trial → finished story)?** → Do it.
4. **Does it help grandparents buy without understanding the app?** → Do it (gift SKUs, landing pages).
5. **Does it only improve Premium MRR without print or retention?** → Second priority.
6. **Does it add complexity kids/parents must learn?** → Deprioritize unless it unlocks #1–4.
7. **Does it make us sound like StoryFawn?** → Reject — sharpen the “author, not hero” wedge.

**Do not optimize for:** open-ended AI chat, unlimited beat variants without quality, parent approval on every beat (bottleneck), or digital-only value props.

---

## What we explicitly defer

- Classroom / B2B pricing at scale (red tape)
- Voice-first as primary input until recognition is ≥95% for kid voices
- Raising Premium price before print attach is proven
- Competing with StoryFawn on “fastest single book” — different job

---

## Related docs

| File | Purpose |
|------|---------|
| `AGENTS.md` | Engineering + agent conventions |
| `docs/INKLINGS_SPINE_DEVIATIONS.md` | Brand/architecture overrides |
| `prisma/schema.prisma` | Data model |
| `KNOWLEDGE/SITES/inklings.md` (CLAUDE-UNIFIED) | VPS deploy + infra |

---

*Revisit this document when pricing, funnel, or segment assumptions change materially — or after each quarter of live data.*
