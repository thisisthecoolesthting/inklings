# Inklings public-claims audit — 2026-09-18

Scope: every concrete factual product/safety/privacy/pricing claim shown on public pages (src/app, src/content,
src/components, JSON-LD, sitemap/robots), checked against the code in this repo (src/lib, src/app/api, Prisma
schema, saas_spec.json, Stripe/Lulu wiring, Studio components).

Status key:
- **VERIFIED** — code supports the claim (file cited). "Repo only" means live Stripe/Lulu/Stalwart settings were not inspected.
- **FIXED** — the claim was false or unsupported; the copy was changed to match the code (this audit's commits).
- **SOFTENED** — partly true; wording narrowed to what the code supports.
- **FLAG** — needs an operator decision or a product/code change; copy has NOT been faked (some also had wording softened).

Rule for future copy: do not add a claim that is not in this table, and do not describe a feature without a file that implements it.

## 1. Photo / face-blur / upload claims (the trigger for this audit)

| # | Claim | Where shown | Evidence | Status | Action |
|---|---|---|---|---|---|
| 1 | Photos run through on-device face detection; faces blurred before upload | FAQ, /features/draw-or-photo, /security card + meta, /legal/privacy, feature-pages, AGENTS.md, README | No face-detection dependency in package.json; no upload route under src/app/api (auth, billing, contact, gift, lead, mode, portal, sparky only); docs/INKLINGS_SPINE_DEVIATIONS.md listed it as "not yet wired" | **FIXED** (was false) | Removed everywhere. FAQ/privacy/security now state there are no photo or drawing uploads and no facial data collected; "we will update the policy before ever adding uploads" |
| 2 | Original (blurred) photo kept privately for re-rendering | /legal/privacy | Same as #1 | **FIXED** | Paragraph replaced |
| 3 | "No collection of biometric data — face detection runs in your browser" | /legal/privacy | Outcome true (no uploads), stated reason false | **FIXED** | Reworded to "no uploads, so no face images or facial data" |
| 4 | "Optional avatar you upload" on child profile | /legal/privacy | `ChildProfile.avatarUrl` exists in schema but nothing in src sets it (grep) | **FIXED** | Removed |
| 5 | "Photograph a stuffed animal, draw a hero…" | /how-it-works step 3, feature card | `src/app/studio/character/CharacterMaker.tsx` is a pick-list only (name, 8 animals, 8 colours, 6 traits, pick 1–2) | **FIXED** | Step 3 now describes taps + Quick start (Milo & Pip, `STARTER_FRIENDS`) |
| 6 | /features/draw-or-photo page ("Draw or snap to character", "Faces are blurred…") | /features hub, sitemap, next-feature row | Feature does not exist | **FIXED** | Page rewritten as /features/character-maker "Build a character in a few taps" (real pickers, Character Bible link, no uploads, parent review). 308 redirect from old slug in next.config.mjs; sitemap, hub card, next-feature row and canonical derive from `FEATURES` so they follow the new slug (checked on a production build: 308 → 200, sitemap lists /features/character-maker) |
| 7 | "Just like my drawing" slider | `components/studio/StylizationSlider.tsx` | Component is not imported anywhere (dead code) | **FLAG** | Not user-visible; delete when convenient |

## 2. Studio / Sparky / safety claims

| # | Claim | Where shown | Evidence | Status | Action |
|---|---|---|---|---|---|
| 8 | Voice input via browser speech recognition; server gets text only, no audio | privacy, voice-first page | `components/studio/use-voice-recognition.ts` (Web Speech API); beat route receives choice IDs only | **VERIFIED** | Added note: some browsers send audio to their own speech service |
| 9 | "Sparky narrates the story back" | /features/voice-first-studio | No `speechSynthesis`/TTS anywhere in src (`audioCue` is set in `lib/sparky.ts` but never played) | **FIXED** (was false) | Removed; copy says questions are on-screen text a grown-up can read aloud |
| 10 | "No reading required / no reading needed" | FAQ, /how-it-works, feature meta, grandparents FAQ | Sparky's line is on-screen text (`SparkyChat.tsx`); choices have emoji but also labels | **SOFTENED** | Now: big emoji buttons, optional mic, questions appear as text, grown-up may read aloud |
| 11 | "There is no freeform text input" / "never type" | FAQ, /features, /security, safety-first, for-reluctant-writers | `CharacterMaker.tsx` has a free-text **name** field (maxLength 30), validated by `studio/character/actions.ts` and word-filtered by `sanitizeChildInput` | **SOFTENED** | Copy now says the only text a child types is a character name (30 chars); no typed questions to the AI |
| 12 | Pre-built branching flows, chips we wrote, 2–4 choices | FAQ, /security, features | `content/sparky-prompts.ts` (`BEAT_DEFINITIONS`, 7 beats with variants); `/api/sparky/beat` rejects unknown beat/choice IDs | **VERIFIED** | — |
| 13 | "Content moderation on every AI output" / safety filters on Sparky text AND the illustration model | /security card, safety-first, feature-pages, README, AGENTS | `lib/safety.ts` `moderateAiText` = 3 blocked-word regexes, applied to Sparky text only (`lib/sparky.ts` L166) with stub fallback. `lib/image-gen.ts` sets no safety flags; primary provider is OpenRouter Gemini image, fallback Together FLUX | **FIXED** (overstated) | Copy now says: blocked-word list on child input and every page Sparky writes, safe fallback page if it fails; illustrations reviewed by the parent. No claim about image-model filters. AGENTS.md line "moderation enabled on TogetherAI Flux calls" removed |
| 14 | Sandbox mode: new characters private to child's session and do NOT join the family until approved | parent-approval page, /security, FAQ, AGENTS/README, approvals UI badge | `createCharacter` sets `sandboxMode: true` but immediately calls `assignCharacterToSeries`; `studio/story/page.tsx` builds the cast from all `seriesCast`. Approval only flips flags and enables re-slotting in portal (`series/actions.ts` requires `sandboxMode:false`) | **FIXED** (was false) | Copy: "flagged in your portal — approve or send back". Portal badge "Sandbox — only X can see this" → "Waiting for your approval". **Operator decision:** if a real sandbox is wanted, `createCharacter`/`bootstrapStarterCast` must stop auto-assigning to the cast |
| 15 | Parent can edit text / regenerate art / edit a sentence during review | /how-it-works, parent-approval, homeschool | `portal/approvals/page.tsx` + `actions.ts`: only Approve, Approve & print, Send back (`rejectBook` → status `draft`; `rejectCharacter` deletes) | **FIXED** (was false) | Removed edit/regenerate; described approve / send back |
| 16 | Nothing prints without parent approval | many | `api/billing/checkout` print branch: `book.status !== "approved"` → 400 | **VERIFIED** | Wording narrowed from "publish/export/print" to "printed"; there is no publish, share or PDF-export feature |
| 17 | Every page reviewed side-by-side (text left, art right) | parent-approval | Approvals page shows a card grid, art above text | **SOFTENED** | "illustration with the story text beneath it" |
| 18 | Children cannot communicate with anyone outside the family; no public profiles/feed | /security, privacy | No messaging/feed/profile routes exist. Caveat: generated images are served unauthenticated at `/uploads/**` (see #66) | **VERIFIED** (absence) | — |
| 19 | No child login | hero, brand, features | Only parent auth in `api/auth/*`; Studio runs on the parent session | **VERIFIED** | — |
| 20 | Character Bible: name, species, traits, favourite activities, recurring phrases, saved look, "same voice" | /features/character-bible, FAQ | `Character` model has those columns but the only writers set name, species, role, colour, traits, imageSeed (`studio/character/actions.ts`); `previewUrl` is read from `approvedImagesJson.preview` which nothing writes; providers ignore `imageSeed` | **FIXED** (overstated) | Copy lists what is saved (name, animal, colour, traits) and says Sparky reuses that description in every prompt; adds "AI art can still vary page to page" |
| 21 | Same puppy looks like the same puppy every story | FAQ, features | Consistency is prompt-text only (`buildImagePrompt`/`characterLookLine`) | **SOFTENED** | See #20 |
| 22 | Series memory is a Premium feature | /features, /pricing, redeem, portal | `studio/story/page.tsx` builds `lastBookRecap` for every tier; `tier-limits.ts` only limits number of series (free 1, premium 999) and core cast (3 for both) | **FIXED** (not gated) | Presented as every-plan within a story world; Premium sells "more story worlds". **Operator decision:** gate it or keep it free |
| 23 | Story = five acts (beginning, problem, adventure, resolution, celebration), 7 pages | /how-it-works, reluctant writers | `BEAT_DEFINITIONS` acts; 7 beats; submit requires ≥3 pages | **VERIFIED** | — |
| 24 | Illustrations contain no text; "no garbled AI words" | StudioPreview, StoryVisuals, reluctant writers | `STORYBOOK_STYLE` prompt says "no text"; not enforced | **SOFTENED** | "We ask the illustrator to leave words out"; story text sits below art (`StoryPageCard.tsx`) |
| 25 | "A kid makes a book in about 20 minutes" / "first book is twenty minutes away" | home, FAQ/CTAs, trial, how-it-works, audiences | No timing data in repo | **FLAG** | Unmeasured estimate, left as marketing copy. Time a real session or soften to "one sitting" |
| 26 | "Ages 4–8" | everywhere | Marketing target; add-child form accepts 2–14; Sparky reading-level note keys off age (`lib/sparky.ts`) | **VERIFIED** (as target, not enforced) | — |
| 27 | /try is a fixed demo, no account | /try | `TasteOfSparky.tsx` hard-coded branches | **VERIFIED** | — |
| 28 | Art on top, readable text below on every page | hero, home | `StoryPageCard.tsx`, `BookReader.tsx` | **VERIFIED** | — |
| 29 | Demo pages / "real story" / "real 20-minute book" / sample-email "made by a child … approved by a parent" | HomeHero caption, home button, StoryVisuals eyebrow, sample-story email | Showcase built by `scripts/build-marketing-showcase.ts` with a scripted child name | **FIXED** | Relabelled "sample"; email now says "a demo story made with Sparky" |
| 30 | HD illustrations generated on approval | approvals page, orders page | `portal/approvals/actions.ts` `fireHdGeneration`, only when `TOGETHER_API_KEY` is set, all tiers | **VERIFIED** (env-dependent) | — |

## 3. Plans, pricing, billing

| # | Claim | Where shown | Evidence | Status | Action |
|---|---|---|---|---|---|
| 31 | Free: 3 stories per month | pricing, FAQ, home, homeschool | `api/sparky/beat` `FREE_TIER_STORIES_PER_MONTH = 3`, rolling 30 days, counted **per account** (not per child), only when `session.tier === "free"` | **VERIFIED** (with nuance) | Homeschool copy fixed ("across your account"). **FLAG:** `/api/sparky/beat` has no auth requirement — calls without a session skip the quota and spend Anthropic/image credit |
| 32 | Free: 1 child profile / Premium: unlimited child profiles | /pricing tiers | `portal/children/actions.ts addChild` has no tier check | **FIXED** (not enforced) | Removed from both tiers. **Operator decision:** enforce a 1-child free limit or leave open |
| 33 | Free: 1 world, up to 3 characters | /pricing | `series-bootstrap.ts getSeriesLimits`: free `maxSeries 1` per child, `maxCoreCast 3` | **VERIFIED** | Reworded precisely (1 story world per child, cast of up to 3) |
| 34 | Premium: unlimited worlds & characters | /pricing | premium `maxSeries 999`, but `maxCoreCast` is 3 on both tiers; characters are uncapped on both | **SOFTENED** | "Unlimited story worlds per child, each with its own cast of up to 3" |
| 35 | Free: low-res PDF download with watermark | /pricing | No PDF/download/watermark route or code exists (grep pdf/watermark/download over src/app, components); `UsageEvent` comment mentions `pdf_exported` but nothing writes it | **FIXED** (was false) | Removed. **Operator decision:** build PDF export + watermark, or keep the tiers as re-written |
| 36 | Premium: HD print-ready PDF, no watermark / "HD export" | /pricing, home, gift redeem, portal, meta, JSON-LD | Same as #35; HD illustrations are generated at approval for every tier (#30) | **FIXED** | Removed |
| 37 | Priority illustration generation | /pricing | No queue/priority code | **FIXED** | Removed |
| 38 | Premium "unlimited stories" | pricing, gift | Premium is not story-limited, but `PREMIUM_IMAGES_PER_MONTH = 1500` illustrations/month applies (`api/sparky/beat`) | **VERIFIED** (fair-use cap exists) | Copy left as "unlimited"; cap ≈ 200 stories/month. Add a fair-use line if desired |
| 39 | Premium $9.99/mo | pricing, saas_spec | `STRIPE_PRICE_PREMIUM_MONTHLY`, saas_spec.json 999 | **VERIFIED** (repo only) | Live Stripe price not checked |
| 40 | 14-day trial, card required, $0 today | pricing | `checkout` premium: `mode: "subscription"`, `trial_period_days: 14` | **VERIFIED** | — |
| 41 | Cancel in one click | terms, footer, FAQ | `api/billing/portal` opens Stripe Billing Portal; "Cancel plan" availability depends on portal configuration in the Stripe dashboard | **VERIFIED** (code) / dashboard unchecked | Terms step label fixed to the real button text "Open billing portal" |
| 42 | Free plan never asks for a card | trial, pricing, FAQ | `api/auth/signup` has no Stripe step | **VERIFIED** | — |
| 43 | Printed book $19.99 one-time, any tier | many | `STRIPE_PRICE_PRINT_BOOK`, webhook fallback 1999, `PrintCheckoutForm` label | **VERIFIED** (repo only) | — |
| 44 | 8.5×8.5 softcover, full colour | many | `lib/lulu/print-order-lulu.js` `POD_SQUARE_SOFTCOVER = "0850X0850.FC.PRE.SS.080CW444.GXX"`; `print-pdf.js` still carries "TODO confirm Lulu supports 8.5×8.5" | **VERIFIED** in code / **FLAG** | Order one proof copy to confirm trim, page count and finish |
| 45 | "Matte" cover | FAQ, /pricing, printed-keepsake | Nothing in code mentions matte; the package ID's finish code is `G` (gloss in Lulu SKU convention — verify) | **FIXED** (unsupported) | Removed "matte". **FLAG:** confirm actual finish with Lulu |
| 46 | "24–32 pages" / "up to 32 illustrated pages" | /how-it-works, /pricing, printed-keepsake meta | `fulfill-print-order.ts`: `pageCount = ceil((1 + pages)/4)*4`; a Studio story has 7 pages, so ≈ 8-page saddle-stitched book (`.SS.`) | **FIXED** (misleading) | Now "one illustrated page for each step of the story" |
| 47 | Ships in 7–10 days | home, hero, pricing, FAQ, features, grandparents, StoryVisuals, portal | No shipping-time data in repo; depends on Lulu production + carrier | **FLAG** | Labelled "estimated" on /pricing, FAQ, /how-it-works, printed-keepsake; still stated flatly in home, hero, grandparents, StoryVisuals, portal strings — confirm against Lulu lead times then standardise |
| 48 | Print ships to US, Canada, UK, Australia | printed-keepsake | `checkout` print: `allowed_countries: ["US","CA","GB","AU"]` | **VERIFIED** | — |
| 49 | Printing by Lulu; address + book file shared with Lulu | privacy, features | `lib/lulu/fulfill-print-order.ts` | **VERIFIED** | — |
| 50 | Card details never seen by Inklings | privacy, features | Stripe-hosted Checkout | **VERIFIED** | — |
| 51 | Damaged/misprinted books replaced or refunded; no cancellation once sent to fulfilment | terms, features | Policy statement; no refund code | **FLAG** | Operator must confirm this is honoured |
| 52 | Only approved stories can be ordered | features | See #16 | **VERIFIED** | — |
| 53 | Story needs 2 cast members, world holds up to 3 | character-maker | `minCoreCastToPublish() = 2`, `maxCoreCast 3` | **VERIFIED** | — |

## 4. Gifting

| # | Claim | Where shown | Evidence | Status | Action |
|---|---|---|---|---|---|
| 54 | Gift tiers 1 / 6 / 12 months at $9.99 / $49.99 / $89.99 | /gift | `scripts/mint-stripe-gift-prices.mjs` (999/4999/8999), `giftPriceId()`, `PLAN_MONTHS` | **VERIFIED** (repo only) | Live Stripe price IDs not checked |
| 55 | "Unlimited stories for 30 days" | /gift | `redeemGiftCode` uses `setMonth(+months)` | **FIXED** | "for one month" |
| 56 | Code emailed to purchaser, and to recipient if given | /gift | `webhook` `createGiftCode` + `sendGiftCodeEmail` | **VERIFIED** | — |
| 57 | Gift buyer signs in to a (free) parent account first | /gift | `checkout` requires a session | **VERIFIED** | Logged-out redirect now returns to /gift (task 4) |
| 58 | Recipient redeems at /gift/redeem and Premium switches on | /gift | `api/gift/redeem`, `redeemGiftCode` | **VERIFIED** | Clarified it activates on the recipient's own parent account |
| 59 | "They play on your family account"; grandparent approves each book | /for-grandparents | Gift attaches Premium to the redeemer's account; approvals belong to that account holder | **FIXED** (was false) | Reworded: recipient's parent approves |
| 60 | Gift code expires | (not claimed) | `createGiftCode` = 2 years | note | Consider stating it |

## 5. Privacy, COPPA, data

| # | Claim | Where shown | Evidence | Status | Action |
|---|---|---|---|---|---|
| 61 | Export everything as JSON from portal settings | privacy | `api/portal/export` + settings page | **VERIFIED** | Covers children, characters, worlds, series, books/pages, orders (not usage/consent rows) |
| 62 | Delete account deletes all associated data within 30 days | privacy, features | `api/portal/delete-account`: deletes orders + User (cascade to sessions, children, characters, worlds, series, books, pages). **Not** deleted: `UsageEvent` (userId only, `meta.childName`), `ParentalConsent`, `GiftCode` rows, generated image files in `public/uploads/**` | **FIXED** (overstated) | Policy now lists what is deleted and says consent/usage/order records may be kept. **Operator decision:** add cleanup for UsageEvent, image files |
| 63 | "Revoke consent … from /portal/settings" | privacy | Settings page has only Account, Billing, Export, Delete | **FIXED** (was false) | Now: email us or delete the account |
| 64 | Parental consent captured at signup | trial, FAQ | `api/auth/signup` writes `ParentalConsent` (consent text, IP, user-agent) | **VERIFIED** | Privacy now discloses IP/UA on the record |
| 65 | "COPPA-compliant" / "Yes" | FAQ, /security card | Legal conclusion; operator entity/address env vars in `lib/legal-config.ts` may be unset | **SOFTENED** | "Built around COPPA's parent-consent model". **FLAG:** counsel review before restoring an unqualified claim. TrustBadges says "COPPA-aware" (left) |
| 66 | Data private to your account / no public discovery | privacy, TrustBadges "Private" | `src/app/uploads/[...path]/route.ts` serves story images with no auth; URLs are random 96-bit ids but not access-controlled | **FLAG** | Removed "kept privately" phrasing tied to uploads. Consider signed URLs or auth-checked serving |
| 67 | Collect only child's first name and age | FAQ, /security | `ChildProfile.name/age`; also character names typed by the child, `UsageEvent.meta.childName` | **VERIFIED** (disclosed) | Privacy "Story & character inputs" and "Usage records" bullets added |
| 68 | Google Analytics 4, IP anonymised, only in aggregate | privacy | `app/layout.tsx` gtag with `anonymize_ip: true`, gated on `NEXT_PUBLIC_GA_ID` | **VERIFIED** | **FLAG:** the tag is in the root layout, so it also loads on `/studio` (kid surface) — decide whether to suppress there |
| 69 | No ads; no sale of data; no public profiles | hero, privacy | No ad code, no data-sharing code beyond listed processors | **VERIFIED** (absence) | — |
| 70 | Processors: Stripe, Anthropic, Together AI, Resend/mail, Lulu | privacy | `lib/sparky.ts` (Anthropic), `lib/image-gen.ts` (OpenRouter → Google Gemini image; Together fallback), `lib/email.ts` (Resend / SMTP), Lulu | **FIXED** (OpenRouter missing) | Added |
| 71 | Footer "Email me a sample story" stores address | (undisclosed) | `api/lead` → `Lead` table | **FIXED** | Disclosed in privacy |
| 72 | Sign-in by magic link or password | privacy cookies | `api/auth/verify`, `login`, `signup` | **VERIFIED** | The deviations doc still says "magic-link only" (stale) |

## 6. Audience pages and misc

| # | Claim | Where shown | Evidence | Status | Action |
|---|---|---|---|---|---|
| 73 | "Pilot it with one class for free" | /for-teachers end band | No pilot programme in code; /contact has topic `classroom` | **FIXED** / **FLAG** | Now "Interested in using it with your class?" → contact. Operator decides whether a free pilot exists |
| 74 | Classroom use, "school-safe by design", pairs in the Studio, parents approve at home | /for-teachers | No classroom mode, no student accounts; Studio needs a signed-in parent account | **FIXED** / **FLAG** | Copy says there is no dedicated classroom mode yet. Product decision needed |
| 75 | "Especially strong results from ADHD, dyslexia, ESL families"; "including ADHD & dyslexia"; "hyperfocus-friendly" | /for-reluctant-writers | No data | **FIXED** (unsubstantiated health/education claim) | Removed; added "no medical or educational claims" |
| 76 | "Approved stories export as PDF-ready books / download or print" | teachers, reluctant writers, homeschool | No PDF export | **FIXED** | Replaced with on-screen library + optional print |
| 77 | "Email me this story as a PDF" | /try | Nothing generates a PDF; link goes to /contact?topic=sample-story | **FIXED** | "Ask us to send a sample story" |
| 78 | Sibling/multi-child handling on Free | homeschool FAQ | See #31, #32 | **FIXED** | Copy matches enforced behaviour |
| 79 | "We read every email", "reply within 2 business days" | contact, privacy, terms | Human process; `api/contact` just sends mail | **FLAG** | Operator must honour or soften |
| 80 | "We're a small team" | /about | Unverifiable | **FLAG** | Operator to confirm; /about has commented-out founder block (placeholders guarded by `check-placeholders`) |
| 81 | 10-second walkthrough video | /watch, /how-it-works | `public/videos/walkthrough.{mp4,webm}` exist; duration not checked | **FLAG** (minor) | Confirm length or drop "10-second" |
| 82 | Homepage showcase images are the demo story | home | `marketing-showcase.ts` manifest is committed; **fallback** `getSampleUploads()` would list real users' `public/uploads/preview/*.jpg` if the manifest were missing | **FLAG** | Remove the uploads fallback so user-generated images can never reach marketing pages |
| 83 | Internal specs still say watermark / HD export / "no reading required" | saas_spec.json, niche_specs/inklings.json, NORTH-STAR.md | See #35, #10 | **FLAG** | Left unchanged (specs, not public pages). Update if the plan changes |

## Summary

Total claims audited: **83 rows** (some rows bundle several near-identical strings across pages).

| Status | Rows |
|---|---|
| VERIFIED (incl. "repo only" / with nuance; #44 also carries a flag) | 34 |
| FIXED (false or unsupported, copy changed; #73 and #74 also carry a product flag) | 31 |
| SOFTENED (narrowed to what code supports) | 7 |
| FLAG-only (no copy change; operator or code action) | 10 |
| Note (not a claim) | 1 |

Several FIXED rows also leave a decision open (#14 sandbox, #22 series memory, #32 child limit, #35 PDF/watermark, #45 cover finish, #62 deletion) — see the list below.

## Operator decisions needed

1. **PDF export / watermark / "HD"** — none exist. Copy now omits them. Build them (and re-add to the tiers) or leave as is.
2. **Free "1 child profile"** — not enforced in `addChild`.
3. **Series memory** — currently free on every plan; gate or keep.
4. **Character sandbox** — new characters are auto-added to the series cast before approval. Decide if approval should truly gate use.
5. **Delete-account completeness** — UsageEvent (with child first name), ParentalConsent, GiftCode rows and generated images survive account deletion.
6. **Public image URLs** (`/uploads/**`) and the marketing-page uploads fallback.
7. **Unauthenticated `/api/sparky/beat`** — bypasses quotas and costs money.
8. **GA4 on `/studio`** — COPPA consideration.
9. **Print** — confirm cover finish (gloss vs matte), trim, real page count and shipping time with a proof copy; then standardise "7–10 days".
10. **Legal** — entity name/address env vars (`NEXT_PUBLIC_OPERATOR_*`) and a counsel read of the COPPA wording.
11. **Teachers page** — is a free classroom pilot real? Is a classroom mode planned?
12. **"~20 minutes"** — time a real session or soften across the site.
