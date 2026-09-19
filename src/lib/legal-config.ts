/**
 * Legal entity details shown on /legal/privacy and /legal/terms.
 *
 * OPERATOR ACTION REQUIRED: the operator must fill these before COPPA/legal
 * compliance is complete. Set the env vars below (they are inlined at build
 * time, so rebuild after changing them). Until they are set the legal pages
 * render honest fallback copy that points to hello@inklings.shop — never
 * invent values here.
 *
 *   NEXT_PUBLIC_OPERATOR_LEGAL_NAME        e.g. "Example Studio LLC"
 *   NEXT_PUBLIC_OPERATOR_MAILING_ADDRESS   e.g. "123 Main St, City, ST 00000, USA"
 *   NEXT_PUBLIC_GOVERNING_LAW_JURISDICTION e.g. "the State of Delaware, USA"
 */
function clean(v: string | undefined): string | null {
  const t = v?.trim();
  return t ? t : null;
}

export const OPERATOR_LEGAL_NAME: string | null = clean(process.env.NEXT_PUBLIC_OPERATOR_LEGAL_NAME);
export const OPERATOR_MAILING_ADDRESS: string | null = clean(
  process.env.NEXT_PUBLIC_OPERATOR_MAILING_ADDRESS,
);
export const GOVERNING_LAW_JURISDICTION: string | null = clean(
  process.env.NEXT_PUBLIC_GOVERNING_LAW_JURISDICTION,
);
