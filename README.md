# Inklings

> A storybook your child stars in.

Inklings is an AI-guided storybook studio for kids ages 4 to 8. Children build a persistent character family, co-write a five-act story with **Sparky** (a bounded branching companion), and parents approve every page before it publishes. Real printed softcover books ship via Amazon KDP.

**Live:** https://inklings.shop (deployment pending)
**Repo:** https://github.com/thisisthecoolesthting/inklings
**Spawned from:** the SolutionStore SaaS spine (see `docs/SOLUTIONSTORE_SAAS_SPINE.md`)

## Stack

- Next 15 + React 18 + Tailwind 3 + TypeScript strict
- Prisma 6 + PostgreSQL 17
- Magic-link auth (`jose` JWT, `ink_session` cookie)
- Stripe SDK 17 (free / premium / per-print orders)
- Anthropic Claude API (Sonnet) for Sparky
- TogetherAI Flux for illustrations
- pdf-lib + sharp for KDP-spec PDF export

## Two surfaces

- **`/studio`** — kid-facing. Voice-first, giant tap buttons, bounded Sparky flows.
- **`/portal`** — parent-facing. Approval queue, orders, settings, billing.

## Quickstart

```bash
cp .env.example .env.local        # fill in DATABASE_URL + JWT_SECRET (others optional in dev)
npm install
npx prisma migrate dev
npx prisma db seed                # demo parent + 2 children + 2 characters + 1 world
npm run dev                       # http://localhost:3400
```

Without keys filled in, magic-link emails are logged to the console (handy for dev).

## Generate a sample KDP-spec book

```bash
npm run kdp:sample
# writes build/proof/kdp-sample.pdf — open in Acrobat to verify 8.75" × 8.75" page size
```

## Layout

```
src/app/
  (marketing)/         # public pages — home, pricing, faq, how-it-works, about, security, trial
  studio/              # kid-facing UI — story flow, character creation
  portal/              # parent dashboard — children, approvals, orders, settings
  api/auth/{login,verify,logout}/
  api/sparky/beat/     # branching beat endpoint

src/components/
  Header.tsx Footer.tsx SiteChrome.tsx FAQ.tsx PricingTiers.tsx
  marketing/           # spine §6 building blocks
  studio/              # SparkyChat, BigButton, StylizationSlider, StoryActProgress
  portal/              # parent-portal widgets

src/lib/
  brand.ts site-url.ts session.ts prisma.ts email.ts
  auth/magic-link.ts
  sparky.ts            # Claude API client (currently stubbed)
  safety.ts            # input sanitize + AI moderation
  kdp/page-template.ts kdp/cover-template.ts

src/content/
  faq-data.ts feature-pages.ts sparky-prompts.ts (locked branching flows)

prisma/schema.prisma   # User, MagicLink, Session, ChildProfile, Character, World, Series, Book, BookPage, Order, UsageEvent
```

## Audience

Parents of children ages 4 to 8. Grandparents looking for keepsake gifts. Homeschool families. **Never** marketed at kids directly — kids only see Sparky and the Studio.

## Safety architecture

See `docs/INKLINGS_SPINE_DEVIATIONS.md` and `AGENTS.md`. Highlights:

- New characters live in `sandboxMode = true` until parent approves
- Photos: face detection on-device, faces blurred before upload
- Sparky is a tightly-bounded branching flow, not an open chatbot
- Content moderation on every AI text + image output
- COPPA-compliant: parent owns the account, child profile cascades off it
- Nothing publishes, exports, or prints without parent approval

## License

Proprietary. © 2026 Inklings. All rights reserved.
