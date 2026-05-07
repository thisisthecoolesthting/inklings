---
to: codex
from: claude (cowork)
date: 2026-05-07
priority: P1-HIGH
project: inklings
fleet: inklings-product
machine: any
working_dir: /var/www/inklings (VPS) OR C:\Users\reasn\Projects\inklings (operator host)
repo: https://github.com/thisisthecoolesthting/inklings
default_branch: main
branch: feat/approval-flow
dispatch_id: INKLINGS-APPROVAL-FLOW-011
depends_on: [INKLINGS-BOOTSTRAP-001]
blockedBy: []
parallel_safe: true
order: 11
agent: codex
operator_blocked_on: []
reply: cursor-dispatch/inbox/2026-05-07-011-approval-flow.reply.md
proof: build/proof/INKLINGS-APPROVAL-FLOW-011.json
self_merge_after_green: true
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
scope_pass: implement_only_then_commit
---

# 011 — Wire the parent-approval flow

## 0. Orientation (3 reads)

1. `AGENTS.md` — TL;DR + "Two product surfaces" + safety doctrine. The parent approval gate is non-negotiable architecture.
2. `src/app/portal/approvals/page.tsx` — current state: server component queries pending characters/books and renders cards with button stubs.
3. `prisma/schema.prisma` — `Character.sandboxMode: Boolean @default(true)` + `Character.parentApprovedAt: DateTime?`. `Book.status: String @default("draft")` (values: `draft | awaiting_parent | approved | exported | ordered`) + `Book.parentApprovedAt: DateTime?`.

## 1. Why

Current `/portal/approvals` page renders pending characters and books with **stub** Approve / Send-back buttons (`<button type="button">` with no handlers). The whole product's safety contract — "nothing publishes without parent approval" — depends on these buttons actually working. Today they do nothing.

## 2. What you're building

A. New server-actions file: `src/app/portal/approvals/actions.ts`. Four exports:

- `approveCharacter(formData: FormData)` — reads `id`, verifies parent owns the child, sets `sandboxMode=false` + `parentApprovedAt=now`, revalidates `/portal` + `/portal/approvals` + `/studio`.
- `rejectCharacter(formData: FormData)` — reads `id`, verifies ownership, deletes the character row entirely (it was only ever in sandbox). revalidates same paths.
- `approveBook(formData: FormData)` — reads `id`, verifies ownership via `book.child.parentId === session.userId`, sets `status='approved'` + `parentApprovedAt=now`, revalidates.
- `rejectBook(formData: FormData)` — reads `id`, verifies ownership, sets `status='draft'` (sends back to draft for the kid to revise; do NOT delete book data), revalidates.

All four use `"use server"` directive at file top. All four pull session via `getSession()` from `@/lib/session` and short-circuit with `redirect('/login')` if absent.

B. Modify `src/app/portal/approvals/page.tsx`:

Replace each `<button type="button">Approve</button>` with a `<form>` containing a hidden `<input name="id" value={ch.id}>` and a submit button. Use server-action `<form action={approveCharacter}>` Next 15 native pattern. Same for reject. Books: same shape, different action.

The action returns implicit `revalidatePath` so the page re-renders without that row after success.

C. Add optimistic-style hint via small UX detail:

In the page, the `<form>` submit button should have `aria-label` and a CSS class so when it's submitting, it shows a tiny spinner. Use Next's `useFormStatus()` from `react-dom` — wrap the submit button in a tiny client component `<SubmitButton kind="approve|reject">{children}</SubmitButton>` in the same `actions.ts` file (or a sibling `submit-button.tsx`). On `pending=true`, disable the button and show "Approving…" text.

## 3. Code shape

`src/app/portal/approvals/actions.ts`:

```typescript
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const IdSchema = z.object({ id: z.string().min(8).max(40) });

async function requireSession() {
  const s = await getSession();
  if (!s) redirect("/login?next=/portal/approvals");
  return s;
}

function revalidateAll() {
  revalidatePath("/portal");
  revalidatePath("/portal/approvals");
  revalidatePath("/portal/children");
  revalidatePath("/studio");
}

export async function approveCharacter(formData: FormData) {
  const session = await requireSession();
  const parsed = IdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;
  // Verify ownership: character.child.parentId == session.userId
  const ch = await prisma.character.findFirst({
    where: { id: parsed.data.id, child: { parentId: session.userId } },
  });
  if (!ch) return; // silent — never leak existence to non-owner
  await prisma.character.update({
    where: { id: ch.id },
    data: { sandboxMode: false, parentApprovedAt: new Date() },
  });
  revalidateAll();
}

export async function rejectCharacter(formData: FormData) {
  const session = await requireSession();
  const parsed = IdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;
  const ch = await prisma.character.findFirst({
    where: { id: parsed.data.id, child: { parentId: session.userId } },
  });
  if (!ch) return;
  await prisma.character.delete({ where: { id: ch.id } });
  revalidateAll();
}

export async function approveBook(formData: FormData) {
  const session = await requireSession();
  const parsed = IdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;
  const b = await prisma.book.findFirst({
    where: { id: parsed.data.id, child: { parentId: session.userId } },
  });
  if (!b) return;
  await prisma.book.update({
    where: { id: b.id },
    data: { status: "approved", parentApprovedAt: new Date() },
  });
  revalidateAll();
}

export async function rejectBook(formData: FormData) {
  const session = await requireSession();
  const parsed = IdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;
  const b = await prisma.book.findFirst({
    where: { id: parsed.data.id, child: { parentId: session.userId } },
  });
  if (!b) return;
  await prisma.book.update({
    where: { id: b.id },
    data: { status: "draft" },
  });
  revalidateAll();
}
```

`src/app/portal/approvals/submit-button.tsx`:

```typescript
"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  kind,
  children,
}: {
  kind: "approve" | "reject";
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  const cls =
    kind === "approve"
      ? "btn-primary text-sm"
      : "btn-secondary text-sm";
  return (
    <button type="submit" disabled={pending} className={cls + (pending ? " opacity-60" : "")}>
      {pending ? (kind === "approve" ? "Approving…" : "Sending back…") : children}
    </button>
  );
}
```

`src/app/portal/approvals/page.tsx` — replace each button stub with a `<form>`:

```tsx
import { approveCharacter, rejectCharacter, approveBook, rejectBook } from "./actions";
import { SubmitButton } from "./submit-button";

// ... inside the character card:
<div className="mt-4 flex gap-2">
  <form action={approveCharacter}>
    <input type="hidden" name="id" value={ch.id} />
    <SubmitButton kind="approve">Approve</SubmitButton>
  </form>
  <form action={rejectCharacter}>
    <input type="hidden" name="id" value={ch.id} />
    <SubmitButton kind="reject">Send back</SubmitButton>
  </form>
</div>

// ... books queue similarly with approveBook / rejectBook
```

## 4. Acceptance gates

- `npx tsc --noEmit` exit 0
- `npx next build` exit 0
- Manual smoke (only the test seed exists right now, but verify schema): `psql inklings -c "select id,name,\"sandboxMode\" from \"Character\" limit 5;"` shows the demo characters with sandboxMode=true if not approved
- After approve, the character row should have `sandboxMode=false` and `parentApprovedAt!=NULL`
- Server-action submission runs as `www-data` and respects RLS (we don't have RLS yet but ownership check is in code)
- Page revalidates: after approve, the row is gone from /portal/approvals on next render

## 5. Push + PR

```bash
cd <working_dir>
git pull origin main --ff-only
git checkout -b feat/approval-flow
# implement
npx tsc --noEmit && NEXT_TELEMETRY_DISABLED=1 npm run build
# write build/proof/INKLINGS-APPROVAL-FLOW-011.json
git mv cursor-dispatch/outbox/011-inklings-approval-flow.prompt.md cursor-dispatch/done/
git add -A
git commit -m "feat(portal): wire parent approval server actions (011)

Replaces stub Approve/Send-back buttons in /portal/approvals with
real server actions:
- approveCharacter: sandboxMode=false + parentApprovedAt=now
- rejectCharacter: deletes the sandbox character (only the parent's
  scoped data — ownership verified via child.parentId==session.userId)
- approveBook: status='approved' + parentApprovedAt=now
- rejectBook: status='draft' (sends back to kid for revision)

All four actions:
- 'use server' directive at file top
- session-gated via getSession() with redirect('/login')
- ownership-verified — silent no-op for non-owner (never leak existence)
- revalidatePath() on /portal, /portal/approvals, /portal/children, /studio

UX: SubmitButton client component reads useFormStatus() to disable
button + show 'Approving…' / 'Sending back…' during submission.

This is the load-bearing safety gate for the entire product.

Verified: tsc --noEmit exit 0; next build OK.
Proof: build/proof/INKLINGS-APPROVAL-FLOW-011.json"
git push -u origin feat/approval-flow
gh pr create --base main --head feat/approval-flow \
  --title "feat(portal): wire parent approval server actions (011)" \
  --body "Implements INKLINGS-APPROVAL-FLOW-011. Approve/Reject buttons in /portal/approvals now actually flip DB rows. self_merge_after_green=true."
```

## 6. Self-merge

```bash
gh pr merge <num> --squash --delete-branch=false
```

## 7. Stop conditions

- Don't expose `id` of records the parent doesn't own — silently return on ownership-verify miss
- Don't add a "delete book" action — books should soft-archive (status='draft') so the kid's work isn't lost
- Don't add new Prisma models — the schema already has the columns we need
- Don't add Resend email yet — email-on-approve is a follow-up dispatch; this one is purely DB+UI
