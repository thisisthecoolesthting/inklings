/**
 * Stalwart JMAP sender for transactional email.
 *
 * Sends as a real server mailbox (e.g. hello@inklings.shop) using a single
 * admin credential — no per-mailbox password needed. This mirrors the proven
 * dev1 control-center client (`src/lib/stalwart-jmap.ts`) that drives ~110
 * mailboxes on the same Stalwart server.
 *
 * Activated when STALWART_ADMIN_PASSWORD is set (see lib/email.ts dispatcher).
 * Env:
 *   STALWART_ADMIN_USER       (default "admin")
 *   STALWART_ADMIN_PASSWORD
 *   STALWART_JMAP_URL         (default http://127.0.0.1:8082/jmap)
 *   STALWART_JMAP_SESSION_URL (default http://127.0.0.1:8082/.well-known/jmap)
 *   MAIL_FROM / RESEND_FROM_EMAIL  -> the sending mailbox address
 */

const JMAP_URL = process.env.STALWART_JMAP_URL || "http://127.0.0.1:8082/jmap";
const SESSION_URL =
  process.env.STALWART_JMAP_SESSION_URL || "http://127.0.0.1:8082/.well-known/jmap";
const ADMIN_USER = process.env.STALWART_ADMIN_USER || "admin";
const ADMIN_PASS = process.env.STALWART_ADMIN_PASSWORD || "";

const JMAP_CORE = "urn:ietf:params:jmap:core";
const JMAP_MAIL = "urn:ietf:params:jmap:mail";
const JMAP_SUBMISSION = "urn:ietf:params:jmap:submission";
const JMAP_PRINCIPALS = "urn:ietf:params:jmap:principals";

function authHeader(): string {
  return "Basic " + Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString("base64");
}

type MethodCall = [string, Record<string, unknown>, string];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MethodResponse = [string, any, string];

async function jmap(methodCalls: MethodCall[], using: string[]): Promise<MethodResponse[]> {
  const res = await fetch(JMAP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: authHeader() },
    body: JSON.stringify({ using, methodCalls }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`JMAP ${res.status}: ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { methodResponses: MethodResponse[] };
  return json.methodResponses;
}

function respOf(responses: MethodResponse[], name: string) {
  return responses.find((r) => r[0] === name)?.[1];
}

let principalsCtx: string | null = null;
async function principalsAccountId(): Promise<string> {
  if (principalsCtx) return principalsCtx;
  const res = await fetch(SESSION_URL, {
    headers: { Authorization: authHeader() },
    cache: "no-store",
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`JMAP session ${res.status}`);
  const json = (await res.json()) as { primaryAccounts?: Record<string, string>; accounts?: Record<string, unknown> };
  const id =
    json.primaryAccounts?.[JMAP_PRINCIPALS] ||
    json.primaryAccounts?.[JMAP_CORE] ||
    Object.keys(json.accounts || {})[0];
  if (!id) throw new Error("JMAP session: no account id");
  principalsCtx = id;
  return id;
}

const accountIdCache = new Map<string, string>();
/** Resolve the JMAP accountId (== principal id) for a mailbox address. */
async function accountIdForEmail(email: string): Promise<string> {
  const lc = email.toLowerCase();
  const cached = accountIdCache.get(lc);
  if (cached) return cached;
  const ctx = await principalsAccountId();
  const resp = await jmap(
    [
      ["Principal/query", { accountId: ctx, filter: { type: "individual" }, limit: 1000 }, "0"],
      [
        "Principal/get",
        {
          accountId: ctx,
          "#ids": { resultOf: "0", name: "Principal/query", path: "/ids" },
          properties: ["id", "name", "email"],
        },
        "1",
      ],
    ],
    [JMAP_CORE, JMAP_PRINCIPALS],
  );
  const list = (respOf(resp, "Principal/get")?.list ?? []) as Array<{ id: string; name?: string; email?: string }>;
  const match = list.find(
    (p) => (p.email || "").toLowerCase() === lc || (p.name || "").toLowerCase() === lc,
  );
  if (!match) throw new Error(`no Stalwart mailbox for ${email}`);
  accountIdCache.set(lc, match.id);
  return match.id;
}

export interface StalwartMessage {
  from: string; // mailbox address that must exist on the server
  fromName?: string;
  to: string[];
  subject: string;
  text: string;
  html?: string;
}

export async function sendViaStalwart(msg: StalwartMessage): Promise<void> {
  const accountId = await accountIdForEmail(msg.from);

  // Drafts mailbox + sending identity for this account.
  const meta = await jmap(
    [
      ["Mailbox/get", { accountId, properties: ["id", "role"] }, "m"],
      ["Identity/get", { accountId }, "i"],
    ],
    [JMAP_CORE, JMAP_MAIL, JMAP_SUBMISSION],
  );
  const boxes = (respOf(meta, "Mailbox/get")?.list ?? []) as Array<{ id: string; role: string | null }>;
  const draftsId = boxes.find((b) => b.role === "drafts")?.id;
  const sentId = boxes.find((b) => b.role === "sent")?.id;
  if (!draftsId) throw new Error(`Stalwart account for ${msg.from} has no Drafts mailbox`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const identities = (respOf(meta, "Identity/get")?.list ?? []) as any[];
  const identity =
    identities.find((i) => (i.email || "").toLowerCase() === msg.from.toLowerCase()) ?? identities[0];
  if (!identity) throw new Error(`no sending identity for ${msg.from}`);

  // Build the draft. Include HTML + text alternative when html is provided.
  const draftKey = "draft1";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bodyValues: Record<string, any> = { tpart: { value: msg.text } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emailCreate: any = {
    mailboxIds: { [draftsId]: true },
    keywords: { $draft: true, $seen: true },
    from: [{ email: msg.from, name: msg.fromName || undefined }],
    to: msg.to.map((email) => ({ email })),
    subject: msg.subject,
  };
  if (msg.html) {
    bodyValues.hpart = { value: msg.html };
    emailCreate.htmlBody = [{ partId: "hpart", type: "text/html" }];
    emailCreate.textBody = [{ partId: "tpart", type: "text/plain" }];
  } else {
    emailCreate.textBody = [{ partId: "tpart", type: "text/plain" }];
  }
  emailCreate.bodyValues = bodyValues;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSuccess: any = { [`mailboxIds/${draftsId}`]: null, "keywords/$draft": null };
  if (sentId) onSuccess[`mailboxIds/${sentId}`] = true;

  const resp = await jmap(
    [
      ["Email/set", { accountId, create: { [draftKey]: emailCreate } }, "0"],
      [
        "EmailSubmission/set",
        {
          accountId,
          onSuccessUpdateEmail: { "#sub1": onSuccess },
          create: { sub1: { identityId: identity.id, emailId: `#${draftKey}` } },
        },
        "1",
      ],
    ],
    [JMAP_CORE, JMAP_MAIL, JMAP_SUBMISSION],
  );
  const setRes = respOf(resp, "Email/set");
  if (setRes?.notCreated?.[draftKey]) {
    throw new Error(`draft create failed: ${JSON.stringify(setRes.notCreated[draftKey])}`);
  }
  const subRes = respOf(resp, "EmailSubmission/set");
  if (subRes?.notCreated?.sub1) {
    throw new Error(`send failed: ${JSON.stringify(subRes.notCreated.sub1)}`);
  }
}
