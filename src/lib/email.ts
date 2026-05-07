import { brand } from "@/lib/brand";

interface ResendMessage {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
}

async function sendViaResend(msg: ResendMessage) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Dev fallback — log the email so the magic link is visible in the terminal.
    console.log("[email:dev]", JSON.stringify(msg, null, 2));
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(msg),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export async function sendMagicLinkEmail({ to, url }: { to: string; url: string }) {
  const from = process.env.RESEND_FROM_EMAIL ?? brand.emailFrom;
  await sendViaResend({
    from: `${brand.name} <${from}>`,
    to: [to],
    subject: `Your sign-in link for ${brand.name}`,
    text: `Click the link below to sign in to ${brand.name}:\n\n${url}\n\nThis link expires in 30 minutes. If you didn't request it, you can safely ignore this email.`,
    html: `<!doctype html><html><body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background:#FFF6E5; padding:32px; color:#4A2545;">
      <div style="max-width:520px;margin:0 auto;background:#fff;padding:32px;border-radius:20px;">
        <h1 style="margin:0 0 16px;font-size:24px;color:#4A2545;">Sign in to ${brand.name}</h1>
        <p style="font-size:16px;line-height:1.5;">Tap the button to sign in. This link expires in 30 minutes.</p>
        <p style="margin:24px 0;"><a href="${url}" style="display:inline-block;background:#F4815C;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;">Sign in to ${brand.name}</a></p>
        <p style="font-size:12px;color:#7D506E;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    </body></html>`,
  });
}

export async function sendApprovalNotification({ to, childName, kind }: { to: string; childName: string; kind: "character" | "story" }) {
  const from = process.env.RESEND_FROM_EMAIL ?? brand.emailFrom;
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://inklings.shop"}/portal/approvals`;
  await sendViaResend({
    from: `${brand.name} <${from}>`,
    to: [to],
    subject: `${childName} has a new ${kind} waiting for your approval`,
    text: `${childName} just made a new ${kind} in ${brand.name}. Review it at ${url}.`,
    html: `<!doctype html><html><body style="font-family:-apple-system, sans-serif;background:#FFF6E5;padding:32px;color:#4A2545;">
      <div style="max-width:520px;margin:0 auto;background:#fff;padding:32px;border-radius:20px;">
        <h1 style="margin:0 0 16px;color:#4A2545;">${childName} made something new</h1>
        <p>It's a ${kind}, waiting for your approval before anyone else sees it.</p>
        <p><a href="${url}" style="display:inline-block;background:#F4815C;color:#fff;padding:14px 28px;border-radius:12px;font-weight:600;text-decoration:none;">Review now</a></p>
      </div>
    </body></html>`,
  });
}
