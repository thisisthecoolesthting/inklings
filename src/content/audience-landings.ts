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
      "Inklings is simple to gift: you buy a code, the family redeems it, and every season your grandchild can turn an approved story into a printed softcover keepsake.",
    metaTitle: "Story book gift for grandchildren ages 4-8",
    metaDescription:
      "Gift Inklings Premium to grandchildren ages 4-8. They build characters and stories all year, their parent approves each book, and printed softcovers are optional.",
    bullets: [
      {
        title: "One gift, many stories",
        body: "Premium unlocks unlimited adventures with the same characters — Milo today, the same Milo next month.",
      },
      {
        title: "Parents stay in the loop",
        body: "Nothing gets printed without a grown-up. The parent who redeems the gift approves each book from a simple portal — no tech headaches.",
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
        a: "Mostly. Sparky uses big emoji tap-buttons and an optional mic, and kids never type. Sparky's questions appear as on-screen text, so a grown-up may want to read them aloud to the youngest.",
      },
      {
        q: "Do I need to be tech-savvy?",
        a: "No. You check out with Stripe and we email you a gift code (and send it to the recipient too if you add their email). They redeem it at inklings.shop/gift/redeem in their own parent account, and the parent approves stories from one portal page.",
      },
      {
        q: "Is the printed book extra?",
        a: "Premium covers the digital studio. Printed softcovers are a one-time $19.99 add-on whenever the parent approves a story worth keeping.",
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
      microcopy: "Code sent by email · the parent approves each story.",
    },
  },
  {
    slug: "for-teachers",
    path: "/for-teachers",
    breadcrumbLabel: "For teachers",
    eyebrow: "Classroom storytelling",
    title: "Every kid leaves the lesson holding a story they wrote",
    subtitle:
      "Inklings turns a few taps into illustrated story pages kids can read back — no typing, and an approval step before anything is printed. There is no dedicated classroom mode yet, so tell us what you have in mind.",
    metaTitle: "Classroom storytelling tool for ages 4-8",
    metaDescription:
      "Kids tap choices with Sparky and get illustrated story pages. There is no dedicated classroom mode yet, so contact us about using Inklings with a class.",
    bullets: [
      {
        title: "Tap-and-talk storytelling",
        body: "Kids who find pencils hard can still tap through a story. Sparky guides bounded choices — no blank-page anxiety.",
      },
      {
        title: "A clear approval gate",
        body: "Finished stories go to the account holder's approval queue before anything can be printed, and Inklings has no public sharing.",
      },
      {
        title: "Keepsake outcome",
        body: "Each child can make a story they authored. Families can order a printed softcover of an approved story — a tangible win for open house or portfolio night.",
      },
    ],
    steps: [
      { title: "Introduce Sparky", body: "10 minutes: what is a character, what is a choice, demo one beat together with the no-account demo." },
      { title: "Story sprint", body: "About 20 minutes: pairs or individuals tap through a short adventure in the Studio, on a device signed in to an account." },
      { title: "Approve & print", body: "The account holder approves each story; softcovers are optional, for a fundraiser or celebration." },
    ],
    primaryCta: { href: "/contact?topic=classroom", label: "Request classroom info" },
    secondaryCta: { href: "/try", label: "Try Sparky with your class — no login" },
    faq: [
      {
        q: "Does every child need an account?",
        a: "Inklings has parent accounts, with a child profile for each child, and no separate child logins. To use it with a class, contact us and we will talk through what is practical today.",
      },
      {
        q: "Is content moderated?",
        a: "Sparky's story steps are tap choices, the text it writes goes through a word filter, and the account holder approves every story before it can be printed. There is no open-ended AI chat.",
      },
      {
        q: "Can we export stories?",
        a: "Approved stories can be read in the account's library, and printed softcovers are optional. There is no PDF download at the moment.",
      },
    ],
    related: [
      { href: "/features/voice-first-studio", label: "Voice-first Studio" },
      { href: "/for-reluctant-writers", label: "Reluctant writers" },
      { href: "/how-it-works", label: "How it works" },
    ],
    endBand: {
      title: "Interested in using it with your class?",
      primary: { label: "Contact us about your class", href: "/contact?topic=classroom" },
      secondary: { label: "Try the demo now", href: "/try" },
      microcopy: "Tell us about your class and we'll write back by email.",
    },
  },
  {
    slug: "for-reluctant-writers",
    path: "/for-reluctant-writers",
    breadcrumbLabel: "Reluctant writers",
    eyebrow: "No blank page",
    title: "For kids who say “I can't write”",
    subtitle:
      "Sparky asks one question at a time. Your child taps or talks. Illustrated pages appear as the story grows — confidence before handwriting pressure.",
    metaTitle: "Story-making for reluctant writers, ages 4-8",
    metaDescription:
      "Story-making without blank-page stress. Tap-and-talk choices, illustrated pages, and parent-approved books for kids 4-8 who dislike writing.",
    bullets: [
      {
        title: "Tap or talk — no typing",
        body: "Giant choice chips with emoji and an optional mic. If speech isn't picked up, tapping always works. (The one thing kids type is a character's name.)",
      },
      {
        title: "Immediate visual reward",
        body: "Each choice adds an illustrated page, so the story grows as they go. A story is seven pages long.",
      },
      {
        title: "Readable finished product",
        body: "Illustrations are requested without text in the picture, and the story words sit below each image — like a real book.",
      },
    ],
    primaryCta: { href: "/trial", label: "Start free" },
    secondaryCta: { href: "/features/voice-first-studio", label: "See the Studio" },
    faq: [
      {
        q: "Is this only for kids with ADHD or dyslexia?",
        a: "Not at all. It's for any child ages 4-8 who finds a blank page daunting. We don't make medical or educational claims.",
      },
      {
        q: "Will it feel like homework?",
        a: "Sparky is a game-like guide, not a worksheet. Kids pick adventures; you approve the book when it is done.",
      },
      {
        q: "Can therapists or tutors use it?",
        a: "Anyone can try it. Approved stories can be ordered as printed keepsake books. We don't make clinical claims and have no professional resources yet — contact us if you'd like to talk.",
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
      "Character design, plot choices, a parent review step, and an optional printed book at the end — language arts with a keepsake outcome.",
    metaTitle: "Homeschool creative writing for ages 4-8",
    metaDescription:
      "Homeschool story-making with Inklings: voice-first writing, character continuity across books, parent approval, and optional printed softcovers.",
    bullets: [
      {
        title: "Cross-session characters",
        body: "Build a character bible once — the same hero returns in every story, like a real series author.",
      },
      {
        title: "Parent as reviewer",
        body: "Read every book before it can be printed. Approve it or send it back for your child to redo, and it joins their library shelf.",
      },
      {
        title: "Portfolio-ready",
        body: "Read approved stories on screen, or order a printed copy of the best ones for your homeschool portfolio or end-of-year celebration.",
      },
    ],
    primaryCta: { href: "/trial", label: "Start free" },
    secondaryCta: { href: "/pricing", label: "See pricing" },
    faq: [
      {
        q: "How many stories fit on the free plan?",
        a: "Free includes three stories per month across your account — enough to sample. Premium is unlimited for daily writers.",
      },
      {
        q: "Can siblings share?",
        a: "Each child profile has its own characters and story worlds. The Free plan's three stories a month are counted across your whole account; Premium removes that limit.",
      },
      {
        q: "Do we need a printer?",
        a: "No. Read on screen or order printed softcovers shipped to you.",
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
