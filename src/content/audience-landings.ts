export type AudienceLandingConfig = {
  slug: string;
  path: string;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  bullets: { title: string; body: string; link?: { href: string; label: string } }[];
  steps?: { title: string; body: string }[];
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  faq: { q: string; a: string }[];
  related: { href: string; label: string }[];
  /** Hide the "Related" link row (used when the page ends on a dedicated band). */
  hideRelated?: boolean;
  /** Closing CtaBand rendered as the last thing on the page. */
  endBand?: {
    title: string;
    body?: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
    microcopy?: string;
  };
};

export const AUDIENCE_LANDINGS: AudienceLandingConfig[] = [
  {
    slug: "for-grandparents",
    path: "/for-grandparents",
    breadcrumbLabel: "For grandparents",
    eyebrow: "Gift a story universe",
    title: "Give a gift that grows all year — not just one book",
    subtitle:
      "Grandparents love Inklings because it is simple to gift, easy to track from your portal, and every season your grandchild can turn a story into a printed softcover keepsake.",
    metaTitle: "Story book gift for grandchildren ages 4-8",
    metaDescription:
      "Gift Inklings Premium to grandchildren ages 4-8. They build characters and stories all year, you approve from your portal, and printed books ship to them.",
    bullets: [
      {
        title: "One gift, many stories",
        body: "Premium unlocks unlimited adventures with the same characters — Milo today, the same Milo next month.",
      },
      {
        title: "You stay in the loop",
        body: "Nothing publishes without a grown-up. You approve each book from a simple portal — no tech headaches.",
      },
      {
        title: "Real books on the shelf",
        body: "Order an 8.5″ softcover after you approve a story. Ships in about 7–10 days — perfect for birthdays and holidays.",
        link: { href: "/how-it-works", label: "See how printing works" },
      },
    ],
    primaryCta: { href: "/gift", label: "See gift plans" },
    secondaryCta: { href: "/how-it-works", label: "How it works" },
    faq: [
      {
        q: "Can my grandchild use it without reading?",
        a: "Yes. Sparky is voice-first with big tap buttons — kids 4-8 never need to type or read menus.",
      },
      {
        q: "Do I need to be tech-savvy?",
        a: "No. You gift Premium by email; they play in the Studio on your family account. You approve stories from one portal page.",
      },
      {
        q: "Is the printed book extra?",
        a: "Premium covers the digital studio. Printed softcovers are a one-time $19.99 add-on whenever you approve a story worth keeping.",
      },
    ],
    related: [
      { href: "/gift", label: "Gift Premium" },
      { href: "/pricing", label: "Compare plans" },
      { href: "/features/parent-approval", label: "Parent approval" },
    ],
    hideRelated: true,
    endBand: {
      title: "Give a whole year of stories.",
      primary: { label: "Gift 1 year of Premium", href: "/gift" },
      secondary: { label: "See a sample book", href: "/#see-it-in-action" },
      microcopy: "Redeemed by email · you can stay in the approval loop.",
    },
  },
  {
    slug: "for-teachers",
    path: "/for-teachers",
    breadcrumbLabel: "For teachers",
    eyebrow: "Classroom storytelling",
    title: "Every kid leaves the lesson holding a story they wrote",
    subtitle:
      "Inklings turns oral storytelling into illustrated pages kids can read back — voice-first, no login maze, parent approval built in for take-home books.",
    metaTitle: "Classroom storytelling tool for ages 4-8",
    metaDescription:
      "Voice-first digital storytelling for classrooms. Kids tap choices with Sparky, get illustrated pages, and parents approve printed keepsake books at home.",
    bullets: [
      {
        title: "Voice-first literacy",
        body: "Kids who struggle with pencils still finish a story. Sparky guides bounded choices — no blank-page anxiety.",
      },
      {
        title: "Clear parent gate",
        body: "Stories go to a parent portal for approval before anything is shared or printed — school-safe by design.",
      },
      {
        title: "Keepsake outcome",
        body: "Each child leaves with a story they authored. Families can order a softcover — a tangible win for open house or portfolio night.",
      },
    ],
    steps: [
      { title: "Introduce Sparky", body: "10 minutes: what is a character, what is a choice, demo one beat together." },
      { title: "Story sprint", body: "20 minutes: pairs or individuals tap through a short adventure in the Studio." },
      { title: "Share & print", body: "Parents approve at home; optional class set of softcovers for a fundraiser or celebration." },
    ],
    primaryCta: { href: "/contact?topic=classroom", label: "Request classroom info" },
    secondaryCta: { href: "/try", label: "Try Sparky with your class — no login" },
    faq: [
      {
        q: "Does every child need an account?",
        a: "Families use one parent account. For classroom pilots, contact us — we can advise on the simplest rollout for your grade.",
      },
      {
        q: "Is content moderated?",
        a: "Yes. Bounded story choices, parent approval before publish, and no open-ended AI chat with children.",
      },
      {
        q: "Can we export stories?",
        a: "Approved stories live in the family library as PDF-ready books. Printed softcovers are optional.",
      },
    ],
    related: [
      { href: "/features/voice-first-studio", label: "Voice-first Studio" },
      { href: "/for-reluctant-writers", label: "Reluctant writers" },
      { href: "/how-it-works", label: "How it works" },
    ],
    endBand: {
      title: "Pilot it with one class for free.",
      primary: { label: "Request a classroom pilot", href: "/contact?topic=classroom" },
      secondary: { label: "Try the demo now", href: "/try" },
      microcopy: "Tell us about your class and we'll write back by email.",
    },
  },
  {
    slug: "for-reluctant-writers",
    path: "/for-reluctant-writers",
    breadcrumbLabel: "Reluctant writers",
    eyebrow: "No blank page",
    title: "For kids who say “I can't write” — including ADHD & dyslexia",
    subtitle:
      "Sparky asks one question at a time. Your child taps or talks. Illustrated pages appear as the story grows — confidence before handwriting pressure.",
    metaTitle: "Writing app for reluctant readers & ADHD kids 4-8",
    metaDescription:
      "Story-making without blank-page stress. Voice-first choices, instant illustrations, and parent-approved books for kids 4-8 who dislike writing.",
    bullets: [
      {
        title: "Tap or talk — never type",
        body: "Giant choice chips with emoji. Optional mic. If speech fails, tap always works — no error screens.",
      },
      {
        title: "Immediate visual reward",
        body: "Each choice adds an illustrated page. Hyperfocus-friendly pacing; finish a whole book in about twenty minutes.",
      },
      {
        title: "Readable finished product",
        body: "Art is generated without garbled AI text in the picture. Story words sit in a clear band below — like a real book.",
      },
    ],
    primaryCta: { href: "/trial", label: "Start free" },
    secondaryCta: { href: "/features/voice-first-studio", label: "See the Studio" },
    faq: [
      {
        q: "Is this only for ADHD?",
        a: "No — any child ages 4-8 who hates blank pages benefits. We hear especially strong results from ADHD, dyslexia, and ESL families.",
      },
      {
        q: "Will it feel like homework?",
        a: "Sparky is a game-like guide, not a worksheet. Kids pick adventures; you approve the book when it is done.",
      },
      {
        q: "Can therapists or tutors recommend it?",
        a: "Yes. Approved stories export as keepsake books — useful for confidence milestones. Contact us for professional resources.",
      },
    ],
    related: [
      { href: "/features/voice-first-studio", label: "Voice-first Studio" },
      { href: "/for-teachers", label: "For teachers" },
      { href: "/security", label: "Safety & privacy" },
    ],
    endBand: {
      title: "A finished book in one sitting.",
      primary: { label: "Start free — no typing required", href: "/trial" },
      secondary: { label: "Try the tap-to-choose demo", href: "/try" },
      microcopy: "Works with a mic or just tapping.",
    },
  },
  {
    slug: "homeschool",
    path: "/homeschool",
    breadcrumbLabel: "Homeschool",
    eyebrow: "Creative writing at home",
    title: "One curriculum block they'll actually beg to repeat",
    subtitle:
      "Character design, plot choices, revision through parent approval, and a printed book at the end — language arts with a keepsake outcome.",
    metaTitle: "Homeschool creative writing for ages 4-8",
    metaDescription:
      "Homeschool story-making with Inklings: voice-first writing, character continuity across books, parent approval, and optional printed softcovers.",
    bullets: [
      {
        title: "Cross-session characters",
        body: "Build a character bible once — the same hero returns in every story, like a real series author.",
      },
      {
        title: "Parent as editor",
        body: "Review every book before it publishes. Edit text, approve art, then add it to your child's library shelf.",
      },
      {
        title: "Portfolio-ready",
        body: "Download or print the best stories for your homeschool portfolio or end-of-year celebration.",
      },
    ],
    primaryCta: { href: "/trial", label: "Start free" },
    secondaryCta: { href: "/pricing", label: "See pricing" },
    faq: [
      {
        q: "How many stories fit on the free plan?",
        a: "Free includes three stories per month for one child — enough to sample. Premium is unlimited for daily writers.",
      },
      {
        q: "Can siblings share?",
        a: "Each child profile has their own characters and library. Premium covers your household workflow.",
      },
      {
        q: "Do we need a printer?",
        a: "No. Read on screen or order professional softcovers shipped to you.",
      },
    ],
    related: [
      { href: "/features/character-bible", label: "Character bible" },
      { href: "/for-reluctant-writers", label: "Reluctant writers" },
      { href: "/how-it-works", label: "How it works" },
    ],
    endBand: {
      title: "Add it to this week's language-arts block.",
      primary: { label: "Start free", href: "/trial" },
      secondary: { label: "See what Premium adds", href: "/pricing" },
    },
  },
];

export function getAudienceLanding(slug: string): AudienceLandingConfig | undefined {
  return AUDIENCE_LANDINGS.find((l) => l.slug === slug);
}
