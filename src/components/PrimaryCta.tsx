import Link from "next/link";
import type { ReactNode } from "react";

export const DEFAULT_CTA_MICROCOPY = "Free · no credit card · you approve every page";

export interface PrimaryCtaProps {
  href: string;
  children: ReactNode;
  /** Trust microcopy under the button. `false` hides it; omitted uses the default line. */
  microcopy?: string | false;
  variant?: "primary" | "secondary";
  className?: string;
  /** Optional: set when rendered on the plum band so the microcopy + secondary button read on dark. */
  onDark?: boolean;
}

/**
 * Button + trust microcopy. Shared so every primary CTA carries the same
 * reassurance ("Free · no credit card · you approve every page").
 */
export function PrimaryCta({
  href,
  children,
  microcopy,
  variant = "primary",
  className = "",
  onDark = false,
}: PrimaryCtaProps) {
  const text = microcopy === undefined ? (variant === "primary" ? DEFAULT_CTA_MICROCOPY : false) : microcopy;
  const btn =
    variant === "primary"
      ? "btn-primary btn-large"
      : onDark
        ? "btn-secondary btn-large !border-cream-100 !text-cream-100 hover:!bg-cream-100 hover:!text-ink"
        : "btn-secondary btn-large";
  return (
    <div className="inline-flex flex-col items-center">
      <Link href={href} className={`${btn} ${className}`.trim()}>
        {children}
      </Link>
      {text ? (
        <p
          className={`mt-2 text-[13px] leading-snug ${onDark ? "text-cream-200" : "text-ink-600"}`}
        >
          {text}
        </p>
      ) : null}
    </div>
  );
}
