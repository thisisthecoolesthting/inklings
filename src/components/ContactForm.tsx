"use client";

import { useState, type FormEvent } from "react";

const TOPICS = [
  { value: "support", label: "Support with my account" },
  { value: "classroom", label: "Classroom or school pilot" },
  { value: "press", label: "Press inquiry" },
  { value: "safety", label: "Safety concern" },
  { value: "sample-story", label: "Send me a sample story" },
] as const;

export type TopicValue = (typeof TOPICS)[number]["value"];

const inputClass =
  "mt-1 w-full rounded-button border-2 border-ink-100 bg-white px-4 py-3 text-base focus:border-coral focus:outline-none";

export function ContactForm({ initialTopic }: { initialTopic: TopicValue }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          topic: data.get("topic"),
          message: data.get("message"),
          website: data.get("website") ?? "",
        }),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
        return;
      }
      setErrorMsg(
        res.status === 429
          ? "You've sent a few messages in a row. Please wait a few minutes and try again, or email us directly at"
          : res.status === 400
            ? "Please check that your email and message are filled in, then try again, or email us directly at"
            : "We couldn't send that just now. Please try again, or email us directly at",
      );
      setStatus("error");
    } catch {
      setErrorMsg("We couldn't reach the server. Please try again, or email us directly at");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card-base border-mint-200 bg-mint-50" role="status">
        <h2 className="text-2xl font-bold text-ink">Thank you — message sent.</h2>
        <p className="mt-3 text-ink-700">
          We read every note ourselves and will reply by email, usually within 2 business days.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-secondary mt-6">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-base relative space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-semibold text-ink">
          Your name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={120}
          autoComplete="name"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-semibold text-ink">
          Your email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          className={inputClass}
          placeholder="parent@example.com"
        />
      </div>
      <div>
        <label htmlFor="contact-topic" className="block text-sm font-semibold text-ink">
          What is this about?
        </label>
        <select id="contact-topic" name="topic" defaultValue={initialTopic} className={inputClass}>
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={5}
          maxLength={5000}
          rows={6}
          className={inputClass}
        />
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {errorMsg}{" "}
          <a className="font-semibold underline" href="mailto:hello@inklings.shop">
            hello@inklings.shop
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary btn-large w-full sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p className="text-xs text-ink-500">
        We use your email only to reply to this message. Please don&apos;t include your
        child&apos;s full name or other personal details.
      </p>
    </form>
  );
}
