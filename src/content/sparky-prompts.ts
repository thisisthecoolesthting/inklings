/**
 * Sparky's branching prompt flows. Sparky is NOT an open chatbot.
 * Every step is a fixed set of choices. The kid picks one.
 * 
 * This version uses ROTATING choice pools to ensure variety across stories.
 */

export type SparkyChoice = { id: string; label: string; emoji?: string };

export type SparkyBeat = {
  id: string;
  act: "beginning" | "problem" | "adventure" | "resolution" | "celebration";
  sparkyLine: string;     // What Sparky says (TTS + on-screen)
  choices: SparkyChoice[]; // Tap-buttons. Always 2-4 options.
};

type BeatDefinition = {
  id: string;
  act: SparkyBeat["act"];
  variants: {
    sparkyLine: string;
    choices: SparkyChoice[];
  }[];
};

export const BEAT_DEFINITIONS: BeatDefinition[] = [
  {
    id: "where_are_we",
    act: "beginning",
    variants: [
      {
        sparkyLine: "Where does our story start today?",
        choices: [
          { id: "meadowlands", label: "The Meadowlands", emoji: "🌼" },
          { id: "stardust_woods", label: "Stardust Woods", emoji: "✨" },
          { id: "cozy_kitchen", label: "A cozy kitchen", emoji: "🥣" },
          { id: "new", label: "Somewhere new!", emoji: "🗺️" },
        ],
      },
      {
        sparkyLine: "Oh boy! Where are we going to explore first?",
        choices: [
          { id: "under_sea", label: "Under the sea", emoji: "🌊" },
          { id: "cloud_castle", label: "A castle in the clouds", emoji: "☁️" },
          { id: "giant_pumpkin", label: "Inside a giant pumpkin", emoji: "🎃" },
          { id: "magic_library", label: "A library of magic books", emoji: "📚" },
        ],
      },
      {
        sparkyLine: "I'm so excited! Where is our adventure beginning?",
        choices: [
          { id: "dino_jungle", label: "A dinosaur jungle", emoji: "🦖" },
          { id: "robot_city", label: "A shiny robot city", emoji: "🤖" },
          { id: "cheese_moon", label: "The moon made of cheese", emoji: "🌕" },
          { id: "flowerpot_village", label: "A tiny flowerpot village", emoji: "🪴" },
        ],
      },
      {
        sparkyLine: "Look! Where should we start our adventure?",
        choices: [
          { id: "floating_islands", label: "Floating islands", emoji: "🏝️" },
          { id: "crystal_mountain", label: "Crystal mountain", emoji: "🏔️" },
          { id: "bubble_kingdom", label: "Bubble kingdom", emoji: "🫧" },
          { id: "pirate_ship", label: "A pirate ship", emoji: "🏴‍☠️" },
        ],
      },
      {
        sparkyLine: "I wonder where we'll find ourselves today?",
        choices: [
          { id: "giant_garden", label: "A giant's garden", emoji: "🌻" },
          { id: "inside_clock", label: "Inside a big clock", emoji: "⚙️" },
          { id: "toy_shop", label: "A magical toy shop", emoji: "🧸" },
          { id: "candy_land", label: "A land of candy", emoji: "🍭" },
        ],
      },
      {
        sparkyLine: "Pick a spot for our story to begin!",
        choices: [
          { id: "treehouse", label: "A secret treehouse", emoji: "🏠" },
          { id: "ice_palace", label: "A sparkly ice palace", emoji: "🏰" },
          { id: "jungle_temple", label: "A hidden jungle temple", emoji: "🗿" },
          { id: "space_station", label: "A busy space station", emoji: "🚀" },
        ],
      },
      {
        sparkyLine: "Where does the magic start?",
        choices: [
          { id: "secret_garden", label: "A secret garden", emoji: "🌿" },
          { id: "dragon_cave", label: "A dragon's cave", emoji: "🐉" },
          { id: "fairy_ring", label: "A fairy ring", emoji: "🧚" },
          { id: "lighthouse", label: "An old lighthouse", emoji: "🚨" },
        ],
      },
      {
        sparkyLine: "Let's go somewhere amazing! Where to?",
        choices: [
          { id: "marshmallow_mtn", label: "Marshmallow mountain", emoji: "☁️" },
          { id: "clockwork_factory", label: "Clockwork factory", emoji: "🔧" },
          { id: "underwater_cave", label: "Underwater cave", emoji: "🐚" },
          { id: "flying_carpet", label: "On a flying carpet", emoji: "🧶" },
        ],
      },
      {
        sparkyLine: "Our story needs a home! Where is it?",
        choices: [
          { id: "backyard", label: "A beetle's backyard", emoji: "🐞" },
          { id: "snowy_peak", label: "A snowy mountain peak", emoji: "🏔️" },
          { id: "desert_oasis", label: "A desert oasis", emoji: "🌴" },
          { id: "magic_school", label: "A school for magic", emoji: "🧙" },
        ],
      },
      {
        sparkyLine: "Where are we waking up today?",
        choices: [
          { id: "sunflower_field", label: "A sunflower field", emoji: "🌻" },
          { id: "moon_base", label: "A base on the moon", emoji: "🌑" },
          { id: "coral_reef", label: "A colorful coral reef", emoji: "🪸" },
          { id: "tree_tunnel", label: "A tree root tunnel", emoji: "🪵" },
        ],
      },
    ],
  },
  {
    id: "mood",
    act: "beginning",
    variants: [
      {
        sparkyLine: "What kind of day is it?",
        choices: [
          { id: "sunny", label: "Sunny and silly", emoji: "🌞" },
          { id: "mysterious", label: "Mysterious morning", emoji: "🌫️" },
          { id: "exciting", label: "Big-adventure day", emoji: "🚀" },
        ],
      },
      {
        sparkyLine: "How does the air feel today?",
        choices: [
          { id: "rainy", label: "Rainy and cozy", emoji: "🌧️" },
          { id: "windy", label: "Windy and wild", emoji: "🌬️" },
          { id: "quiet", label: "Quiet and sleepy", emoji: "🌙" },
        ],
      },
      {
        sparkyLine: "What's the feeling in the air?",
        choices: [
          { id: "sparkly", label: "Bright and sparkly", emoji: "✨" },
          { id: "snowy", label: "Snowy and soft", emoji: "❄️" },
          { id: "buzzy", label: "Busy and buzzy", emoji: "🐝" },
        ],
      },
      {
        sparkyLine: "What's the weather like in our hearts?",
        choices: [
          { id: "hoppy", label: "Happy and hoppy", emoji: "🐰" },
          { id: "calm", label: "Calm and cool", emoji: "🧊" },
          { id: "bold", label: "Brave and bold", emoji: "🦁" },
        ],
      },
      {
        sparkyLine: "How does the world look today?",
        choices: [
          { id: "rainbow", label: "Rainbow-colored", emoji: "🌈" },
          { id: "golden", label: "Golden and glowing", emoji: "✨" },
          { id: "dreamy", label: "Purple and dreamy", emoji: "🔮" },
        ],
      },
      {
        sparkyLine: "What kind of magic is in the air?",
        choices: [
          { id: "giggling", label: "Giggling magic", emoji: "🤭" },
          { id: "shimmering", label: "Shimmering magic", emoji: "🪄" },
          { id: "whispering", label: "Whispering magic", emoji: "🤫" },
        ],
      },
      {
        sparkyLine: "How are we feeling right now?",
        choices: [
          { id: "energetic", label: "Full of energy", emoji: "⚡" },
          { id: "sleepy", label: "Ready for a nap", emoji: "🥱" },
          { id: "curious", label: "Super curious", emoji: "🧐" },
        ],
      },
      {
        sparkyLine: "What's the best part of the day?",
        choices: [
          { id: "morning", label: "Morning sunshine", emoji: "🌅" },
          { id: "afternoon", label: "Afternoon play", emoji: "🪁" },
          { id: "evening", label: "Evening stars", emoji: "🌌" },
        ],
      },
      {
        sparkyLine: "How does the ground feel under our feet?",
        choices: [
          { id: "mossy", label: "Soft as moss", emoji: "🌱" },
          { id: "bouncy", label: "Bouncy as a trampoline", emoji: "🤸" },
          { id: "sandy", label: "Warm as sand", emoji: "🏖️" },
        ],
      },
      {
        sparkyLine: "What's the song of the day?",
        choices: [
          { id: "happy_tune", label: "A happy tune", emoji: "🎵" },
          { id: "lullaby", label: "A quiet lullaby", emoji: "🎶" },
          { id: "fast_beat", label: "A fast beat", emoji: "🥁" },
        ],
      },
    ],
  },
  {
    id: "problem",
    act: "problem",
    variants: [
      {
        sparkyLine: "Uh oh — something happens! What is it?",
        choices: [
          { id: "missing", label: "Something is missing", emoji: "🔍" },
          { id: "challenge", label: "A challenge appears", emoji: "🪨" },
          { id: "scared", label: "Someone gets scared", emoji: "😨" },
          { id: "disagreement", label: "Friends disagree", emoji: "💬" },
        ],
      },
      {
        sparkyLine: "Wait a minute... what's going on over there?",
        choices: [
          { id: "stuck_key", label: "A magic key is stuck", emoji: "🔑" },
          { id: "broken_bridge", label: "A bridge is broken", emoji: "🌉" },
          { id: "upside_down_map", label: "A map is upside down", emoji: "🗺️" },
          { id: "forgotten_secret", label: "A secret is forgotten", emoji: "🤫" },
        ],
      },
      {
        sparkyLine: "Oh my! We have a little bit of a problem!",
        choices: [
          { id: "snoring_giant", label: "A giant is snoring loudly", emoji: "💤" },
          { id: "lost_song", label: "A bird lost its song", emoji: "🎵" },
          { id: "fading_colors", label: "The colors are fading away", emoji: "🎨" },
          { id: "stopped_clock", label: "The big clock stopped ticking", emoji: "⏰" },
        ],
      },
      {
        sparkyLine: "Oh no! A little trouble is brewing!",
        choices: [
          { id: "walking_shoes", label: "Shoes are walking away", emoji: "👟" },
          { id: "up_rain", label: "Rain is falling up", emoji: "☔" },
          { id: "dancing_shadows", label: "Shadows are dancing", emoji: "👤" },
          { id: "locked_door", label: "The door is locked tight", emoji: "🔒" },
        ],
      },
      {
        sparkyLine: "Wait, something isn't quite right...",
        choices: [
          { id: "sleepy_sun", label: "The sun won't wake up", emoji: "😴" },
          { id: "hiccup_dragon", label: "A dragon has the hiccups", emoji: "🔥" },
          { id: "jelly_path", label: "The path turned into jelly", emoji: "🍮" },
          { id: "fallen_star", label: "A star fell down", emoji: "⭐" },
        ],
      },
      {
        sparkyLine: "Look at that! We have a puzzle to solve!",
        choices: [
          { id: "stuck_kitten", label: "A kitten is stuck", emoji: "🐱" },
          { id: "no_wind", label: "The wind stopped blowing", emoji: "🍃" },
          { id: "tickle_tree", label: "A tree is tickling everyone", emoji: "🌳" },
          { id: "lost_crown", label: "A crown is lost", emoji: "👑" },
        ],
      },
      {
        sparkyLine: "Sparky sees a problem! Do you see it?",
        choices: [
          { id: "cold_soup", label: "The soup is too cold", emoji: "🥣" },
          { id: "broken_toy", label: "A toy is broken", emoji: "🧸" },
          { id: "thirsty_garden", label: "The garden is thirsty", emoji: "🚿" },
          { id: "missing_letter", label: "A letter is missing", emoji: "✉️" },
        ],
      },
      {
        sparkyLine: "Oh my whiskers! What happened?",
        choices: [
          { id: "ice_bridge", label: "The bridge turned to ice", emoji: "🧊" },
          { id: "lonely_ghost", label: "A ghost is lonely", emoji: "👻" },
          { id: "no_music", label: "The music stopped playing", emoji: "🔇" },
          { id: "flying_hat", label: "A hat is flying away", emoji: "🎩" },
        ],
      },
      {
        sparkyLine: "Something unexpected just happened!",
        choices: [
          { id: "giant_footprint", label: "A giant footprint appeared", emoji: "👣" },
          { id: "purple_river", label: "The river is purple", emoji: "🍇" },
          { id: "backward_bird", label: "A bird is talking backwards", emoji: "🐦" },
          { id: "flower_key", label: "A key turned into a flower", emoji: "🌸" },
        ],
      },
      {
        sparkyLine: "We need to help! What's wrong?",
        choices: [
          { id: "lost_nuts", label: "A squirrel lost its nuts", emoji: "🐿️" },
          { id: "hiding_moon", label: "The moon is hiding", emoji: "🌑" },
          { id: "rusty_robot", label: "A robot is rusty", emoji: "🤖" },
          { id: "empty_painting", label: "A painting is empty", emoji: "🖼️" },
        ],
      },
    ],
  },
  {
    id: "adventure_where",
    act: "adventure",
    variants: [
      {
        sparkyLine: "Where do they go to figure it out?",
        choices: [
          { id: "forest", label: "Deep into the forest", emoji: "🌲" },
          { id: "river", label: "Along the river", emoji: "🏞️" },
          { id: "secret", label: "A secret hideout", emoji: "🔒" },
        ],
      },
      {
        sparkyLine: "Where should our friends look for help?",
        choices: [
          { id: "crystal_caves", label: "The crystal caves", emoji: "💎" },
          { id: "candy_desert", label: "The candy desert", emoji: "🌵" },
          { id: "rainbow_bridge", label: "The rainbow bridge", emoji: "🌈" },
        ],
      },
      {
        sparkyLine: "Where does the path lead them next?",
        choices: [
          { id: "hollow_tree", label: "Inside a hollow tree", emoji: "🌳" },
          { id: "garden_gate", label: "Under the garden gate", emoji: "🚪" },
          { id: "waterfall", label: "Behind the waterfall", emoji: "🌊" },
        ],
      },
      {
        sparkyLine: "Where should we go to find the answer?",
        choices: [
          { id: "mtn_top", label: "Top of the mountain", emoji: "🏔️" },
          { id: "well_bottom", label: "Bottom of the well", emoji: "🕳️" },
          { id: "meadow_middle", label: "Middle of the meadow", emoji: "🌼" },
        ],
      },
      {
        sparkyLine: "Let's follow the clues! Where to?",
        choices: [
          { id: "windmill", label: "The old windmill", emoji: "🪁" },
          { id: "whisper_woods", label: "The whispering woods", emoji: "🌳" },
          { id: "shimmer_lake", label: "The shimmering lake", emoji: "✨" },
        ],
      },
      {
        sparkyLine: "Where does the map say to go?",
        choices: [
          { id: "giant_boot", label: "The giant's boot", emoji: "🥾" },
          { id: "fairy_house", label: "The fairy's house", emoji: "🍄" },
          { id: "dragon_nest", label: "The dragon's nest", emoji: "🥚" },
        ],
      },
      {
        sparkyLine: "Which way should we travel?",
        choices: [
          { id: "over_hills", label: "Over the hills", emoji: "⛰️" },
          { id: "thru_tunnel", label: "Through the tunnel", emoji: "🚇" },
          { id: "across_bridge", label: "Across the bridge", emoji: "🌉" },
        ],
      },
      {
        sparkyLine: "Where's the best place to look?",
        choices: [
          { id: "magic_shop", label: "The magic shop", emoji: "🔮" },
          { id: "library", label: "The big library", emoji: "📚" },
          { id: "park", label: "The city park", emoji: "⛲" },
        ],
      },
      {
        sparkyLine: "Let's go on a journey! Where?",
        choices: [
          { id: "to_moon", label: "To the moon", emoji: "🌙" },
          { id: "to_stars", label: "To the stars", emoji: "⭐" },
          { id: "to_sun", label: "To the sun", emoji: "☀️" },
        ],
      },
      {
        sparkyLine: "Where do our friends lead us?",
        choices: [
          { id: "hidden_cave", label: "The hidden cave", emoji: "🦇" },
          { id: "lost_city", label: "The lost city", emoji: "🏛️" },
          { id: "secret_garden_adv", label: "The secret garden", emoji: "🌷" },
        ],
      },
    ],
  },
  {
    id: "obstacle",
    act: "adventure",
    variants: [
      {
        sparkyLine: "What gets in the way?",
        choices: [
          { id: "puzzle", label: "A tricky puzzle", emoji: "🧩" },
          { id: "weather", label: "Big weather", emoji: "🌧️" },
          { id: "unexpected", label: "Someone unexpected", emoji: "👀" },
        ],
      },
      {
        sparkyLine: "Oh no! Something is blocking the way!",
        choices: [
          { id: "sleeping_dragon", label: "A sleeping dragon", emoji: "🐉" },
          { id: "ticklish_gatekeeper", label: "A ticklish gatekeeper", emoji: "🤭" },
          { id: "mirror_maze", label: "A maze of mirrors", emoji: "🪞" },
        ],
      },
      {
        sparkyLine: "Look out! There's something in our path!",
        choices: [
          { id: "heavy_fog", label: "A very heavy fog", emoji: "🌫️" },
          { id: "slippery_slide", label: "A giant slippery slide", emoji: "🛝" },
          { id: "riddle_owl", label: "A riddle-telling owl", emoji: "🦉" },
        ],
      },
      {
        sparkyLine: "Wait! Something is in our way!",
        choices: [
          { id: "spiderweb", label: "A giant spiderweb", emoji: "🕸️" },
          { id: "bubbles", label: "A field of bubbles", emoji: "🫧" },
          { id: "slow_turtle", label: "A very slow turtle", emoji: "🐢" },
        ],
      },
      {
        sparkyLine: "Oh no! We can't get past!",
        choices: [
          { id: "block_wall", label: "A wall of blocks", emoji: "🧱" },
          { id: "choc_river", label: "A river of chocolate", emoji: "🍫" },
          { id: "pillow_mtn", label: "A mountain of pillows", emoji: "🛌" },
        ],
      },
      {
        sparkyLine: "What's this? A new challenge!",
        choices: [
          { id: "locked_gate", label: "A locked gate", emoji: "🚪" },
          { id: "missing_bridge_obs", label: "A missing bridge", emoji: "🌉" },
          { id: "grumpy_troll", label: "A grumpy troll", emoji: "👹" },
        ],
      },
      {
        sparkyLine: "Look out! It's a...",
        choices: [
          { id: "bee_swarm", label: "Swarm of bees", emoji: "🐝" },
          { id: "leaf_pile", label: "Pile of leaves", emoji: "🍂" },
          { id: "glitter_storm", label: "Storm of glitter", emoji: "✨" },
        ],
      },
      {
        sparkyLine: "How do we get through this?",
        choices: [
          { id: "dark_tunnel", label: "A dark tunnel", emoji: "🚇" },
          { id: "high_fence", label: "A high fence", emoji: "🚧" },
          { id: "deep_hole", label: "A deep hole", emoji: "🕳️" },
        ],
      },
      {
        sparkyLine: "Something is stopping us!",
        choices: [
          { id: "magic_spell", label: "A magic spell", emoji: "🪄" },
          { id: "heavy_rock", label: "A heavy rock", emoji: "🪨" },
          { id: "thick_hedge", label: "A thick hedge", emoji: "🌳" },
        ],
      },
      {
        sparkyLine: "We have to be careful! There's a...",
        choices: [
          { id: "slippery_patch", label: "Slippery patch", emoji: "🍌" },
          { id: "windy_corner", label: "Windy corner", emoji: "🌬️" },
          { id: "noisy_bird", label: "Noisy bird", emoji: "🦜" },
        ],
      },
    ],
  },
  {
    id: "solve",
    act: "resolution",
    variants: [
      {
        sparkyLine: "How do they solve it?",
        choices: [
          { id: "teamwork", label: "Teamwork", emoji: "🤝" },
          { id: "courage", label: "Courage", emoji: "🦁" },
          { id: "kindness", label: "Kindness", emoji: "💗" },
          { id: "clever", label: "A clever idea", emoji: "💡" },
        ],
      },
      {
        sparkyLine: "What's the best way to fix this?",
        choices: [
          { id: "sharing_snack", label: "Sharing a snack", emoji: "🍎" },
          { id: "singing_song", label: "Singing a song", emoji: "🎶" },
          { id: "asking_help", label: "Asking for help", emoji: "🙋" },
          { id: "trying_again", label: "Trying one more time", emoji: "🔄" },
        ],
      },
      {
        sparkyLine: "How can they make everything right again?",
        choices: [
          { id: "making_trade", label: "Making a fair trade", emoji: "⚖️" },
          { id: "following_clues", label: "Following the clues", emoji: "🕵️" },
          { id: "magic_tool", label: "Using a magic tool", emoji: "🪄" },
          { id: "being_patient", label: "Being very patient", emoji: "⏳" },
        ],
      },
      {
        sparkyLine: "How can we fix this together?",
        choices: [
          { id: "hug", label: "Giving a hug", emoji: "🫂" },
          { id: "drawing", label: "Making a drawing", emoji: "🎨" },
          { id: "sorry", label: "Saying sorry", emoji: "🥺" },
          { id: "game", label: "Playing a game", emoji: "🎮" },
        ],
      },
      {
        sparkyLine: "What's the secret to solving this?",
        choices: [
          { id: "magic_word", label: "A magic word", emoji: "✨" },
          { id: "special_dance", label: "A special dance", emoji: "💃" },
          { id: "big_smile", label: "A big smile", emoji: "😊" },
          { id: "helping_hand", label: "A helping hand", emoji: "✋" },
        ],
      },
      {
        sparkyLine: "Let's use our brains! What should we do?",
        choices: [
          { id: "build_bridge", label: "Building a bridge", emoji: "🌉" },
          { id: "find_key", label: "Finding a key", emoji: "🔑" },
          { id: "make_wish", label: "Making a wish", emoji: "🌠" },
          { id: "tell_joke", label: "Telling a joke", emoji: "😂" },
        ],
      },
      {
        sparkyLine: "How do we make everyone happy?",
        choices: [
          { id: "share_toy", label: "Sharing a toy", emoji: "🧸" },
          { id: "plant_flower", label: "Planting a flower", emoji: "🌻" },
          { id: "clean_up", label: "Cleaning up", emoji: "🧹" },
          { id: "be_friend", label: "Being a friend", emoji: "🤝" },
        ],
      },
      {
        sparkyLine: "What's the best idea?",
        choices: [
          { id: "use_map", label: "Using a map", emoji: "🗺️" },
          { id: "ask_owl", label: "Asking a wise owl", emoji: "🦉" },
          { id: "follow_star", label: "Following a star", emoji: "⭐" },
          { id: "listen_carefully", label: "Listening carefully", emoji: "👂" },
        ],
      },
      {
        sparkyLine: "How do we get past the obstacle?",
        choices: [
          { id: "jump_over", label: "Jumping over", emoji: "🦘" },
          { id: "crawl_under", label: "Crawling under", emoji: "🐛" },
          { id: "go_around", label: "Going around", emoji: "↪️" },
          { id: "walk_thru", label: "Walking through", emoji: "🚶" },
        ],
      },
      {
        sparkyLine: "What makes everything better?",
        choices: [
          { id: "warm_blanket", label: "A warm blanket", emoji: "🛌" },
          { id: "cup_tea", label: "A cup of tea", emoji: "🍵" },
          { id: "good_book", label: "A good book", emoji: "📖" },
          { id: "quiet_moment", label: "A quiet moment", emoji: "🤫" },
        ],
      },
    ],
  },
  {
    id: "celebrate",
    act: "celebration",
    variants: [
      {
        sparkyLine: "How do they celebrate?",
        choices: [
          { id: "feast", label: "A big feast", emoji: "🥧" },
          { id: "song", label: "A song together", emoji: "🎵" },
          { id: "rest", label: "A cozy rest", emoji: "🛋️" },
          { id: "stargaze", label: "Stargazing", emoji: "⭐" },
        ],
      },
      {
        sparkyLine: "Time to celebrate! What should they do?",
        choices: [
          { id: "dance_party", label: "A silly dance party", emoji: "💃" },
          { id: "parade", label: "A colorful parade", emoji: "🎺" },
          { id: "group_hug", label: "A big group hug", emoji: "🫂" },
          { id: "fireworks", label: "A sparkly fireworks show", emoji: "🎆" },
        ],
      },
      {
        sparkyLine: "Yay! How do they finish their big day?",
        choices: [
          { id: "treehouse_nap", label: "A nap in the treehouse", emoji: "🏠" },
          { id: "treasure_hunt", label: "A fun treasure hunt", emoji: "💎" },
          { id: "picnic", label: "A picnic in the sun", emoji: "🧺" },
          { id: "fire_story", label: "A story by the fire", emoji: "🔥" },
        ],
      },
      {
        sparkyLine: "Yay! We did it! How should we celebrate?",
        choices: [
          { id: "balloon_party", label: "A balloon party", emoji: "🎈" },
          { id: "cake_contest", label: "A cake contest", emoji: "🎂" },
          { id: "talent_show", label: "A talent show", emoji: "🎭" },
          { id: "movie_night", label: "A movie night", emoji: "🍿" },
        ],
      },
      {
        sparkyLine: "Time for fun! What's next?",
        choices: [
          { id: "play_tag", label: "Playing tag", emoji: "🏃" },
          { id: "fly_kites", label: "Flying kites", emoji: "🪁" },
          { id: "build_fort", label: "Building a fort", emoji: "🏰" },
          { id: "make_crafts", label: "Making crafts", emoji: "🎨" },
        ],
      },
      {
        sparkyLine: "Let's have a party! What kind?",
        choices: [
          { id: "costume_party", label: "A costume party", emoji: "🎭" },
          { id: "pizza_party", label: "A pizza party", emoji: "🍕" },
          { id: "pool_party", label: "A pool party", emoji: "🏊" },
          { id: "garden_party", label: "A garden party", emoji: "🌻" },
        ],
      },
      {
        sparkyLine: "How do we say goodbye to our adventure?",
        choices: [
          { id: "big_wave", label: "A big wave", emoji: "👋" },
          { id: "handshake", label: "A special handshake", emoji: "🤝" },
          { id: "thank_you", label: "A thank you note", emoji: "📝" },
          { id: "promise", label: "A promise to return", emoji: "🤙" },
        ],
      },
      {
        sparkyLine: "What's the best way to end the day?",
        choices: [
          { id: "bedtime_story", label: "A bedtime story", emoji: "🌙" },
          { id: "warm_bath", label: "A warm bath", emoji: "🛁" },
          { id: "cozy_bed", label: "A cozy bed", emoji: "🛌" },
          { id: "sweet_dream", label: "A sweet dream", emoji: "😴" },
        ],
      },
      {
        sparkyLine: "Let's do something special!",
        choices: [
          { id: "plant_tree", label: "Planting a tree", emoji: "🌳" },
          { id: "make_memory", label: "Making a memory", emoji: "📸" },
          { id: "share_secret", label: "Sharing a secret", emoji: "🤫" },
          { id: "give_gift", label: "Giving a gift", emoji: "🎁" },
        ],
      },
      {
        sparkyLine: "How do we celebrate our friendship?",
        choices: [
          { id: "high_five", label: "A high five", emoji: "✋" },
          { id: "fist_bump", label: "A fist bump", emoji: "👊" },
          { id: "big_cheer", label: "A big cheer", emoji: "📣" },
          { id: "happy_song", label: "A happy song", emoji: "🎵" },
        ],
      },
    ],
  },
];

/** Backward compatibility: Export the first variant of each beat as the default flow. */
export const STORY_FLOW: SparkyBeat[] = BEAT_DEFINITIONS.map(beat => ({
  id: beat.id,
  act: beat.act,
  sparkyLine: beat.variants[0].sparkyLine,
  choices: beat.variants[0].choices,
}));

/** Sparky safety redirects — never an error message to the child. */
export const SAFE_REDIRECTS = {
  unsafe_input: "Hmm, let's try a different idea! What if we ",
  off_topic: "Ooh, that's interesting — but Sparky stays in the storybook. Let's pick:",
  too_long: "Whoa, big thought! Let's keep it short and sweet — try one of these:",
};

/**
 * Resolves a story flow based on a story number, ensuring rotation.
 * variantKey is a string like "v0-v1-v2..." encoding the variant index per beat.
 */
export function resolveStoryFlow(opts: { storyNumber: number; lastVariantKey?: string | null }): { beats: SparkyBeat[]; variantKey: string } {
  const getVariantKey = (n: number) => {
    return BEAT_DEFINITIONS.map((beat, i) => `v${(n + i) % beat.variants.length}`).join("-");
  };

  let currentStoryNumber = opts.storyNumber;
  let variantKey = getVariantKey(currentStoryNumber);

  // If lastVariantKey matches computed key, bump storyNumber by 1 and retry once
  if (opts.lastVariantKey === variantKey) {
    currentStoryNumber++;
    variantKey = getVariantKey(currentStoryNumber);
  }

  const beats: SparkyBeat[] = BEAT_DEFINITIONS.map((beat, i) => {
    const variantIndex = (currentStoryNumber + i) % beat.variants.length;
    const variant = beat.variants[variantIndex];
    return {
      id: beat.id,
      act: beat.act,
      sparkyLine: variant.sparkyLine,
      choices: variant.choices,
    };
  });

  return { beats, variantKey };
}
