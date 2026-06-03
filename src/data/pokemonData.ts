export type PokemonType =
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "normal"
  | "fighting"
  | "ghost"
  | "dragon"
  | "poison"
  | "flying"
  | "psychic"
  | "fairy";

export type PokemonWord = {
  word: string;
  meaning: string;
};

export type PokemonQuiz = {
  question: string;
  options: string[];
  answer: string;
};

export type Pokemon = {
  id: string;
  nameEn: string;
  nameZh: string;
  type: PokemonType;
  types?: PokemonType[];
  stage: 1 | 2 | 3;
  evolutionLine: string[];
  image: string;
  storyZh: string;
  words: PokemonWord[];
  sentences: string[];
  interactions: string[];
  quizzes: PokemonQuiz[];
};

export const DAILY_LEARNING_COUNT = 3;

export const pokemonData: Pokemon[] = [
  {
    id: "charmander",
    nameEn: "Charmander",
    nameZh: "小火龙",
    type: "fire",
    stage: 1,
    evolutionLine: ["charmander", "charmeleon", "charizard"],
    image: "./pokemon/charmander.png",
    storyZh: "小火龙的尾巴上有一团小火焰。它很勇敢，也有一点调皮。",
    words: [
      { word: "fire", meaning: "火" },
      { word: "hot", meaning: "热的" },
      { word: "tail", meaning: "尾巴" }
    ],
    sentences: ["I see fire.", "Fire is hot.", "Charmander has a tail."],
    interactions: ["tap-mouth-fire", "tap-tail-glow"],
    quizzes: [
      { question: "Which word means 火？", options: ["fire", "water", "leaf"], answer: "fire" },
      { question: "Fill in: I see ____.", options: ["fire", "moon", "fish"], answer: "fire" }
    ]
  },
  {
    id: "charmeleon",
    nameEn: "Charmeleon",
    nameZh: "火恐龙",
    type: "fire",
    stage: 2,
    evolutionLine: ["charmander", "charmeleon", "charizard"],
    image: "./pokemon/charmeleon.png",
    storyZh: "火恐龙比小火龙更强壮。它有锋利的爪子，看起来很有力量。",
    words: [
      { word: "claw", meaning: "爪子" },
      { word: "strong", meaning: "强壮的" },
      { word: "angry", meaning: "生气的" }
    ],
    sentences: ["It has claws.", "Charmeleon is strong.", "It looks angry."],
    interactions: ["tap-claw-shine", "tap-body-jump"],
    quizzes: [
      { question: "Which word means 爪子？", options: ["claw", "wing", "water"], answer: "claw" },
      { question: "Fill in: Charmeleon is ____.", options: ["strong", "small", "blue"], answer: "strong" }
    ]
  },
  {
    id: "charizard",
    nameEn: "Charizard",
    nameZh: "喷火龙",
    type: "fire",
    types: ["fire", "flying"],
    stage: 3,
    evolutionLine: ["charmander", "charmeleon", "charizard"],
    image: "./pokemon/charizard.png",
    storyZh: "喷火龙有大大的翅膀，可以飞到天空中，还能喷出很强的火焰。",
    words: [
      { word: "wing", meaning: "翅膀" },
      { word: "fly", meaning: "飞" },
      { word: "dragon", meaning: "龙" }
    ],
    sentences: ["Charizard has wings.", "It can fly.", "It looks like a dragon."],
    interactions: ["tap-wing-fly", "tap-mouth-big-fire"],
    quizzes: [
      { question: "Which word means 飞？", options: ["fly", "run", "sit"], answer: "fly" },
      { question: "Fill in: It can ____.", options: ["fly", "sleep", "read"], answer: "fly" }
    ]
  },
  {
    id: "squirtle",
    nameEn: "Squirtle",
    nameZh: "杰尼龟",
    type: "water",
    stage: 1,
    evolutionLine: ["squirtle", "wartortle", "blastoise"],
    image: "./pokemon/squirtle.png",
    storyZh: "杰尼龟是一只可爱的小乌龟。它可以从嘴里喷出水。",
    words: [
      { word: "water", meaning: "水" },
      { word: "shell", meaning: "壳" },
      { word: "blue", meaning: "蓝色的" }
    ],
    sentences: ["I see water.", "Squirtle has a shell.", "Squirtle is blue."],
    interactions: ["tap-mouth-water", "tap-shell-hide"],
    quizzes: [
      { question: "Which word means 水？", options: ["water", "fire", "leaf"], answer: "water" },
      { question: "Fill in: Squirtle has a ____.", options: ["shell", "wing", "tail"], answer: "shell" }
    ]
  },
  {
    id: "wartortle",
    nameEn: "Wartortle",
    nameZh: "卡咪龟",
    type: "water",
    stage: 2,
    evolutionLine: ["squirtle", "wartortle", "blastoise"],
    image: "./pokemon/wartortle.png",
    storyZh: "卡咪龟有毛茸茸的耳朵和尾巴。它游泳很厉害。",
    words: [
      { word: "swim", meaning: "游泳" },
      { word: "ear", meaning: "耳朵" },
      { word: "wave", meaning: "波浪" }
    ],
    sentences: ["It can swim.", "Wartortle has ears.", "I see a wave."],
    interactions: ["tap-tail-wave", "tap-water-splash"],
    quizzes: [
      { question: "Which word means 游泳？", options: ["swim", "fly", "jump"], answer: "swim" },
      { question: "Fill in: It can ____.", options: ["swim", "read", "cook"], answer: "swim" }
    ]
  },
  {
    id: "blastoise",
    nameEn: "Blastoise",
    nameZh: "水箭龟",
    type: "water",
    stage: 3,
    evolutionLine: ["squirtle", "wartortle", "blastoise"],
    image: "./pokemon/blastoise.png",
    storyZh: "水箭龟背上有强大的水炮。它可以喷出很大的水柱。",
    words: [
      { word: "cannon", meaning: "炮" },
      { word: "big", meaning: "大的" },
      { word: "splash", meaning: "水花" }
    ],
    sentences: ["Blastoise is big.", "It has cannons.", "Water can splash."],
    interactions: ["tap-cannon-water", "tap-body-shake"],
    quizzes: [
      { question: "Which word means 大的？", options: ["big", "hot", "red"], answer: "big" },
      { question: "Fill in: It has ____.", options: ["cannons", "flowers", "wings"], answer: "cannons" }
    ]
  },
  {
    id: "bulbasaur",
    nameEn: "Bulbasaur",
    nameZh: "妙蛙种子",
    type: "grass",
    types: ["grass", "poison"],
    stage: 1,
    evolutionLine: ["bulbasaur", "ivysaur", "venusaur"],
    image: "./pokemon/bulbasaur.png",
    storyZh: "妙蛙种子背上有一颗小种子。它喜欢阳光，也喜欢植物。",
    words: [
      { word: "seed", meaning: "种子" },
      { word: "leaf", meaning: "叶子" },
      { word: "green", meaning: "绿色的" }
    ],
    sentences: ["I see a seed.", "The leaf is green.", "Bulbasaur has a seed."],
    interactions: ["tap-seed-glow", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 种子？", options: ["seed", "fire", "shell"], answer: "seed" },
      { question: "Fill in: The leaf is ____.", options: ["green", "blue", "hot"], answer: "green" }
    ]
  },
  {
    id: "ivysaur",
    nameEn: "Ivysaur",
    nameZh: "妙蛙草",
    type: "grass",
    types: ["grass", "poison"],
    stage: 2,
    evolutionLine: ["bulbasaur", "ivysaur", "venusaur"],
    image: "./pokemon/ivysaur.png",
    storyZh: "妙蛙草背上的种子长成了花苞。它越来越有力量。",
    words: [
      { word: "bud", meaning: "花苞" },
      { word: "plant", meaning: "植物" },
      { word: "grow", meaning: "生长" }
    ],
    sentences: ["It has a bud.", "Plants can grow.", "Ivysaur is a plant Pokémon."],
    interactions: ["tap-bud-sway", "tap-leaf-sparkle"],
    quizzes: [
      { question: "Which word means 花苞？", options: ["bud", "tail", "fire"], answer: "bud" },
      { question: "Fill in: Plants can ____.", options: ["grow", "fly", "burn"], answer: "grow" }
    ]
  },
  {
    id: "venusaur",
    nameEn: "Venusaur",
    nameZh: "妙蛙花",
    type: "grass",
    types: ["grass", "poison"],
    stage: 3,
    evolutionLine: ["bulbasaur", "ivysaur", "venusaur"],
    image: "./pokemon/venusaur.png",
    storyZh: "妙蛙花背上开出了一朵大花。它像森林里的守护者。",
    words: [
      { word: "flower", meaning: "花" },
      { word: "sun", meaning: "太阳" },
      { word: "forest", meaning: "森林" }
    ],
    sentences: ["Venusaur has a flower.", "The sun is bright.", "I see a forest."],
    interactions: ["tap-flower-open", "tap-sun-glow"],
    quizzes: [
      { question: "Which word means 花？", options: ["flower", "water", "claw"], answer: "flower" },
      { question: "Fill in: Venusaur has a ____.", options: ["flower", "cannon", "wing"], answer: "flower" }
    ]
  },
  {
    id: "pikachu",
    nameEn: "Pikachu",
    nameZh: "皮卡丘",
    type: "electric",
    stage: 1,
    evolutionLine: ["pikachu", "raichu"],
    image: "./pokemon/pikachu.png",
    storyZh: "皮卡丘有可爱的脸颊。开心的时候，脸颊会发出电光。",
    words: [
      { word: "spark", meaning: "电光" },
      { word: "yellow", meaning: "黄色的" },
      { word: "cheek", meaning: "脸颊" }
    ],
    sentences: ["Pikachu is yellow.", "It has cheeks.", "I see a spark."],
    interactions: ["tap-spark-shine", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 黄色的？", options: ["yellow", "blue", "green"], answer: "yellow" },
      { question: "Fill in: I see a ____.", options: ["spark", "shell", "leaf"], answer: "spark" }
    ]
  },
  {
    id: "raichu",
    nameEn: "Raichu",
    nameZh: "雷丘",
    type: "electric",
    stage: 2,
    evolutionLine: ["pikachu", "raichu"],
    image: "./pokemon/raichu.png",
    storyZh: "雷丘比皮卡丘更强。它的尾巴像闪电一样。",
    words: [
      { word: "thunder", meaning: "雷" },
      { word: "fast", meaning: "快的" },
      { word: "tail", meaning: "尾巴" }
    ],
    sentences: ["Raichu is fast.", "It has a tail.", "Thunder is loud."],
    interactions: ["tap-spark-shine", "tap-tail-glow"],
    quizzes: [
      { question: "Which word means 快的？", options: ["fast", "slow", "small"], answer: "fast" },
      { question: "Fill in: Thunder is ____.", options: ["loud", "green", "soft"], answer: "loud" }
    ]
  },
  {
    id: "eevee",
    nameEn: "Eevee",
    nameZh: "伊布",
    type: "normal",
    stage: 1,
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon"],
    image: "./pokemon/eevee.png",
    storyZh: "伊布毛茸茸的，很会变成不同样子的宝可梦。",
    words: [
      { word: "soft", meaning: "柔软的" },
      { word: "fur", meaning: "毛" },
      { word: "friend", meaning: "朋友" }
    ],
    sentences: ["Eevee is soft.", "It has fur.", "Eevee is a friend."],
    interactions: ["tap-body-hop", "tap-tail-wave"],
    quizzes: [
      { question: "Which word means 朋友？", options: ["friend", "fire", "water"], answer: "friend" },
      { question: "Fill in: Eevee is ____.", options: ["soft", "hot", "blue"], answer: "soft" }
    ]
  },
  {
    id: "vaporeon",
    nameEn: "Vaporeon",
    nameZh: "水伊布",
    type: "water",
    stage: 2,
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon"],
    image: "./pokemon/vaporeon.png",
    storyZh: "水伊布喜欢水。它的身体像水一样闪闪发亮。",
    words: [
      { word: "water", meaning: "水" },
      { word: "fin", meaning: "鳍" },
      { word: "shine", meaning: "发光" }
    ],
    sentences: ["Vaporeon likes water.", "It has fins.", "Water can shine."],
    interactions: ["tap-water-splash", "tap-body-shine"],
    quizzes: [
      { question: "Which word means 鳍？", options: ["fin", "tail", "claw"], answer: "fin" },
      { question: "Fill in: Vaporeon likes ____.", options: ["water", "fire", "leaf"], answer: "water" }
    ]
  },
  {
    id: "jolteon",
    nameEn: "Jolteon",
    nameZh: "雷伊布",
    type: "electric",
    stage: 2,
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon"],
    image: "./pokemon/jolteon.png",
    storyZh: "雷伊布身上有尖尖的毛。它跑得很快，像小闪电。",
    words: [
      { word: "spike", meaning: "尖刺" },
      { word: "run", meaning: "跑" },
      { word: "spark", meaning: "电光" }
    ],
    sentences: ["Jolteon can run.", "It has spikes.", "I see a spark."],
    interactions: ["tap-spark-shine", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 跑？", options: ["run", "swim", "sleep"], answer: "run" },
      { question: "Fill in: It has ____.", options: ["spikes", "flowers", "shells"], answer: "spikes" }
    ]
  },
  {
    id: "flareon",
    nameEn: "Flareon",
    nameZh: "火伊布",
    type: "fire",
    stage: 2,
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon"],
    image: "./pokemon/flareon.png",
    storyZh: "火伊布有蓬蓬的毛，看起来像一团温暖的小火。",
    words: [
      { word: "warm", meaning: "暖的" },
      { word: "fluffy", meaning: "蓬松的" },
      { word: "fire", meaning: "火" }
    ],
    sentences: ["Flareon is warm.", "It has fluffy fur.", "I see fire."],
    interactions: ["tap-mouth-fire", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 暖的？", options: ["warm", "cold", "wet"], answer: "warm" },
      { question: "Fill in: I see ____.", options: ["fire", "water", "leaf"], answer: "fire" }
    ]
  },
  {
    id: "psyduck",
    nameEn: "Psyduck",
    nameZh: "可达鸭",
    type: "water",
    stage: 1,
    evolutionLine: ["psyduck", "golduck"],
    image: "./pokemon/psyduck.png",
    storyZh: "可达鸭常常抱着头。它有点迷糊，但非常可爱。",
    words: [
      { word: "duck", meaning: "鸭子" },
      { word: "head", meaning: "头" },
      { word: "confused", meaning: "迷糊的" }
    ],
    sentences: ["Psyduck is a duck.", "It has a head.", "It looks confused."],
    interactions: ["tap-body-shake", "tap-water-splash"],
    quizzes: [
      { question: "Which word means 头？", options: ["head", "tail", "wing"], answer: "head" },
      { question: "Fill in: Psyduck is a ____.", options: ["duck", "cat", "fish"], answer: "duck" }
    ]
  },
  {
    id: "golduck",
    nameEn: "Golduck",
    nameZh: "哥达鸭",
    type: "water",
    stage: 2,
    evolutionLine: ["psyduck", "golduck"],
    image: "./pokemon/golduck.png",
    storyZh: "哥达鸭游泳很快。它像水里的运动员。",
    words: [
      { word: "swim", meaning: "游泳" },
      { word: "blue", meaning: "蓝色的" },
      { word: "quick", meaning: "快的" }
    ],
    sentences: ["Golduck can swim.", "It is blue.", "It is quick."],
    interactions: ["tap-water-splash", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 游泳？", options: ["swim", "fly", "sit"], answer: "swim" },
      { question: "Fill in: It is ____.", options: ["quick", "hot", "green"], answer: "quick" }
    ]
  },
  {
    id: "jigglypuff",
    nameEn: "Jigglypuff",
    nameZh: "胖丁",
    type: "normal",
    types: ["normal", "fairy"],
    stage: 1,
    evolutionLine: ["jigglypuff", "wigglytuff"],
    image: "./pokemon/jigglypuff.png",
    storyZh: "胖丁喜欢唱歌。听到歌声，大家会觉得很困。",
    words: [
      { word: "sing", meaning: "唱歌" },
      { word: "round", meaning: "圆圆的" },
      { word: "sleep", meaning: "睡觉" }
    ],
    sentences: ["Jigglypuff can sing.", "It is round.", "I can sleep."],
    interactions: ["tap-song-bounce", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 唱歌？", options: ["sing", "run", "swim"], answer: "sing" },
      { question: "Fill in: It is ____.", options: ["round", "blue", "hot"], answer: "round" }
    ]
  },
  {
    id: "wigglytuff",
    nameEn: "Wigglytuff",
    nameZh: "胖可丁",
    type: "normal",
    types: ["normal", "fairy"],
    stage: 2,
    evolutionLine: ["jigglypuff", "wigglytuff"],
    image: "./pokemon/wigglytuff.png",
    storyZh: "胖可丁又大又柔软，像一个会唱歌的粉色抱枕。",
    words: [
      { word: "pink", meaning: "粉色的" },
      { word: "soft", meaning: "柔软的" },
      { word: "big", meaning: "大的" }
    ],
    sentences: ["Wigglytuff is pink.", "It is soft.", "It is big."],
    interactions: ["tap-song-bounce", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 粉色的？", options: ["pink", "green", "black"], answer: "pink" },
      { question: "Fill in: It is ____.", options: ["soft", "sharp", "wet"], answer: "soft" }
    ]
  },
  {
    id: "meowth",
    nameEn: "Meowth",
    nameZh: "喵喵",
    type: "normal",
    stage: 1,
    evolutionLine: ["meowth", "persian"],
    image: "./pokemon/meowth.png",
    storyZh: "喵喵像一只会冒险的小猫。它喜欢亮闪闪的金币。",
    words: [
      { word: "cat", meaning: "猫" },
      { word: "coin", meaning: "金币" },
      { word: "meow", meaning: "喵" }
    ],
    sentences: ["Meowth is a cat.", "It has a coin.", "It can meow."],
    interactions: ["tap-coin-shine", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 猫？", options: ["cat", "duck", "dragon"], answer: "cat" },
      { question: "Fill in: It has a ____.", options: ["coin", "flower", "shell"], answer: "coin" }
    ]
  },
  {
    id: "persian",
    nameEn: "Persian",
    nameZh: "猫老大",
    type: "normal",
    stage: 2,
    evolutionLine: ["meowth", "persian"],
    image: "./pokemon/persian.png",
    storyZh: "猫老大走路很安静，动作很优雅。",
    words: [
      { word: "quiet", meaning: "安静的" },
      { word: "walk", meaning: "走路" },
      { word: "cat", meaning: "猫" }
    ],
    sentences: ["Persian can walk.", "It is quiet.", "It is a cat."],
    interactions: ["tap-body-hop", "tap-coin-shine"],
    quizzes: [
      { question: "Which word means 安静的？", options: ["quiet", "loud", "hot"], answer: "quiet" },
      { question: "Fill in: Persian can ____.", options: ["walk", "swim", "grow"], answer: "walk" }
    ]
  },
  {
    id: "machop",
    nameEn: "Machop",
    nameZh: "腕力",
    type: "fighting",
    stage: 1,
    evolutionLine: ["machop", "machoke", "machamp"],
    image: "./pokemon/machop.png",
    storyZh: "腕力喜欢锻炼。它小小的身体里有大大的力量。",
    words: [
      { word: "arm", meaning: "手臂" },
      { word: "strong", meaning: "强壮的" },
      { word: "lift", meaning: "举起" }
    ],
    sentences: ["Machop has arms.", "It is strong.", "It can lift."],
    interactions: ["tap-arm-power", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 手臂？", options: ["arm", "wing", "tail"], answer: "arm" },
      { question: "Fill in: It is ____.", options: ["strong", "soft", "round"], answer: "strong" }
    ]
  },
  {
    id: "machoke",
    nameEn: "Machoke",
    nameZh: "豪力",
    type: "fighting",
    stage: 2,
    evolutionLine: ["machop", "machoke", "machamp"],
    image: "./pokemon/machoke.png",
    storyZh: "豪力比腕力更强壮。它可以帮助搬很重的东西。",
    words: [
      { word: "muscle", meaning: "肌肉" },
      { word: "heavy", meaning: "重的" },
      { word: "help", meaning: "帮助" }
    ],
    sentences: ["Machoke has muscles.", "It can help.", "The box is heavy."],
    interactions: ["tap-arm-power", "tap-body-shake"],
    quizzes: [
      { question: "Which word means 重的？", options: ["heavy", "light", "pink"], answer: "heavy" },
      { question: "Fill in: It can ____.", options: ["help", "sleep", "shine"], answer: "help" }
    ]
  },
  {
    id: "machamp",
    nameEn: "Machamp",
    nameZh: "怪力",
    type: "fighting",
    stage: 3,
    evolutionLine: ["machop", "machoke", "machamp"],
    image: "./pokemon/machamp.png",
    storyZh: "怪力有很多手臂。它看起来像超级大力士。",
    words: [
      { word: "four", meaning: "四" },
      { word: "power", meaning: "力量" },
      { word: "hand", meaning: "手" }
    ],
    sentences: ["Machamp has four arms.", "It has power.", "I see hands."],
    interactions: ["tap-arm-power", "tap-body-shake"],
    quizzes: [
      { question: "Which word means 力量？", options: ["power", "water", "song"], answer: "power" },
      { question: "Fill in: Machamp has ____ arms.", options: ["four", "two", "one"], answer: "four" }
    ]
  },
  {
    id: "gastly",
    nameEn: "Gastly",
    nameZh: "鬼斯",
    type: "ghost",
    types: ["ghost", "poison"],
    stage: 1,
    evolutionLine: ["gastly", "haunter", "gengar"],
    image: "./pokemon/gastly.png",
    storyZh: "鬼斯像一团紫色的烟。它会轻轻飘来飘去。",
    words: [
      { word: "gas", meaning: "气体" },
      { word: "purple", meaning: "紫色的" },
      { word: "float", meaning: "漂浮" }
    ],
    sentences: ["Gastly is purple.", "It can float.", "I see gas."],
    interactions: ["tap-ghost-float", "tap-body-shake"],
    quizzes: [
      { question: "Which word means 紫色的？", options: ["purple", "yellow", "green"], answer: "purple" },
      { question: "Fill in: It can ____.", options: ["float", "swim", "lift"], answer: "float" }
    ]
  },
  {
    id: "haunter",
    nameEn: "Haunter",
    nameZh: "鬼斯通",
    type: "ghost",
    types: ["ghost", "poison"],
    stage: 2,
    evolutionLine: ["gastly", "haunter", "gengar"],
    image: "./pokemon/haunter.png",
    storyZh: "鬼斯通有两只大手。它喜欢做鬼脸吓朋友。",
    words: [
      { word: "hand", meaning: "手" },
      { word: "funny", meaning: "好笑的" },
      { word: "ghost", meaning: "幽灵" }
    ],
    sentences: ["Haunter has hands.", "It is funny.", "It is a ghost."],
    interactions: ["tap-ghost-float", "tap-body-shake"],
    quizzes: [
      { question: "Which word means 手？", options: ["hand", "tail", "fin"], answer: "hand" },
      { question: "Fill in: It is a ____.", options: ["ghost", "cat", "duck"], answer: "ghost" }
    ]
  },
  {
    id: "gengar",
    nameEn: "Gengar",
    nameZh: "耿鬼",
    type: "ghost",
    types: ["ghost", "poison"],
    stage: 3,
    evolutionLine: ["gastly", "haunter", "gengar"],
    image: "./pokemon/gengar.png",
    storyZh: "耿鬼总是笑眯眯的。它喜欢躲在影子里玩。",
    words: [
      { word: "shadow", meaning: "影子" },
      { word: "smile", meaning: "微笑" },
      { word: "hide", meaning: "躲藏" }
    ],
    sentences: ["Gengar can smile.", "It can hide.", "I see a shadow."],
    interactions: ["tap-ghost-float", "tap-body-shake"],
    quizzes: [
      { question: "Which word means 影子？", options: ["shadow", "sun", "coin"], answer: "shadow" },
      { question: "Fill in: Gengar can ____.", options: ["hide", "grow", "swim"], answer: "hide" }
    ]
  },
  {
    id: "dratini",
    nameEn: "Dratini",
    nameZh: "迷你龙",
    type: "dragon",
    stage: 1,
    evolutionLine: ["dratini", "dragonair", "dragonite"],
    image: "./pokemon/dratini.png",
    storyZh: "迷你龙像一条蓝色的小龙。它安静地在水边长大。",
    words: [
      { word: "dragon", meaning: "龙" },
      { word: "long", meaning: "长的" },
      { word: "blue", meaning: "蓝色的" }
    ],
    sentences: ["Dratini is blue.", "It is long.", "It is a dragon."],
    interactions: ["tap-dragon-glow", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 龙？", options: ["dragon", "cat", "duck"], answer: "dragon" },
      { question: "Fill in: It is ____.", options: ["long", "round", "hot"], answer: "long" }
    ]
  },
  {
    id: "dragonair",
    nameEn: "Dragonair",
    nameZh: "哈克龙",
    type: "dragon",
    stage: 2,
    evolutionLine: ["dratini", "dragonair", "dragonite"],
    image: "./pokemon/dragonair.png",
    storyZh: "哈克龙身上有漂亮的珠子。它像会发光的蓝色丝带。",
    words: [
      { word: "pearl", meaning: "珍珠" },
      { word: "glow", meaning: "发光" },
      { word: "graceful", meaning: "优雅的" }
    ],
    sentences: ["Dragonair can glow.", "It has pearls.", "It is graceful."],
    interactions: ["tap-dragon-glow", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 珍珠？", options: ["pearl", "coin", "seed"], answer: "pearl" },
      { question: "Fill in: Dragonair can ____.", options: ["glow", "sleep", "meow"], answer: "glow" }
    ]
  },
  {
    id: "dragonite",
    nameEn: "Dragonite",
    nameZh: "快龙",
    type: "dragon",
    types: ["dragon", "flying"],
    stage: 3,
    evolutionLine: ["dratini", "dragonair", "dragonite"],
    image: "./pokemon/dragonite.png",
    storyZh: "快龙有小翅膀，却能飞得很远。它很温柔，也很强大。",
    words: [
      { word: "kind", meaning: "友善的" },
      { word: "fly", meaning: "飞" },
      { word: "far", meaning: "远" }
    ],
    sentences: ["Dragonite is kind.", "It can fly.", "It can go far."],
    interactions: ["tap-wing-fly", "tap-dragon-glow"],
    quizzes: [
      { question: "Which word means 友善的？", options: ["kind", "angry", "heavy"], answer: "kind" },
      { question: "Fill in: It can ____.", options: ["fly", "sing", "hide"], answer: "fly" }
    ]
  },
  {
    id: "mewtwo",
    nameEn: "Mewtwo",
    nameZh: "超梦",
    type: "psychic",
    stage: 1,
    evolutionLine: ["mewtwo"],
    image: "./pokemon/mewtwo.png",
    storyZh: "超梦很神秘，也很强大。它会用想法移动东西。",
    words: [
      { word: "mind", meaning: "思想" },
      { word: "power", meaning: "力量" },
      { word: "mystery", meaning: "神秘" }
    ],
    sentences: ["Mewtwo has power.", "It is a mystery.", "It can use its mind."],
    interactions: ["tap-psychic-wave", "tap-body-float"],
    quizzes: [
      { question: "Which word means 思想？", options: ["mind", "water", "coin"], answer: "mind" },
      { question: "Fill in: Mewtwo has ____.", options: ["power", "fur", "shell"], answer: "power" }
    ]
  }
];
