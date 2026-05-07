import type { ReactNode } from "react";

export function BigButton({
  children, onClick, kind = "coral", disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  kind?: "coral" | "mint";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={kind === "coral" ? "big-button" : "big-button-mint"}
    >
      {children}
    </button>
  );
}
