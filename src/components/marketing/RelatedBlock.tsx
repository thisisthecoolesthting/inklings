import Link from "next/link";

export function RelatedBlock({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-ink">{title}</h3>
      <ul className="text-sm text-muted">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-[44px] items-center font-medium text-coral-dark underline underline-offset-4 hover:text-coral-700">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
