/**
 * Tight series generator helpers.
 *
 * A series is the same friends, in the same home world, book after book.
 * Titles, recaps, and character looks are derived here so Sparky and the
 * print lane stay consistent without an extra model call.
 */

export type SeriesChoice = {
  beatId: string;
  choiceId: string;
  label: string;
};

export type CharacterLook = {
  name: string;
  species?: string | null;
  role?: string | null;
  colors?: string[] | null;
  outfit?: string | null;
  personalityTraits?: string[] | null;
  imageSeed?: string | null;
  previewUrl?: string | null;
};

export type StarterFriend = {
  name: string;
  species: string;
  role: string;
  colors: string[];
  outfit: string;
  personalityTraits: string[];
};

/** Default friends when a kid taps Quick start. Full look so art stays consistent. */
export const STARTER_FRIENDS: StarterFriend[] = [
  {
    name: "Milo",
    species: "fox",
    role: "hero",
    colors: ["rust orange", "cream chest"],
    outfit: "a little green scarf",
    personalityTraits: ["curious", "kind", "brave"],
  },
  {
    name: "Pip",
    species: "puppy",
    role: "best friend",
    colors: ["golden fur", "white paws"],
    outfit: "a red collar with a tiny bell",
    personalityTraits: ["silly", "loyal", "bouncy"],
  },
];

const KID_SPECIES = [
  { id: "fox", label: "Fox", emoji: "🦊" },
  { id: "puppy", label: "Puppy", emoji: "🐶" },
  { id: "cat", label: "Cat", emoji: "🐱" },
  { id: "bunny", label: "Bunny", emoji: "🐰" },
  { id: "dragon", label: "Dragon", emoji: "🐉" },
  { id: "bear", label: "Bear", emoji: "🐻" },
  { id: "owl", label: "Owl", emoji: "🦉" },
  { id: "unicorn", label: "Unicorn", emoji: "🦄" },
] as const;

const KID_COLORS = [
  { id: "orange", label: "Orange", hex: "#F4815C", prompt: "warm orange" },
  { id: "gold", label: "Gold", hex: "#D4A574", prompt: "golden" },
  { id: "mint", label: "Mint", hex: "#7BC98A", prompt: "soft mint green" },
  { id: "sky", label: "Sky", hex: "#7EB6D9", prompt: "sky blue" },
  { id: "plum", label: "Plum", hex: "#6B3FA0", prompt: "plum purple" },
  { id: "cream", label: "Cream", hex: "#FFF6E5", prompt: "cream and white" },
  { id: "coral", label: "Coral", hex: "#E05F35", prompt: "coral red" },
  { id: "ink", label: "Night", hex: "#4A2545", prompt: "deep plum" },
] as const;

const KID_TRAITS = [
  { id: "silly", label: "Silly", emoji: "😄" },
  { id: "brave", label: "Brave", emoji: "🦁" },
  { id: "kind", label: "Kind", emoji: "💛" },
  { id: "curious", label: "Curious", emoji: "🔍" },
  { id: "speedy", label: "Speedy", emoji: "⚡" },
  { id: "gentle", label: "Gentle", emoji: "🌸" },
] as const;

export const KID_CHARACTER_PICKS = {
  species: KID_SPECIES,
  colors: KID_COLORS,
  traits: KID_TRAITS,
};

export function colorPrompt(id: string): string {
  return KID_COLORS.find((c) => c.id === id)?.prompt ?? id;
}

export function speciesLabel(id: string): string {
  return KID_SPECIES.find((s) => s.id === id)?.label.toLowerCase() ?? id;
}

/** One-line visual bible for prompts and recaps. */
export function characterLookLine(c: CharacterLook): string {
  const bits = [
    c.name,
    c.species ? `a ${c.species}` : null,
    c.colors && c.colors.length ? c.colors.slice(0, 2).join(" and ") : null,
    c.outfit ? `wearing ${c.outfit}` : null,
    c.personalityTraits && c.personalityTraits.length
      ? c.personalityTraits.slice(0, 2).join(" and ")
      : null,
  ].filter(Boolean);
  return bits.join(", ");
}

export function rosterLines(characters: CharacterLook[]): string {
  if (characters.length === 0) return "- a kind story friend";
  return characters.map((c) => `- ${characterLookLine(c)}`).join("\n");
}

function stripArticles(label: string): string {
  return label.replace(/^(a |an |the )/i, "").trim();
}

function titleCase(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/**
 * Picture-book title from the kid's choices — no extra LLM call.
 * Book 1: "Milo and the Meadowlands"
 * Later: "Milo and the Missing Key"
 */
export function titleFromChoices(opts: {
  hero: string;
  friend?: string | null;
  choices: SeriesChoice[];
  bookNumber?: number;
}): string {
  const hero = opts.hero.trim() || "Friends";
  const setting = opts.choices.find((c) => c.beatId === "where_are_we")?.label;
  const problem = opts.choices.find((c) => c.beatId === "problem")?.label;
  const celebrate = opts.choices.find((c) => c.beatId === "celebrate")?.label;

  const settingNoun = setting ? titleCase(stripArticles(setting)) : null;
  const problemNoun = problem ? titleCase(stripArticles(problem)) : null;

  if (opts.bookNumber && opts.bookNumber > 1 && problemNoun) {
    return `${hero} and the ${problemNoun}`.slice(0, 80);
  }
  if (settingNoun && settingNoun.toLowerCase() !== "somewhere new!") {
    return `${hero} and the ${settingNoun}`.slice(0, 80);
  }
  if (problemNoun) return `${hero} and the ${problemNoun}`.slice(0, 80);
  if (opts.friend) return `${hero} and ${opts.friend}`.slice(0, 80);
  if (celebrate) return `${hero} and ${titleCase(stripArticles(celebrate))}`.slice(0, 80);
  return `${hero}'s Adventure`.slice(0, 80);
}

export function seriesTitleFromCast(hero: string, friend?: string | null, world?: string | null): string {
  if (friend && world) return `${hero} and ${friend}`.slice(0, 80);
  if (friend) return `${hero} and ${friend}`.slice(0, 80);
  if (world) return `${hero}'s ${stripArticles(world)}`.slice(0, 80);
  return `${hero}'s Stories`.slice(0, 80);
}

export function isGenericSeriesTitle(title: string, childName: string): boolean {
  const t = title.trim().toLowerCase();
  return t === `${childName.toLowerCase()}'s stories` || t === `${childName.toLowerCase()}'s story`;
}

export function isGenericWorldName(name: string, childName: string): boolean {
  return name.trim().toLowerCase() === `${childName.toLowerCase()}'s world`;
}

/** Short recap Sparky can continue from — last book's last page + title. */
export function recapFromLastBook(opts: {
  title?: string | null;
  lastParagraph?: string | null;
  bookNumber: number;
}): string | null {
  if (opts.bookNumber <= 1) return null;
  const title = opts.title?.trim();
  const last = opts.lastParagraph?.trim();
  if (title && last) return `Last time, in "${title}", ${last}`;
  if (title) return `This is book ${opts.bookNumber} after "${title}".`;
  if (last) return `Last time: ${last}`;
  return `This is book ${opts.bookNumber} in the same series. Same friends come back.`;
}

export function nextCastSlot(occupied: number[]): number | null {
  for (const slot of [1, 2, 3]) {
    if (!occupied.includes(slot)) return slot;
  }
  return null;
}

export function colorsFromJson(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === "string").slice(0, 3);
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    return [o.primary, o.accent, o.secondary].filter((x): x is string => typeof x === "string").slice(0, 3);
  }
  return [];
}

type StubBeat = { id: string; choices: Array<{ id: string; label: string }> };

/** Deterministic picture-book page when the live model is unavailable. */
export function stubStoryPage(
  ctx: {
    childName: string;
    characters: CharacterLook[];
    worldName?: string | null;
  },
  beat: StubBeat,
  choiceId: string,
): string {
  const last = beat.choices.find((c) => c.id === choiceId);
  const pick = last?.label ?? "something special";
  const h = ctx.characters[0]?.name ?? ctx.childName;
  const f = ctx.characters[1]?.name;
  const pair = f ? `${h} and ${f}` : h;
  const world = ctx.worldName ? ` in ${ctx.worldName}` : "";
  const look = ctx.characters[0] ? characterLookLine(ctx.characters[0]) : h;

  const stub: Record<string, string> = {
    where_are_we: `${h} stretched and looked around${world}. They were in ${pick}, and the air smelled like a brand-new story. ${f ? `${f} bounced beside ${h}, ready to go.` : `${h} smiled. Today felt like an adventure.`}`,
    mood: `The day felt ${pick.toLowerCase()}. ${pair} took a big breath and stepped forward together.`,
    problem: `Then they noticed a problem: ${pick.toLowerCase()}. ${h} looked at ${f ?? "a friend"} and whispered, "We can fix this."`,
    adventure_where: `${pair} headed ${pick.toLowerCase()}. ${h} kept the path in sight so nobody got lost.`,
    obstacle: `Suddenly — ${pick.toLowerCase()}! ${h} stood still for one heartbeat, then ${f ? `${f} squeezed close` : "kept going"}, brave and careful.`,
    solve: `${h} tried ${pick.toLowerCase()}. It worked — the worry melted, and ${pair} laughed with relief.`,
    celebrate: `That night they had ${pick.toLowerCase()}. ${look.split(",")[0]} fell asleep smiling, already dreaming of the next book.`,
  };
  return stub[beat.id] ?? `${pair} kept going. ${pick} was just what the story needed.`;
}
