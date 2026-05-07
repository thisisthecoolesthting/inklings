/**
 * Sparky's branching prompt flows. Sparky is NOT an open chatbot.
 * Every step is a fixed set of choices. The kid picks one.
 *
 * Per Inklings handoff: Claude API (Sonnet) is invoked at each beat with
 * a heavily constrained prompt that takes (a) the locked branching choices,
 * (b) the Character Bible, and (c) the story state — and returns either
 * a) a paragraph of story text, or b) a follow-up branching question.
 */

export type SparkyChoice = { id: string; label: string; emoji?: string };
export type SparkyBeat = {
  id: string;
  act: "intro" | "beginning" | "problem" | "adventure" | "resolution" | "celebration";
  sparkyLine: string;     // What Sparky says (TTS + on-screen)
  choices: SparkyChoice[]; // Tap-buttons. Always 2-4 options.
};

export const STORY_FLOW: SparkyBeat[] = [
  // Act 1: Beginning
  {
    id: "where_are_we",
    act: "beginning",
    sparkyLine: "Where does our story start today?",
    choices: [
      { id: "meadowlands", label: "The Meadowlands", emoji: "🌼" },
      { id: "stardust_woods", label: "Stardust Woods", emoji: "✨" },
      { id: "cozy_kitchen", label: "A cozy kitchen", emoji: "🥣" },
      { id: "new", label: "Somewhere new!", emoji: "🗺️" },
    ],
  },
  {
    id: "mood",
    act: "beginning",
    sparkyLine: "What kind of day is it?",
    choices: [
      { id: "sunny", label: "Sunny and silly", emoji: "🌞" },
      { id: "mysterious", label: "Mysterious morning", emoji: "🌫️" },
      { id: "exciting", label: "Big-adventure day", emoji: "🚀" },
    ],
  },
  // Act 2: Problem
  {
    id: "problem",
    act: "problem",
    sparkyLine: "Uh oh — something happens! What is it?",
    choices: [
      { id: "missing", label: "Something is missing", emoji: "🔍" },
      { id: "challenge", label: "A challenge appears", emoji: "🪨" },
      { id: "scared", label: "Someone gets scared", emoji: "😨" },
      { id: "disagreement", label: "Friends disagree", emoji: "💬" },
    ],
  },
  // Act 3: Adventure
  {
    id: "adventure_where",
    act: "adventure",
    sparkyLine: "Where do they go to figure it out?",
    choices: [
      { id: "forest", label: "Deep into the forest", emoji: "🌲" },
      { id: "river", label: "Along the river", emoji: "🏞️" },
      { id: "secret", label: "A secret hideout", emoji: "🔒" },
    ],
  },
  {
    id: "obstacle",
    act: "adventure",
    sparkyLine: "What gets in the way?",
    choices: [
      { id: "puzzle", label: "A tricky puzzle", emoji: "🧩" },
      { id: "weather", label: "Big weather", emoji: "🌧️" },
      { id: "unexpected", label: "Someone unexpected", emoji: "👀" },
    ],
  },
  // Act 4: Resolution
  {
    id: "solve",
    act: "resolution",
    sparkyLine: "How do they solve it?",
    choices: [
      { id: "teamwork", label: "Teamwork", emoji: "🤝" },
      { id: "courage", label: "Courage", emoji: "🦁" },
      { id: "kindness", label: "Kindness", emoji: "💗" },
      { id: "clever", label: "A clever idea", emoji: "💡" },
    ],
  },
  // Act 5: Celebration
  {
    id: "celebrate",
    act: "celebration",
    sparkyLine: "How do they celebrate?",
    choices: [
      { id: "feast", label: "A big feast", emoji: "🥧" },
      { id: "song", label: "A song together", emoji: "🎵" },
      { id: "rest", label: "A cozy rest", emoji: "🛋️" },
      { id: "stargaze", label: "Stargazing", emoji: "⭐" },
    ],
  },
];

/** Sparky safety redirects — never an error message to the child. */
export const SAFE_REDIRECTS = {
  unsafe_input: "Hmm, let's try a different idea! What if we ",
  off_topic: "Ooh, that's interesting — but Sparky stays in the storybook. Let's pick:",
  too_long: "Whoa, big thought! Let's keep it short and sweet — try one of these:",
};
