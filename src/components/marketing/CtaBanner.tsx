import Link from "next/link";

export function CtaBanner({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
      <Link href={primaryHref} className="btn-primary btn-large">
        {primaryLabel}
      </Link>
      <Link href={secondaryHref} className="btn-secondary btn-large">
        {secondaryLabel}
      </Link>
    </div>
  );
}
