"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

/**
 * Footer lead form: "Email me a sample story".
 * Works with fetch (inline message) and degrades to a plain form POST that redirects back
 * with ?sample=sent|error (read on mount, so no Suspense boundary is needed).
 */
export function LeadCapture() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const flag = new URLSearchParams(window.location.search).get("sample");
      if (flag === "sent") {
        setStatus("ok");
        setMessage("Sent! Check your inbox in a minute.");
      } else if (flag === "error") {
        setStatus("error");
        setMessage("That didn't work. Please check the email address and try again.");
      }
    } catch {
      /* ignore */
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          website: String(data.get("website") ?? ""),
          source: "footer-sample",
        }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (res.ok && json?.ok) {
        setStatus("ok");
        setMessage(json.message ?? "Sent! Check your inbox in a minute.");
        form.reset();
      } else {
        setStatus("error");
        setMessage(json?.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the server. Please try again.");
    }
  }

  return (
    <div id="sample-story" className="scroll-mt-24 rounded-card bg-ink-800/70 p-6 md:p-8">
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-display text-xl font-bold text-white">Email me a sample story</p>
          <p className="mt-2 text-sm text-cream-200">
            A link to Milo and the Moonbeam Map, our sample story. No newsletter unless you ask.
          </p>
        </div>
        <form action="/api/lead" method="POST" onSubmit={onSubmit} noValidate={false}>
          <label htmlFor="lead-email" className="block text-sm font-semibold text-white">
            Your email
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="lead-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="parent@example.com"
              className="h-12 min-h-[48px] w-full flex-1 rounded-button border-2 border-transparent bg-white px-4 text-base text-ink placeholder:text-ink-400"
            />
            {/* Honeypot: hidden from people and assistive tech. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />
            <button type="submit" disabled={status === "sending"} className="btn-primary btn-full sm:w-auto disabled:opacity-70">
              {status === "sending" ? "Sending..." : "Send the sample"}
            </button>
          </div>
          <p
            role={status === "error" ? "alert" : "status"}
            aria-live="polite"
            className={
              "mt-3 min-h-[1.25rem] text-sm " +
              (status === "error" ? "font-semibold text-red-200" : "text-mint")
            }
          >
            {message}
          </p>
        </form>
      </div>
    </div>
  );
}
