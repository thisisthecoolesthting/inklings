import { brand } from "@/lib/brand";
import { sendViaStalwart } from "@/lib/stalwart-send";

interface ResendMessage {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
}

/** Parse `Name <addr@host>` or `addr@host` into { name?, email }. */
function parseFrom(from: string): { name?: string; email: string } {
  const m = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1] || undefined, email: m[2].trim() };
  return { email: from.trim() };
}

async function sendViaResend(msg: ResendMessage): Promise<void> {
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

async function sendViaSmtp(msg: ResendMessage): Promise<void> {
  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
  await transport.sendMail({
    from: msg.from,
    to: msg.to,
    subject: msg.subject,
    text: msg.text,
    html: msg.html,
  });
}

async function sendMessage(msg: ResendMessage): Promise<void> {
  // Preferred: send as a real Stalwart mailbox via admin JMAP (no per-mailbox
  // password). Activated when STALWART_ADMIN_PASSWORD is configured.
  if (process.env.STALWART_ADMIN_PASSWORD) {
    const { name, email } = parseFrom(msg.from);
    return sendViaStalwart({
      from: email,
      fromName: name,
      to: msg.to,
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
    });
  }
  // Fallback: SMTP submission (requires a mailbox password).
  if (process.env.MAIL_HOST && process.env.MAIL_USER) return sendViaSmtp(msg);
  // Default: Resend HTTP API (or dev console log when unset).
  return sendViaResend(msg);
}

export async function sendMagicLinkEmail({ to, url }: { to: string; url: string }) {
  const from = process.env.RESEND_FROM_EMAIL ?? brand.emailFrom;
  await sendMessage({
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

export async function sendPasswordResetEmail({ to, url }: { to: string; url: string }) {
  const from = process.env.RESEND_FROM_EMAIL ?? brand.emailFrom;
  await sendMessage({
    from: `${brand.name} <${from}>`,
    to: [to],
    subject: `Reset your ${brand.name} password`,
    text: `Click the link below to reset your ${brand.name} password:\n\n${url}\n\nThis link expires in 60 minutes. If you didn't request it, you can safely ignore this email.`,
    html: `<!doctype html><html><body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background:#FFF6E5; padding:32px; color:#4A2545;">
      <div style="max-width:520px;margin:0 auto;background:#fff;padding:32px;border-radius:20px;">
        <h1 style="margin:0 0 16px;font-size:24px;color:#4A2545;">Reset your password</h1>
        <p style="font-size:16px;line-height:1.5;">Tap the button to choose a new password. This link expires in 60 minutes.</p>
        <p style="margin:24px 0;"><a href="${url}" style="display:inline-block;background:#F4815C;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;">Reset password</a></p>
        <p style="font-size:12px;color:#7D506E;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    </body></html>`,
  });
}

export async function sendApprovalNotification({ to, childName, kind }: { to: string; childName: string; kind: "character" | "story" }) {
  const from = process.env.RESEND_FROM_EMAIL ?? brand.emailFrom;
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://inklings.shop"}/portal/approvals`;
  await sendMessage({
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

export async function sendGiftCodeEmail(opts: {
  to: string;
  code: string;
  planLabel: string;
  recipientEmail?: string | null;
}) {
  const from = process.env.RESEND_FROM_EMAIL ?? brand.emailFrom;
  const redeemUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://inklings.shop"}/gift/redeem`;

  await sendMessage({
    from: `${brand.name} <${from}>`,
    to: [opts.to],
    subject: `Your ${brand.name} gift — ${opts.planLabel}`,
    text: `Gift code: ${opts.code}\n\nRedeem at ${redeemUrl}`,
    html: `<!doctype html><html><body style="font-family:-apple-system,sans-serif;background:#FFF6E5;padding:32px;">
      <div style="max-width:520px;margin:0 auto;background:#fff;padding:32px;border-radius:20px;">
        <h1>Gift Premium ready</h1>
        <p style="font-size:28px;font-weight:bold;color:#F4815C;">${opts.code}</p>
        <p><a href="${redeemUrl}" style="display:inline-block;background:#F4815C;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;">Redeem gift code</a></p>
      </div>
    </body></html>`,
  });

  if (opts.recipientEmail && opts.recipientEmail !== opts.to) {
    await sendMessage({
      from: `${brand.name} <${from}>`,
      to: [opts.recipientEmail],
      subject: `Someone gifted you ${brand.name} Premium`,
      text: `Redeem at ${redeemUrl}\n\nCode: ${opts.code}`,
      html: `<!doctype html><html><body style="font-family:-apple-system,sans-serif;background:#FFF6E5;padding:32px;">
        <div style="max-width:520px;margin:0 auto;background:#fff;padding:32px;border-radius:20px;">
          <h1>You got a story universe gift</h1>
          <p style="font-size:28px;font-weight:bold;color:#F4815C;">${opts.code}</p>
          <p><a href="${redeemUrl}" style="display:inline-block;background:#F4815C;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;">Redeem now</a></p>
        </div>
      </body></html>`,
    });
  }
}

export async function sendPrintOrderConfirmation(opts: { to: string; bookTitle: string }) {
  const from = process.env.RESEND_FROM_EMAIL ?? brand.emailFrom;
  const ordersUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://inklings.shop"}/portal/orders`;
  await sendMessage({
    from: `${brand.name} <${from}>`,
    to: [opts.to],
    subject: `Print order confirmed — ${opts.bookTitle}`,
    text: `"${opts.bookTitle}" is being printed. Ships in 7–10 days. ${ordersUrl}`,
    html: `<!doctype html><html><body style="font-family:-apple-system,sans-serif;background:#FFF6E5;padding:32px;">
      <div style="max-width:520px;margin:0 auto;background:#fff;padding:32px;border-radius:20px;">
        <h1>Print order confirmed</h1>
        <p><strong>${opts.bookTitle}</strong> is on its way — expect delivery in 7–10 business days.</p>
        <p><a href="${ordersUrl}" style="display:inline-block;background:#F4815C;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;">View orders</a></p>
      </div>
    </body></html>`,
  });
}
