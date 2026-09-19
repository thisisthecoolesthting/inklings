export interface FaqItem { q: string; a: string }

export const FAQ_CARD_ITEM: FaqItem = {
  q: "Do I need a card for the free plan?",
  a: "No. The Free plan never asks for a card. Premium starts with a 14-day trial that does need a card, and you can cancel in one click before day 14.",
};

export const FAQ_HOME: FaqItem[] = [
  {
    q: "What ages is Inklings for?",
    a: "Inklings is built for kids ages 4-8. The Studio uses giant emoji tap-buttons, with an optional mic so your child can say their pick out loud. Sparky's questions appear as on-screen text, so younger kids may want a grown-up to read them aloud.",
  },
  {
    q: "Will my child be alone with an AI?",
    a: "Not in the way you might fear. Sparky is a bounded storyteller, not an open chatbot: every step is a small set of tap-buttons we wrote, and your child cannot type questions to the AI. The only thing a child types is a character's name (up to 30 characters), which goes through a word filter. The story text itself is written by an AI model from those choices and checked against a blocked-word list, and you approve every finished story.",
  },
  {
    q: "Can my child publish or share anything without me?",
    a: "There is nothing to publish or share: Inklings has no public profiles, feed, or sharing links. A finished story waits in your approval queue, and it cannot be ordered as a printed book until you approve it. New characters are flagged in your portal too, where you can approve them or send them back.",
  },
  {
    q: "How are characters made consistent across stories?",
    a: "Each character is saved with a name, an animal, a color, and personality traits, and Sparky reuses that description in every page and illustration prompt. Each new book also picks up from the last one in the same series. AI-drawn art can still vary a little from page to page.",
  },
  {
    q: "Are the printed books real softcover books?",
    a: "Yes. We print real 8.5\" × 8.5\" full-color softcover children's books through our print partner, Lulu. Print orders are a one-time $19.99 charge, available on any plan, for stories you have approved. We estimate 7–10 days to ship.",
  },
  {
    q: "Can my child upload a photo or drawing?",
    a: "Not at the moment. Inklings does not accept photo or drawing uploads, so no photos or facial data are collected. Your child builds a character by tapping a name, an animal, a color, and one or two personality traits. If we ever add uploads, we will update our privacy policy first.",
  },
  {
    q: "How does Inklings handle COPPA?",
    a: "Inklings is built around COPPA's parent-consent model: the parent creates the account and confirms consent at sign-up (we keep a record of it), and the child profile is linked to yours. The child profile holds only a first name and age, and there are no child logins, public profiles, ads, or ways for anyone outside your family to contact your child. Story choices and characters are stored in your account, and you can export or delete them at any time.",
  },
  FAQ_CARD_ITEM,
];
