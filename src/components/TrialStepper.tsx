/**
 * Visual-only 3-step progress indicator above /trial's signup form.
 *
 * Labels match the real flow, not an aspirational one: signup (this form)
 * creates the parent account and logs them straight in (src/lib/auth/complete-login.ts
 * redirects to /portal — there is no email-verification step in this path).
 * A grown-up then adds the child in /portal/children, and only then does the
 * child meet Sparky in /studio (src/app/studio/page.tsx: "A grown-up needs to
 * add your name first" gate). This component adds no new form steps — the
 * signup form below is still a single step.
 */
const STEPS = [
  { n: 1, label: "Create account" },
  { n: 2, label: "Add your child" },
  { n: 3, label: "Meet Sparky in the Studio" },
];

export function TrialStepper({ current = 1 }: { current?: 1 | 2 | 3 }) {
  return (
    <ol className="mt-8 flex items-center gap-2" aria-label="Signup steps">
      {STEPS.map((step, i) => {
        const state = step.n < current ? "done" : step.n === current ? "active" : "upcoming";
        return (
          <li key={step.n} className="flex flex-1 items-center gap-2 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={state === "active" ? "step" : undefined}
                className={
                  "flex h-8 w-8 flex-none items-center justify-center rounded-full text-sm font-bold transition-colors " +
                  (state === "done"
                    ? "bg-mint-500 text-white"
                    : state === "active"
                      ? "bg-coral text-white ring-4 ring-coral/20"
                      : "border-2 border-ink-100 bg-white text-ink-400")
                }
              >
                {state === "done" ? "✓" : step.n}
              </span>
              <span
                className={
                  "max-w-[6.5rem] text-center text-[11px] font-semibold leading-tight sm:text-xs " +
                  (state === "upcoming" ? "text-ink-400" : "text-ink-700")
                }
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={"mt-[-1.25rem] h-0.5 flex-1 rounded-full " + (step.n < current ? "bg-mint-500" : "bg-ink-100")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
