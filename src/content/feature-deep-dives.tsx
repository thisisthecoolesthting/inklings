import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Deep-dive content for the six /features/* pages. One shared template
 * (src/components/marketing/FeatureDeepDive.tsx) renders every entry, so all
 * six share the same structure, canonical, and Open Graph metadata.
 *
 * Every claim here must trace to code or to copy already published elsewhere
 * on the site (FAQ, /security, /legal/privacy, /pricing, /how-it-works,
 * /legal/terms). Do not add capabilities that are not in the product.
 */

export interface DeepDiveSection {
  heading: string;
  body: ReactNode;
}

export interface DeepDive {
  slug: string;
  metaTitle: string;
  /** 140-155 characters. */
  metaDescription: string;
  title: string;
  intro: ReactNode;
  /** Optional visual rendered between the hero and the section cards. */
  showcase?: "character-shelf";
  sections: DeepDiveSection[];
  cta: {
    title: string;
    body?: string;
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
    microcopy?: string | false;
  };
}

const link = "text-coral underline";

export const FEATURE_DEEP_DIVES: DeepDive[] = [
  {
    slug: "voice-first-studio",
    metaTitle: "Voice-first kid Studio for ages 4-8",
    metaDescription:
      "How the Inklings kid Studio works for ages 4-8: tap giant buttons or just talk to Sparky, no reading or typing needed, and never an open chat box.",
    title: "Voice-first, no reading required.",
    intro: (
      <>
        Most apps for kids 4-8 assume the kid can read. Most kids 4-8 can&apos;t — at least not at
        the speed needed to enjoy a creative tool. Inklings flips it: your child <em>talks</em> to
        Sparky, and Sparky narrates the story back. Reading is optional everywhere.
      </>
    ),
    sections: [
      {
        heading: "How it works",
        body: (
          <p>
            Sparky asks one question at a time — &ldquo;Where are we today?&rdquo; — and shows
            three or four giant tap-buttons with emoji. Your child can <strong>tap</strong> a button
            or <strong>say</strong> the answer out loud. We use the browser&apos;s built-in speech
            recognition, and our servers only ever receive the resulting text — never a recording of
            your child&apos;s voice.
          </p>
        ),
      },
      {
        heading: "Why tap-first instead of voice-first",
        body: (
          <p>
            Voice recognition on small kids is unreliable. Their pronunciation isn&apos;t
            consistent, browsers vary, ambient noise is real. We built it as <em>tap with optional
            voice</em>, not the other way around. If voice fails, the kid taps. They never see an
            error message — Sparky just keeps going.
          </p>
        ),
      },
      {
        heading: "Sparky is bounded, not a chatbot",
        body: (
          <p>
            Every choice your child sees is a chip we wrote and tested. Sparky doesn&apos;t take
            freeform input. There&apos;s no way for your child to wander into an open conversation
            with an AI — every path leads somewhere safe.{" "}
            <Link href="/security" className={link}>
              See the safety architecture
            </Link>
            .
          </p>
        ),
      },
    ],
    cta: {
      title: "Try the Studio with your child.",
      body: "A free story takes about twenty minutes.",
      primary: { label: "Create your first story free", href: "/trial" },
      secondary: { label: "Try Sparky — no account", href: "/try" },
    },
  },
  {
    slug: "character-bible",
    metaTitle: "Persistent character family across every story",
    metaDescription:
      "Characters your child invents stay the same across every story: same look, same personality, same voice. See how the Inklings Character Bible works.",
    title: "A persistent family of characters, not a one-off book.",
    intro: (
      <>
        The book is the artifact. The <em>family</em> of characters your child invents — Biscuit the
        puppy, Saffron the magical fox, every recurring friend — is the actual product. They show up
        across every story. They remember each other.
      </>
    ),
    showcase: "character-shelf",
    sections: [
      {
        heading: "The Character Bible",
        body: (
          <p>
            Each character your child creates gets a permanent record: name, species, personality
            traits, favorite activities, recurring phrases, and a saved look. When the same
            character appears in story #4, they look like the same character from story #1.
          </p>
        ),
      },
      {
        heading: "Series memory (Premium)",
        body: (
          <p>
            On the Premium tier, characters carry memory across the whole series. Sparky knows that
            Biscuit found the lost bell in the meadowlands, and weaves that thread into the next
            adventure. Your child&apos;s storybook universe accumulates depth, week by week.{" "}
            <Link href="/pricing" className={link}>
              See what Premium adds
            </Link>
            .
          </p>
        ),
      },
      {
        heading: "Why it matters",
        body: (
          <p>
            A children&apos;s book made by AI is a commodity. A children&apos;s book starring{" "}
            <em>your kid&apos;s</em> imagined puppy, drawn the same way every time, with personality
            your kid already knows by heart — that&apos;s a heirloom. The Character Bible is the
            difference.
          </p>
        ),
      },
    ],
    cta: {
      title: "Build a family. Keep a library.",
      primary: { label: "Create your first story free", href: "/trial" },
      secondary: { label: "Try Sparky — no account", href: "/try" },
    },
  },
  {
    slug: "draw-or-photo",
    metaTitle: "Draw or snap a photo to make a character",
    metaDescription:
      "Turn a crayon drawing or a stuffed animal into a story character. Faces are blurred on your device before upload, and you approve every new character.",
    title: "Start with the drawing on the fridge.",
    intro: (
      <>
        Most kids 4-8 already have a favorite character — a crayon dragon, a stuffed bunny with one
        ear. Inklings starts there, so the star of the story is something your child already loves.
      </>
    ),
    sections: [
      {
        heading: "From a drawing or a stuffed animal to a starring character",
        body: (
          <>
            <p>
              Photograph a stuffed animal or a crayon drawing, or describe a hero out loud.
              Inklings turns it into a character with a saved look, so they appear the same in every
              story — that&apos;s the{" "}
              <Link href="/features/character-bible" className={link}>
                Character Bible
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Faces are blurred on your device, first",
        body: (
          <>
            <p>
              If a photo contains a human face, face detection runs in your browser and blurs it
              before the image is uploaded — so a face never reaches our servers. We use the photo
              to pull out colors, shapes, and emotional tone for the character&apos;s illustration,
              and it stays private to your account.
            </p>
            <p className="mt-3">
              The details are in our{" "}
              <Link href="/legal/privacy" className={link}>
                privacy policy
              </Link>{" "}
              and on the{" "}
              <Link href="/security" className={link}>
                safety page
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "A messy drawing is a fine drawing",
        body: (
          <p>
            We aren&apos;t tracing your child&apos;s lines. We read the colors, the shapes, and the
            feeling of the picture and use those to illustrate the character — so a wobbly crayon
            sketch has just as much to work with as a careful one. And nothing joins your
            child&apos;s character family until you&apos;ve looked at it and said yes.
          </p>
        ),
      },
      {
        heading: "No photo handy? Build one in a few taps",
        body: (
          <p>
            In the Studio your child can also make a character from scratch: pick a name, an animal,
            a favorite color, and one or two personality traits. It lands in a private sandbox until
            you approve it from your portal —{" "}
            <Link href="/features/parent-approval" className={link}>
              here&apos;s how approval works
            </Link>
            .
          </p>
        ),
      },
    ],
    cta: {
      title: "Bring the drawing to life.",
      body: "Free to start. You approve every character before it joins the family.",
      primary: { label: "Create your first story free", href: "/trial" },
      secondary: { label: "Try Sparky — no account", href: "/try" },
    },
  },
  {
    slug: "parent-approval",
    metaTitle: "Parent approval gate for every story",
    metaDescription:
      "Nothing your child makes publishes, exports, or prints without your approval. New characters wait in a private sandbox and you review every page.",
    title: "Nothing leaves the sandbox without you.",
    intro: (
      <>
        When your child invents a new character, it lands in a private sandbox — visible only to
        them in that session. When they finish a story, it lands in your approval queue. You read
        every page. You approve, edit, or send back. Then — and only then — does anything export,
        share, or print.
      </>
    ),
    sections: [
      {
        heading: "Sandbox mode for new characters",
        body: (
          <p>
            When your child creates a character, that character is private to their session. They
            can play with it. It does NOT enter the shared character family until you approve it
            from your portal.
          </p>
        ),
      },
      {
        heading: "Page-by-page review",
        body: (
          <p>
            When a story is finished, you see every page side-by-side: text on the left,
            illustration on the right. You can approve the whole thing, edit a sentence, regenerate
            an image, or send the story back to your child for revision. Books in &ldquo;awaiting
            parent&rdquo; status never reach the printer.
          </p>
        ),
      },
      {
        heading: "Why it's the safety contract",
        body: (
          <p>
            We don&apos;t rely on AI moderation alone. Sparky is bounded, the image model is
            filtered, content moderation runs on every output — but ultimately, you are the gate. If
            anything slips past every other check, you catch it on review. That layered safety is
            the only kind worth claiming.
          </p>
        ),
      },
    ],
    cta: {
      title: "You decide what your child publishes.",
      primary: { label: "Create your first story free", href: "/trial" },
      secondary: { label: "Read our safety architecture", href: "/security" },
    },
  },
  {
    slug: "printed-keepsake",
    metaTitle: "Printed softcover keepsake books",
    metaDescription:
      "Order your child's approved story as a real 8.5 x 8.5 in matte softcover, up to 32 full-color pages. $19.99 one-time, shipped in 7-10 business days.",
    title: "A real book, on a real shelf.",
    intro: (
      <>
        The book is the point. Once you&apos;ve approved a story, you can order it as a real square
        softcover — the kind that ends up on a shelf, not in a downloads folder.
      </>
    ),
    sections: [
      {
        heading: "What you get",
        body: (
          <>
            <ul className="list-disc space-y-1 pl-6">
              <li>Softcover, 8.5&quot; &times; 8.5&quot;, with a matte cover</li>
              <li>Full-color pages, up to 32 illustrated pages</li>
              <li>Printed on demand and shipped to your door in 7&ndash;10 business days</li>
              <li>
                <strong>$19.99 per book</strong> — a one-time charge, available on any plan,
                including Free
              </li>
            </ul>
            <p className="mt-3">
              Printing is handled by our print partner, Lulu, using the same illustrations your
              child watched appear in the Studio.
            </p>
          </>
        ),
      },
      {
        heading: "Nothing prints without you",
        body: (
          <p>
            Only a story you&apos;ve approved can be ordered. Books that are still &ldquo;awaiting
            parent&rdquo; never reach the printer, and you can order right after approving from the
            same page.{" "}
            <Link href="/features/parent-approval" className={link}>
              How approval works
            </Link>
            .
          </p>
        ),
      },
      {
        heading: "Ordering, shipping, and refunds",
        body: (
          <>
            <p>
              You check out securely with Stripe — Inklings never sees your card number — and choose
              a shipping address in the US, Canada, the UK, or Australia. Your address and the
              finished book file are shared with Lulu so they can print and ship it.
            </p>
            <p className="mt-3">
              Because books are made on demand, we can&apos;t cancel an order once it has been sent
              to fulfillment. If a book arrives damaged or misprinted, we replace it or refund you.
              The full wording is in our{" "}
              <Link href="/legal/terms" className={link}>
                terms
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Screen first, print when you're ready",
        body: (
          <p>
            Every plan can read finished stories on screen. Free includes a low-resolution PDF with
            an Inklings watermark; Premium adds an HD print-ready PDF with no watermark. Choose
            print for the stories worth keeping — see{" "}
            <Link href="/pricing#book" className={link}>
              pricing
            </Link>{" "}
            for the full comparison.
          </p>
        ),
      },
    ],
    cta: {
      title: "Make a story worth keeping.",
      body: "Making the story is free. Print only the ones you love.",
      primary: { label: "Create your first story free", href: "/trial" },
      secondary: { label: "Try Sparky — no account", href: "/try" },
    },
  },
  {
    slug: "safety-first",
    metaTitle: "Safety is the first feature",
    metaDescription:
      "Inklings is built for kids: bounded Sparky choices instead of open chat, parent approval on everything, sandboxed characters, and COPPA-minded data handling.",
    title: "Safety is the first feature, not the last.",
    intro: (
      <>
        Safety isn&apos;t a setting we added at the end. It&apos;s the shape of the product: what
        Sparky can say, who decides what gets kept, and how little we collect about your family.
      </>
    ),
    sections: [
      {
        heading: "Sparky offers choices, not a text box",
        body: (
          <>
            <p>
              Every step of a story is a small set of two to four tap-buttons we wrote ourselves.
              There is no freeform text input, so there is no way for a child to wander into an open
              chat with an AI. If something unsafe does come up, Sparky redirects playfully — a
              child never sees an error message.
            </p>
            <p className="mt-3">
              Sparky&apos;s text and the illustration model both run with safety filters on.{" "}
              <Link href="/security" className={link}>
                See how it compares to a chatbot
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "You are the gate",
        body: (
          <p>
            New characters wait in a private sandbox until you approve them, and every finished
            story lands in your approval queue before anything is exported, shared, or printed.
            Filters are one layer; your review is the one that counts.{" "}
            <Link href="/features/parent-approval" className={link}>
              How the approval gate works
            </Link>
            .
          </p>
        ),
      },
      {
        heading: "A parent-owned account, with consent",
        body: (
          <p>
            There is no child login. You create the account and confirm you&apos;re your
            child&apos;s parent or legal guardian at sign-up, and the child profile is linked to
            yours. We keep the child&apos;s details to a first name and age range, and there are no
            public profiles, no feed, and no way for anyone outside your family to contact your
            child.
          </p>
        ),
      },
      {
        heading: "What happens to your data",
        body: (
          <>
            <p>
              We never sell or trade your data, and there are no ads. Voice audio is handled by your
              browser — our servers only get the text. You can export or delete everything from your
              portal settings, and deleted data is removed within 30 days.
            </p>
            <p className="mt-3">
              The full list of what we collect and which service providers help us run Inklings is
              in the{" "}
              <Link href="/legal/privacy" className={link}>
                privacy policy
              </Link>
              .
            </p>
          </>
        ),
      },
    ],
    cta: {
      title: "See it for yourself.",
      body: "The free story includes every safety feature. No credit card.",
      primary: { label: "Create your first story free", href: "/trial" },
      secondary: { label: "Read the safety architecture", href: "/security" },
    },
  },
];

export function getFeatureDeepDive(slug: string): DeepDive | undefined {
  return FEATURE_DEEP_DIVES.find((d) => d.slug === slug);
}
