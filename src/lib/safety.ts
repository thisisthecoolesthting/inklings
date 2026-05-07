/**
 * Safety transforms — sanitize child voice/text input before any AI call.
 * Per Inklings handoff: never return error messages to a child; redirect playfully.
 */
const BLOCKED_TERMS: ReadonlyArray<RegExp> = [
  /\b(weapon|gun|knife|bomb)\b/i,
  /\b(blood|kill|murder)\b/i,
  /\b(scary|nightmare|monster)\b/i, // bedtime context — soften
];

export function sanitizeChildInput(raw: string): { safe: string; redirected: boolean } {
  let text = raw.normalize("NFKC").trim();
  let redirected = false;
  for (const re of BLOCKED_TERMS) {
    if (re.test(text)) {
      text = text.replace(re, "something special");
      redirected = true;
    }
  }
  if (text.length > 240) { text = text.slice(0, 240); redirected = true; }
  return { safe: text, redirected };
}

export function moderateAiText(text: string): { ok: boolean; reason?: string } {
  for (const re of BLOCKED_TERMS) {
    if (re.test(text)) return { ok: false, reason: "blocked-term" };
  }
  return { ok: true };
}
