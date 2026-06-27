export type AudienceLandingConfig = {
  slug: string;
  path: string;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  bullets: { title: string; body: string }[];
  steps?: { title: string; body: string }[];
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  faq: { q: string; a: string }[];
  related: { href: string; label: string }[];
};

export const AUDIENCE_LANDINGS: AudienceLandingConfig[] = [
  {
    slug: "for-grandparents",
    path: "/for-grandparents",
    breadcrumbLabel: "For grandparents",
    eyebrow: "Gift a story universe",
    title: "Give a gift that grows all year — not just one book",
    subtitle:
      "Grandparents love Inklings because it is simple to gift, easy to track from your portal, and every season your grandchild can turn a story into a printed hardcover keepsake.",
    metaTitle: "Story book gift for grandchildren ages 5–8",
    metaDescription:
      "Gift Inklings Premium to grandchildren ages 5–8. They build characters and stories all year; you approve from your portal. Printed hardcover books ship to their door.",
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
        body: "Order an 8.5″ hardcover after you approve a story. Ships in about 7–10 days — perfect for birthdays and holidays.",
      },
    ],
    primaryCta: { href: "/gift", label: "See gift plans" },
    secondaryCta: { href: "/how-it-works", label: "How it works" },
    faq: [
      {
        q: "Can my grandchild use it without reading?",
        a: "Yes. Sparky is voice-first with big tap buttons — ages 5–8 never need to type or read menus.",
      },
      {
        q: "Do I need to be tech-savvy?",
        a: "No. You gift Premium by email; they play in the Studio on your family account. You approve stories from one portal page.",
      },
      {
        q: "Is the printed book extra?",
        a: "Premium covers the digital studio. Printed hardcovers are a one-time $19.99 add-on whenever you approve a story worth keeping.",
      },
    ],
    related: [
      { href: "/gift", label: "Gift Premium" },
      { href: "/pricing", label: "Compare plans" },
      { href: "/features/parent-approval", label: "Parent approval" },
    ],
  },
  {
    slug: "for-teachers",
    path: "/for-teachers",
    breadcrumbLabel: "For teachers",
    eyebrow: "Classroom storytelling",
    title: "Reluctant writers become authors in one lesson",
    subtitle:
      "Inklings turns oral storytelling into illustrated pages kids can read back — voice-first, no login maze, parent approval built in for take-home books.",
    metaTitle: "Classroom storytelling tool for ages 5–8",
    metaDescription:
      "Voice-first digital storytelling for elementary classrooms. Kids tap choices with Sparky, get illustrated pages, and parents approve printed keepsake books.",
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
        body: "Each child leaves with a story they authored. Families can order a hardcover — a tangible win for open house or portfolio night.",
      },
    ],
    steps: [
      { title: "Introduce Sparky", body: "10 minutes: what is a character, what is a choice, demo one beat together." },
      { title: "Story sprint", body: "20 minutes: pairs or individuals tap through a short adventure in the Studio." },
      { title: "Share & print", body: "Parents approve at home; optional class set of hardcovers for a fundraiser or celebration." },
    ],
    primaryCta: { href: "/contact", label: "Request classroom info" },
    secondaryCta: { href: "/trial", label: "Try Sparky free" },
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
        a: "Approved stories live in the family library as PDF-ready books. Printed hardcovers are optional.",
      },
    ],
    related: [
      { href: "/features/voice-first-studio", label: "Voice-first Studio" },
      { href: "/for-reluctant-writers", label: "Reluctant writers" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    slug: "for-reluctant-writers",
    path: "/for-reluctant-writers",
    breadcrumbLabel: "Reluctant writers",
    eyebrow: "No blank page",
    title: "For kids who say “I can't write” — including ADHD & dyslexia",
    subtitle:
      "Sparky asks one question at a time. Your child taps or talks. Illustrated pages appear as the story grows — confidence before handwriting pressure.",
    metaTitle: "Writing app for reluctant readers & ADHD kids 5–8",
    metaDescription:
      "Story-making without blank-page stress. Voice-first choices, instant illustrations, parent-approved books. Built for ages 5–8 who struggle with traditional writing.",
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
        a: "No — any child ages 5–8 who hates blank pages benefits. We hear especially strong results from ADHD, dyslexia, and ESL families.",
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
  },
  {
    slug: "homeschool",
    path: "/homeschool",
    breadcrumbLabel: "Homeschool",
    eyebrow: "Creative writing at home",
    title: "One curriculum block they'll actually beg to repeat",
    subtitle:
      "Character design, plot choices, revision through parent approval, and a printed book at the end — language arts with a keepsake outcome.",
    metaTitle: "Homeschool creative writing for ages 5–8",
    metaDescription:
      "Homeschool story-making with Inklings: voice-first writing, character continuity across books, parent approval, and optional printed hardcovers.",
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
        a: "No. Read on screen or order professional hardcovers shipped to you.",
      },
    ],
    related: [
      { href: "/features/character-bible", label: "Character bible" },
      { href: "/for-reluctant-writers", label: "Reluctant writers" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
];

export function getAudienceLanding(slug: string): AudienceLandingConfig | undefined {
  return AUDIENCE_LANDINGS.find((l) => l.slug === slug);
}
