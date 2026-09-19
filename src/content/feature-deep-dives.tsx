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
    microcopy?: string;
  };
}

const link = "text-coral underline";

export const FEATURE_DEEP_DIVES: DeepDive[] = [
  {
    slug: "voice-first-studio",
    metaTitle: "Voice-first kid Studio for ages 4-8",
    metaDescription:
      "How the Inklings kid Studio works for ages 4-8: tap giant emoji buttons or say your pick out loud to Sparky. No typing, and never an open chat box.",
    title: "Tap it or say it. No typing.",
    intro: (
      <>
        Most apps for kids 4-8 assume the kid can type. Most kids 4-8 can&apos;t — at least not at
        the speed needed to enjoy a creative tool. Inklings flips it: your child <em>taps</em> a
        big picture button or <em>says</em> their pick out loud, and Sparky turns it into the next
        page of the story. There is nothing to type.
      </>
    ),
    sections: [
      {
        heading: "How it works",
        body: (
          <p>
            Sparky asks one question at a time — &ldquo;Where are we today?&rdquo; — and shows
            three or four giant tap-buttons with emoji. The question appears as on-screen text, so
            younger children may like a grown-up to read it aloud. Your child can <strong>tap</strong> a button
            or <strong>say</strong> the answer out loud. We use the browser&apos;s built-in speech
            recognition, and our servers only ever receive the resulting text — never a recording of
            your child&apos;s voice. (Depending on the browser, its speech service may process the
            audio itself; see our{" "}
            <Link href="/legal/privacy" className={link}>
              privacy policy
            </Link>
            .)
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
            Every choice your child sees is a chip we wrote. Sparky doesn&apos;t take
            freeform questions. The only thing your child types anywhere in the Studio is a
            character&apos;s name (up to 30 characters), so there&apos;s no way to wander into an
            open conversation with an AI.{" "}
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
      "Characters your child invents are saved and return in every story: same name, animal, colors, and personality. See how the Inklings Character Bible works.",
    title: "A persistent family of characters, not a one-off book.",
    intro: (
      <>
        The book is the artifact. The <em>family</em> of characters your child invents — Biscuit the
        puppy, Saffron the magical fox, every recurring friend — is the actual product. They show up
        across every story, book after book.
      </>
    ),
    showcase: "character-shelf",
    sections: [
      {
        heading: "The Character Bible",
        body: (
          <p>
            Each character your child creates is saved with a name, an animal, a color, and one or
            two personality traits. Sparky reuses that description in every page and illustration
            prompt, so the same character comes back in story #4 the way they were in story #1.
            (AI-drawn art can still vary a little from page to page.)
          </p>
        ),
      },
      {
        heading: "Series memory",
        body: (
          <p>
            Each book in a series starts from a short recap of the last one — its title and final
            page — so Sparky can pick the thread back up with the same characters. Every plan gets
            this within a story world; Premium adds more worlds, each with its own cast.{" "}
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
            <em>your kid&apos;s</em> imagined puppy, back in book after book with the personality
            your kid already knows by heart — that&apos;s a keepsake. The Character Bible is the
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
    slug: "character-maker",
    metaTitle: "Build a story character in a few taps",
    metaDescription:
      "Your child builds a story character by tapping a name, an animal, a favorite color, and personality traits. No typing, no uploads, and you approve each one.",
    title: "Build a character in a few taps.",
    intro: (
      <>
        Most kids 4-8 already have a favorite kind of character — a fox in a scarf, a dragon who
        loves snacks. In the Studio they build one in under a minute by tapping big picture
        buttons, and that character can star in every story after.
      </>
    ),
    sections: [
      {
        heading: "Four things to pick",
        body: (
          <>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>A name</strong> — the only thing your child types, up to 30 characters
              </li>
              <li>
                <strong>An animal</strong> — fox, puppy, cat, bunny, dragon, bear, owl, or unicorn
              </li>
              <li>
                <strong>A favorite color</strong> — one of eight big color swatches
              </li>
              <li>
                <strong>One or two personality traits</strong> — silly, brave, kind, curious,
                speedy, or gentle
              </li>
            </ul>
            <p className="mt-3">
              Prefer to skip it? &ldquo;Quick start&rdquo; gives your child two ready-made friends,
              Milo the fox and Pip the puppy.
            </p>
          </>
        ),
      },
      {
        heading: "Saved for every story",
        body: (
          <p>
            The name, animal, color, and traits are saved to your child&apos;s profile, and Sparky
            uses them in every page and illustration prompt — that&apos;s the{" "}
            <Link href="/features/character-bible" className={link}>
              Character Bible
            </Link>
            . A story needs two characters in the cast, and each story world holds up to three.
          </p>
        ),
      },
      {
        heading: "No photos, no drawings, no uploads",
        body: (
          <>
            <p>
              Inklings does not currently accept photos or drawings, so there is no image of your
              child, your home, or anyone&apos;s face to collect. Characters are built only from the
              picks above. If we ever add uploads, we will update our{" "}
              <Link href="/legal/privacy" className={link}>
                privacy policy
              </Link>{" "}
              first.
            </p>
            <p className="mt-3">
              The name your child types goes through the same word filter as everything else in the
              Studio. More on that on the{" "}
              <Link href="/security" className={link}>
                safety page
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "You see every new character",
        body: (
          <p>
            New characters are flagged in your parent portal as soon as your child makes them. You
            can approve one or send it back, and only approved characters can be moved into a
            story world&apos;s cast from your portal.{" "}
            <Link href="/features/parent-approval" className={link}>
              Here&apos;s how approval works
            </Link>
            .
          </p>
        ),
      },
    ],
    cta: {
      title: "Make a story friend.",
      body: "Free to start. You review every new character in your portal.",
      primary: { label: "Create your first story free", href: "/trial" },
      secondary: { label: "Try Sparky — no account", href: "/try" },
    },
  },
  {
    slug: "parent-approval",
    metaTitle: "Parent approval gate for every story",
    metaDescription:
      "Nothing your child makes can be printed without your approval. New characters are flagged for your review, and you look at every page before approving a story.",
    title: "Nothing gets printed without you.",
    intro: (
      <>
        When your child invents a new character, it&apos;s flagged in your parent portal. When they
        finish a story, it lands in your approval queue and you can read every page. You approve or
        send it back. Only an approved story can be ordered as a printed book.
      </>
    ),
    sections: [
      {
        heading: "New characters are flagged for review",
        body: (
          <p>
            When your child creates a character, it appears in your portal marked as waiting for
            you. You can approve it or send it back (which removes it). Only approved characters can
            be moved into a story world&apos;s cast from your portal.
          </p>
        ),
      },
      {
        heading: "Page-by-page review",
        body: (
          <p>
            When a story is finished, you see every page — illustration with the story text
            beneath it. You can approve the whole story, approve it and go straight to print
            checkout, or send it back to your child to redo. Books that are still &ldquo;awaiting
            parent&rdquo; can&apos;t be ordered from the printer.
          </p>
        ),
      },
      {
        heading: "Why it's the safety contract",
        body: (
          <p>
            We don&apos;t rely on automated checks alone. Sparky is bounded, the text it writes is
            checked against a blocked-word list, and illustrations are made to a picture-book
            prompt — but ultimately, you are the gate. If anything slips past those checks, you can
            catch it on review before a book is printed.
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
      "Order your child's approved story as a real 8.5 x 8.5 in full-color softcover. $19.99 one-time, on any plan, printed and shipped by our partner Lulu.",
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
              <li>Softcover, 8.5&quot; &times; 8.5&quot;, full color throughout</li>
              <li>A short picture book: one illustrated page for each step of the story</li>
              <li>Printed on demand and shipped to your door — we estimate 7&ndash;10 business days</li>
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
            Every plan can read approved stories on screen in your family library. Choose print
            for the stories worth keeping — see{" "}
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
      "Inklings is built for kids: tap-choice Sparky steps instead of open chat, no photo uploads, a word filter on the text Sparky writes, and parent approval.",
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
              Every step of a story is a small set of tap-buttons we wrote ourselves. A child
              can&apos;t type questions to the AI — the only thing they type is a character&apos;s
              name, up to 30 characters — so there is no way to wander into an open chat. If a
              blocked word turns up, it&apos;s swapped for something gentle instead of showing an
              error message.
            </p>
            <p className="mt-3">
              Every page Sparky writes is checked against a blocked-word list before your child sees
              it; if it fails, a safe fallback page is used instead. We don&apos;t accept photo or
              drawing uploads.{" "}
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
            New characters are flagged for your review, and every finished story lands in your
            approval queue before it can be printed. Filters are one layer; your review is the one
            that counts.{" "}
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
            yours. We keep the child&apos;s details to a first name and age, and there are no
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
              browser&apos;s speech recognition — our servers only get the text. You can export or
              delete your account data from your portal settings.
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
