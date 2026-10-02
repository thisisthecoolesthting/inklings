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
      ? "btn-primary w-full text-sm sm:w-auto"
      : "btn-secondary w-full text-sm sm:w-auto";
  return (
    <button type="submit" disabled={pending} className={cls + (pending ? " opacity-60" : "")}>
      {pending ? (kind === "approve" ? "Approving…" : "Sending back…") : children}
    </button>
  );
}
