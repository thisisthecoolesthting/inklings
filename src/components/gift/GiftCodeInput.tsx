"use client";

import { useRef } from "react";

export function GiftCodeInput({ defaultValue = "" }: { defaultValue?: string }) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <input
      ref={ref}
      name="code"
      required
      minLength={8}
      maxLength={32}
      defaultValue={defaultValue}
      placeholder="INK-XXXX-XXXX"
      autoComplete="off"
      spellCheck={false}
      className="mt-1 w-full rounded-button border border-ink-100 px-4 py-3 text-center font-mono text-lg uppercase tracking-widest text-ink focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
      onChange={(e) => {
        e.target.value = e.target.value.toUpperCase();
      }}
    />
  );
}
