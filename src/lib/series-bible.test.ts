import { describe, expect, it } from "vitest";
import {
  characterLookLine,
  colorsFromJson,
  isGenericSeriesTitle,
  isGenericWorldName,
  nextCastSlot,
  recapFromLastBook,
  seriesTitleFromCast,
  stubStoryPage,
  titleFromChoices,
  type CharacterLook,
} from "./series-bible";

const characters: CharacterLook[] = [
  {
    name: "Milo",
    species: "fox",
    colors: ["rust orange"],
    outfit: "a little green scarf",
    personalityTraits: ["curious", "kind"],
  },
  {
    name: "Pip",
    species: "puppy",
    colors: ["golden fur"],
    outfit: "a red collar",
    personalityTraits: ["silly"],
  },
];

describe("titleFromChoices", () => {
  it("names book 1 after the setting", () => {
    expect(
      titleFromChoices({
        hero: "Milo",
        friend: "Pip",
        bookNumber: 1,
        choices: [{ beatId: "where_are_we", choiceId: "meadowlands", label: "The Meadowlands" }],
      }),
    ).toBe("Milo and the Meadowlands");
  });

  it("names later books after the problem", () => {
    expect(
      titleFromChoices({
        hero: "Milo",
        bookNumber: 3,
        choices: [
          { beatId: "where_are_we", choiceId: "meadowlands", label: "The Meadowlands" },
          { beatId: "problem", choiceId: "missing", label: "Something is missing" },
        ],
      }),
    ).toBe("Milo and the Something Is Missing");
  });
});

describe("series helpers", () => {
  it("detects generic titles and worlds", () => {
    expect(isGenericSeriesTitle("Maya's Stories", "Maya")).toBe(true);
    expect(isGenericWorldName("Maya's World", "Maya")).toBe(true);
    expect(seriesTitleFromCast("Milo", "Pip", "The Meadowlands")).toBe("Milo and Pip");
  });

  it("finds the next empty cast slot", () => {
    expect(nextCastSlot([])).toBe(1);
    expect(nextCastSlot([1])).toBe(2);
    expect(nextCastSlot([1, 2, 3])).toBeNull();
  });

  it("builds a recap for book 2+", () => {
    const recap = recapFromLastBook({
      title: "Milo and the Meadowlands",
      lastParagraph: "They fell asleep smiling.",
      bookNumber: 2,
    });
    expect(recap).toContain("Last time");
    expect(recap).toContain("Milo and the Meadowlands");
    expect(recapFromLastBook({ bookNumber: 1 })).toBeNull();
  });

  it("formats character looks and colors json", () => {
    expect(characterLookLine(characters[0])).toContain("Milo");
    expect(characterLookLine(characters[0])).toContain("green scarf");
    expect(colorsFromJson(["rust orange", "cream"])).toEqual(["rust orange", "cream"]);
    expect(colorsFromJson({ primary: "gold", accent: "red" })).toEqual(["gold", "red"]);
  });
});

describe("stubStoryPage", () => {
  it("writes a multi-sentence page that names the hero", () => {
    const text = stubStoryPage(
      { childName: "Maya", characters, worldName: "The Meadowlands" },
      {
        id: "where_are_we",
        choices: [{ id: "meadowlands", label: "The Meadowlands" }],
      },
      "meadowlands",
    );
    expect(text).toContain("Milo");
    expect(text.split(/[.!?]/).filter(Boolean).length).toBeGreaterThanOrEqual(2);
  });

  it("continues with the friend on the problem beat", () => {
    const text = stubStoryPage(
      { childName: "Maya", characters, worldName: "The Meadowlands" },
      {
        id: "problem",
        choices: [{ id: "missing", label: "Something is missing" }],
      },
      "missing",
    );
    expect(text.toLowerCase()).toContain("missing");
    expect(text).toMatch(/Milo|Pip/);
  });
});
