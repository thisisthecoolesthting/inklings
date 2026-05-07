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
