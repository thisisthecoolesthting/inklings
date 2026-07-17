import { ShieldCheck, Ban, HeartHandshake, Lock } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, label: "COPPA-aware" },
  { icon: Ban, label: "No ads" },
  { icon: HeartHandshake, label: "Parent-approved" },
  { icon: Lock, label: "Private" },
];

/** Compact trust strip — keeps above-the-fold free for CTAs + product proof. */
export function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}
      aria-label="Trust and safety"
    >
      {BADGES.map((b) => (
        <li key={b.label} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700">
          <b.icon className="h-4 w-4 text-coral" aria-hidden />
          <span>{b.label}</span>
        </li>
      ))}
    </ul>
  );
}
