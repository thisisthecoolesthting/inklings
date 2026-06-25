import { ShieldCheck, Ban, HeartHandshake, Lock } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, label: "COPPA-aware", sub: "Parent account required" },
  { icon: Ban, label: "No ads", sub: "Ever" },
  { icon: HeartHandshake, label: "Parent-approved", sub: "Before anything publishes" },
  { icon: Lock, label: "Private by default", sub: "No public kid profiles" },
];

export function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${className}`}>
      {BADGES.map((b) => (
        <li key={b.label} className="flex flex-col items-center rounded-card border border-ink-100 bg-cream-50 px-3 py-4 text-center">
          <b.icon className="h-7 w-7 text-coral" aria-hidden />
          <span className="mt-2 text-sm font-bold text-ink">{b.label}</span>
          <span className="text-xs text-ink-500">{b.sub}</span>
        </li>
      ))}
    </ul>
  );
}
