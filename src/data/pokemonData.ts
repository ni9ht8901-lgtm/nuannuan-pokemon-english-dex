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
  | "fairy"
  | "rock"
  | "ground"
  | "steel"
  | "dark"
  | "ice";

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
  evolvesTo?: string[];
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
    id: "pichu",
    nameEn: "Pichu",
    nameZh: "皮丘",
    type: "electric",
    stage: 1,
    evolutionLine: ["pichu", "pikachu", "raichu"],
    image: "./pokemon/pichu.png",
    storyZh: "皮丘小小的，脸颊会冒出电光。它还在学习控制自己的力量。",
    words: [
      { word: "tiny", meaning: "小小的" },
      { word: "spark", meaning: "电光" },
      { word: "cheek", meaning: "脸颊" }
    ],
    sentences: ["Pichu is tiny.", "I see a spark.", "It has cheeks."],
    interactions: ["tap-spark-shine", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 小小的？", options: ["tiny", "huge", "cold"], answer: "tiny" },
      { question: "Fill in: I see a ____.", options: ["spark", "flower", "stone"], answer: "spark" }
    ]
  },
  {
    id: "pikachu",
    nameEn: "Pikachu",
    nameZh: "皮卡丘",
    type: "electric",
    stage: 2,
    evolutionLine: ["pichu", "pikachu", "raichu"],
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
    stage: 3,
    evolutionLine: ["pichu", "pikachu", "raichu"],
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
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
    evolvesTo: ["vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
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
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
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
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
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
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
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
    id: "espeon",
    nameEn: "Espeon",
    nameZh: "太阳伊布",
    type: "psychic",
    stage: 2,
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
    image: "./pokemon/espeon.png",
    storyZh: "太阳伊布像会读心的小伙伴。它在阳光下会变得很敏锐。",
    words: [
      { word: "sun", meaning: "太阳" },
      { word: "mind", meaning: "思想" },
      { word: "smart", meaning: "聪明的" }
    ],
    sentences: ["Espeon is smart.", "It likes the sun.", "It can use its mind."],
    interactions: ["tap-psychic-wave", "tap-sun-glow"],
    quizzes: [
      { question: "Which word means 聪明的？", options: ["smart", "wet", "heavy"], answer: "smart" },
      { question: "Fill in: It likes the ____.", options: ["sun", "rain", "coin"], answer: "sun" }
    ]
  },
  {
    id: "umbreon",
    nameEn: "Umbreon",
    nameZh: "月亮伊布",
    type: "dark",
    stage: 2,
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
    image: "./pokemon/umbreon.png",
    storyZh: "月亮伊布喜欢夜晚。身上的圆环在黑夜里会发光。",
    words: [
      { word: "moon", meaning: "月亮" },
      { word: "night", meaning: "夜晚" },
      { word: "ring", meaning: "圆环" }
    ],
    sentences: ["Umbreon likes night.", "I see the moon.", "It has rings."],
    interactions: ["tap-moon-glow", "tap-body-shine"],
    quizzes: [
      { question: "Which word means 夜晚？", options: ["night", "day", "water"], answer: "night" },
      { question: "Fill in: I see the ____.", options: ["moon", "leaf", "shell"], answer: "moon" }
    ]
  },
  {
    id: "leafeon",
    nameEn: "Leafeon",
    nameZh: "叶伊布",
    type: "grass",
    stage: 2,
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
    image: "./pokemon/leafeon.png",
    storyZh: "叶伊布像森林里的小精灵。它的耳朵和尾巴像叶子。",
    words: [
      { word: "leaf", meaning: "叶子" },
      { word: "forest", meaning: "森林" },
      { word: "fresh", meaning: "清新的" }
    ],
    sentences: ["Leafeon has leaves.", "It likes the forest.", "The air is fresh."],
    interactions: ["tap-leaf-sparkle", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 森林？", options: ["forest", "fire", "moon"], answer: "forest" },
      { question: "Fill in: Leafeon has ____.", options: ["leaves", "cannons", "coins"], answer: "leaves" }
    ]
  },
  {
    id: "glaceon",
    nameEn: "Glaceon",
    nameZh: "冰伊布",
    type: "ice",
    stage: 2,
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
    image: "./pokemon/glaceon.png",
    storyZh: "冰伊布很冷静。它能让空气变凉，像带来一片雪花。",
    words: [
      { word: "ice", meaning: "冰" },
      { word: "cold", meaning: "冷的" },
      { word: "snow", meaning: "雪" }
    ],
    sentences: ["Glaceon is cold.", "I see ice.", "Snow is white."],
    interactions: ["tap-ice-sparkle", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 冰？", options: ["ice", "fire", "coin"], answer: "ice" },
      { question: "Fill in: Snow is ____.", options: ["white", "hot", "green"], answer: "white" }
    ]
  },
  {
    id: "sylveon",
    nameEn: "Sylveon",
    nameZh: "仙子伊布",
    type: "fairy",
    stage: 2,
    evolutionLine: ["eevee", "vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"],
    image: "./pokemon/sylveon.png",
    storyZh: "仙子伊布有漂亮的缎带。它温柔地陪伴朋友。",
    words: [
      { word: "ribbon", meaning: "缎带" },
      { word: "gentle", meaning: "温柔的" },
      { word: "friend", meaning: "朋友" }
    ],
    sentences: ["Sylveon is gentle.", "It has ribbons.", "It is a friend."],
    interactions: ["tap-ribbon-sparkle", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 缎带？", options: ["ribbon", "stone", "tail"], answer: "ribbon" },
      { question: "Fill in: Sylveon is ____.", options: ["gentle", "angry", "heavy"], answer: "gentle" }
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
    id: "igglybuff",
    nameEn: "Igglybuff",
    nameZh: "宝宝丁",
    type: "normal",
    types: ["normal", "fairy"],
    stage: 1,
    evolutionLine: ["igglybuff", "jigglypuff", "wigglytuff"],
    image: "./pokemon/igglybuff.png",
    storyZh: "宝宝丁软软的，喜欢轻轻跳来跳去。它会练习唱可爱的歌。",
    words: [
      { word: "baby", meaning: "宝宝" },
      { word: "soft", meaning: "柔软的" },
      { word: "sing", meaning: "唱歌" }
    ],
    sentences: ["Igglybuff is soft.", "It can sing.", "It is a baby Pokémon."],
    interactions: ["tap-song-bounce", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 宝宝？", options: ["baby", "dragon", "stone"], answer: "baby" },
      { question: "Fill in: It can ____.", options: ["sing", "swim", "burn"], answer: "sing" }
    ]
  },
  {
    id: "jigglypuff",
    nameEn: "Jigglypuff",
    nameZh: "胖丁",
    type: "normal",
    types: ["normal", "fairy"],
    stage: 2,
    evolutionLine: ["igglybuff", "jigglypuff", "wigglytuff"],
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
    stage: 3,
    evolutionLine: ["igglybuff", "jigglypuff", "wigglytuff"],
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
    id: "abra",
    nameEn: "Abra",
    nameZh: "凯西",
    type: "psychic",
    stage: 1,
    evolutionLine: ["abra", "kadabra", "alakazam"],
    image: "./pokemon/abra.png",
    storyZh: "凯西很爱睡觉，但它的超能力很厉害，可以一下子移动到远处。",
    words: [
      { word: "sleep", meaning: "睡觉" },
      { word: "mind", meaning: "思想" },
      { word: "move", meaning: "移动" }
    ],
    sentences: ["Abra can sleep.", "It can move fast.", "It uses its mind."],
    interactions: ["tap-psychic-wave", "tap-body-float"],
    quizzes: [
      { question: "Which word means 移动？", options: ["move", "sing", "burn"], answer: "move" },
      { question: "Fill in: Abra can ____.", options: ["sleep", "swim", "meow"], answer: "sleep" }
    ]
  },
  {
    id: "kadabra",
    nameEn: "Kadabra",
    nameZh: "勇基拉",
    type: "psychic",
    stage: 2,
    evolutionLine: ["abra", "kadabra", "alakazam"],
    image: "./pokemon/kadabra.png",
    storyZh: "勇基拉拿着一把勺子。它集中精神时，勺子会发光。",
    words: [
      { word: "spoon", meaning: "勺子" },
      { word: "focus", meaning: "集中" },
      { word: "shine", meaning: "发光" }
    ],
    sentences: ["Kadabra has a spoon.", "It can focus.", "The spoon can shine."],
    interactions: ["tap-psychic-wave", "tap-body-shine"],
    quizzes: [
      { question: "Which word means 勺子？", options: ["spoon", "tail", "seed"], answer: "spoon" },
      { question: "Fill in: It can ____.", options: ["focus", "bark", "dig"], answer: "focus" }
    ]
  },
  {
    id: "alakazam",
    nameEn: "Alakazam",
    nameZh: "胡地",
    type: "psychic",
    stage: 3,
    evolutionLine: ["abra", "kadabra", "alakazam"],
    image: "./pokemon/alakazam.png",
    storyZh: "胡地非常聪明，拿着两把勺子，像一位安静的魔法师。",
    words: [
      { word: "smart", meaning: "聪明的" },
      { word: "magic", meaning: "魔法" },
      { word: "two", meaning: "二" }
    ],
    sentences: ["Alakazam is smart.", "It has two spoons.", "It looks magic."],
    interactions: ["tap-psychic-wave", "tap-body-shine"],
    quizzes: [
      { question: "Which word means 魔法？", options: ["magic", "water", "rock"], answer: "magic" },
      { question: "Fill in: It has ____ spoons.", options: ["two", "one", "four"], answer: "two" }
    ]
  },
  {
    id: "growlithe",
    nameEn: "Growlithe",
    nameZh: "卡蒂狗",
    type: "fire",
    stage: 1,
    evolutionLine: ["growlithe", "arcanine"],
    image: "./pokemon/growlithe.png",
    storyZh: "卡蒂狗像忠诚的小狗。它会勇敢地保护朋友。",
    words: [
      { word: "dog", meaning: "狗" },
      { word: "brave", meaning: "勇敢的" },
      { word: "bark", meaning: "叫" }
    ],
    sentences: ["Growlithe is a dog.", "It is brave.", "It can bark."],
    interactions: ["tap-mouth-fire", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 勇敢的？", options: ["brave", "cold", "round"], answer: "brave" },
      { question: "Fill in: It can ____.", options: ["bark", "sing", "float"], answer: "bark" }
    ]
  },
  {
    id: "arcanine",
    nameEn: "Arcanine",
    nameZh: "风速狗",
    type: "fire",
    stage: 2,
    evolutionLine: ["growlithe", "arcanine"],
    image: "./pokemon/arcanine.png",
    storyZh: "风速狗跑起来像风一样快，鬃毛像燃烧的火焰。",
    words: [
      { word: "fast", meaning: "快的" },
      { word: "flame", meaning: "火焰" },
      { word: "run", meaning: "跑" }
    ],
    sentences: ["Arcanine can run.", "It is fast.", "I see a flame."],
    interactions: ["tap-mouth-fire", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 火焰？", options: ["flame", "leaf", "ice"], answer: "flame" },
      { question: "Fill in: Arcanine is ____.", options: ["fast", "slow", "tiny"], answer: "fast" }
    ]
  },
  {
    id: "magikarp",
    nameEn: "Magikarp",
    nameZh: "鲤鱼王",
    type: "water",
    stage: 1,
    evolutionLine: ["magikarp", "gyarados"],
    image: "./pokemon/magikarp.png",
    storyZh: "鲤鱼王看起来弱弱的，但它一直努力跳跃，未来会变得很强。",
    words: [
      { word: "fish", meaning: "鱼" },
      { word: "jump", meaning: "跳" },
      { word: "weak", meaning: "弱的" }
    ],
    sentences: ["Magikarp is a fish.", "It can jump.", "It looks weak."],
    interactions: ["tap-water-splash", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 鱼？", options: ["fish", "cat", "dog"], answer: "fish" },
      { question: "Fill in: It can ____.", options: ["jump", "fly", "read"], answer: "jump" }
    ]
  },
  {
    id: "gyarados",
    nameEn: "Gyarados",
    nameZh: "暴鲤龙",
    type: "water",
    types: ["water", "flying"],
    stage: 2,
    evolutionLine: ["magikarp", "gyarados"],
    image: "./pokemon/gyarados.png",
    storyZh: "暴鲤龙巨大又有力量，能从水里掀起大浪。",
    words: [
      { word: "huge", meaning: "巨大的" },
      { word: "wave", meaning: "波浪" },
      { word: "strong", meaning: "强壮的" }
    ],
    sentences: ["Gyarados is huge.", "It is strong.", "I see a wave."],
    interactions: ["tap-water-splash", "tap-dragon-glow"],
    quizzes: [
      { question: "Which word means 巨大的？", options: ["huge", "tiny", "soft"], answer: "huge" },
      { question: "Fill in: I see a ____.", options: ["wave", "coin", "leaf"], answer: "wave" }
    ]
  },
  {
    id: "ralts",
    nameEn: "Ralts",
    nameZh: "拉鲁拉丝",
    type: "psychic",
    types: ["psychic", "fairy"],
    stage: 1,
    evolutionLine: ["ralts", "kirlia", "gardevoir", "gallade"],
    image: "./pokemon/ralts.png",
    storyZh: "拉鲁拉丝能感受朋友的心情。开心时，它会轻轻靠近。",
    words: [
      { word: "feel", meaning: "感受" },
      { word: "happy", meaning: "开心的" },
      { word: "friend", meaning: "朋友" }
    ],
    sentences: ["Ralts can feel.", "It likes a happy friend.", "It is gentle."],
    interactions: ["tap-psychic-wave", "tap-ribbon-sparkle"],
    quizzes: [
      { question: "Which word means 感受？", options: ["feel", "throw", "burn"], answer: "feel" },
      { question: "Fill in: Ralts likes a happy ____.", options: ["friend", "rock", "fire"], answer: "friend" }
    ]
  },
  {
    id: "kirlia",
    nameEn: "Kirlia",
    nameZh: "奇鲁莉安",
    type: "psychic",
    types: ["psychic", "fairy"],
    stage: 2,
    evolutionLine: ["ralts", "kirlia", "gardevoir", "gallade"],
    evolvesTo: ["gardevoir", "gallade"],
    image: "./pokemon/kirlia.png",
    storyZh: "奇鲁莉安像小舞者。心情好时，它会轻快地跳舞。",
    words: [
      { word: "dance", meaning: "跳舞" },
      { word: "graceful", meaning: "优雅的" },
      { word: "smile", meaning: "微笑" }
    ],
    sentences: ["Kirlia can dance.", "It is graceful.", "I see a smile."],
    interactions: ["tap-psychic-wave", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 跳舞？", options: ["dance", "sleep", "dig"], answer: "dance" },
      { question: "Fill in: It is ____.", options: ["graceful", "heavy", "wet"], answer: "graceful" }
    ]
  },
  {
    id: "gardevoir",
    nameEn: "Gardevoir",
    nameZh: "沙奈朵",
    type: "psychic",
    types: ["psychic", "fairy"],
    stage: 3,
    evolutionLine: ["ralts", "kirlia", "gardevoir", "gallade"],
    image: "./pokemon/gardevoir.png",
    storyZh: "沙奈朵会守护朋友。它的力量温柔又坚定。",
    words: [
      { word: "guard", meaning: "守护" },
      { word: "gentle", meaning: "温柔的" },
      { word: "power", meaning: "力量" }
    ],
    sentences: ["Gardevoir can guard.", "It is gentle.", "It has power."],
    interactions: ["tap-psychic-wave", "tap-ribbon-sparkle"],
    quizzes: [
      { question: "Which word means 守护？", options: ["guard", "jump", "meow"], answer: "guard" },
      { question: "Fill in: It has ____.", options: ["power", "shell", "coin"], answer: "power" }
    ]
  },
  {
    id: "gallade",
    nameEn: "Gallade",
    nameZh: "艾路雷朵",
    type: "psychic",
    types: ["psychic", "fighting"],
    stage: 3,
    evolutionLine: ["ralts", "kirlia", "gardevoir", "gallade"],
    image: "./pokemon/gallade.png",
    storyZh: "艾路雷朵像勇敢的骑士。它会用手臂保护伙伴。",
    words: [
      { word: "knight", meaning: "骑士" },
      { word: "arm", meaning: "手臂" },
      { word: "protect", meaning: "保护" }
    ],
    sentences: ["Gallade is a knight.", "It has arms.", "It can protect."],
    interactions: ["tap-arm-power", "tap-psychic-wave"],
    quizzes: [
      { question: "Which word means 骑士？", options: ["knight", "fish", "flower"], answer: "knight" },
      { question: "Fill in: It can ____.", options: ["protect", "sleep", "melt"], answer: "protect" }
    ]
  },
  {
    id: "riolu",
    nameEn: "Riolu",
    nameZh: "利欧路",
    type: "fighting",
    stage: 1,
    evolutionLine: ["riolu", "lucario"],
    image: "./pokemon/riolu.png",
    storyZh: "利欧路很努力训练。它能感受特别的波导力量。",
    words: [
      { word: "train", meaning: "训练" },
      { word: "brave", meaning: "勇敢的" },
      { word: "aura", meaning: "波导" }
    ],
    sentences: ["Riolu can train.", "It is brave.", "It feels aura."],
    interactions: ["tap-arm-power", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 训练？", options: ["train", "sleep", "sing"], answer: "train" },
      { question: "Fill in: Riolu is ____.", options: ["brave", "soft", "cold"], answer: "brave" }
    ]
  },
  {
    id: "lucario",
    nameEn: "Lucario",
    nameZh: "路卡利欧",
    type: "fighting",
    types: ["fighting", "steel"],
    stage: 2,
    evolutionLine: ["riolu", "lucario"],
    image: "./pokemon/lucario.png",
    storyZh: "路卡利欧会使用波导。它冷静、勇敢，是可靠的伙伴。",
    words: [
      { word: "aura", meaning: "波导" },
      { word: "calm", meaning: "冷静的" },
      { word: "hero", meaning: "英雄" }
    ],
    sentences: ["Lucario uses aura.", "It is calm.", "It is a hero."],
    interactions: ["tap-arm-power", "tap-steel-shine"],
    quizzes: [
      { question: "Which word means 英雄？", options: ["hero", "baby", "leaf"], answer: "hero" },
      { question: "Fill in: Lucario is ____.", options: ["calm", "round", "wet"], answer: "calm" }
    ]
  },
  {
    id: "beldum",
    nameEn: "Beldum",
    nameZh: "铁哑铃",
    type: "steel",
    types: ["steel", "psychic"],
    stage: 1,
    evolutionLine: ["beldum", "metang", "metagross"],
    image: "./pokemon/beldum.png",
    storyZh: "铁哑铃像一块会飘的金属。它安静又坚硬。",
    words: [
      { word: "metal", meaning: "金属" },
      { word: "hard", meaning: "硬的" },
      { word: "float", meaning: "漂浮" }
    ],
    sentences: ["Beldum is metal.", "It is hard.", "It can float."],
    interactions: ["tap-steel-shine", "tap-body-float"],
    quizzes: [
      { question: "Which word means 金属？", options: ["metal", "water", "song"], answer: "metal" },
      { question: "Fill in: It can ____.", options: ["float", "bark", "grow"], answer: "float" }
    ]
  },
  {
    id: "metang",
    nameEn: "Metang",
    nameZh: "金属怪",
    type: "steel",
    types: ["steel", "psychic"],
    stage: 2,
    evolutionLine: ["beldum", "metang", "metagross"],
    image: "./pokemon/metang.png",
    storyZh: "金属怪有结实的身体，像会飞的钢铁伙伴。",
    words: [
      { word: "steel", meaning: "钢" },
      { word: "body", meaning: "身体" },
      { word: "strong", meaning: "强壮的" }
    ],
    sentences: ["Metang has a body.", "It is steel.", "It is strong."],
    interactions: ["tap-steel-shine", "tap-body-shake"],
    quizzes: [
      { question: "Which word means 钢？", options: ["steel", "ice", "fur"], answer: "steel" },
      { question: "Fill in: Metang is ____.", options: ["strong", "soft", "tiny"], answer: "strong" }
    ]
  },
  {
    id: "metagross",
    nameEn: "Metagross",
    nameZh: "巨金怪",
    type: "steel",
    types: ["steel", "psychic"],
    stage: 3,
    evolutionLine: ["beldum", "metang", "metagross"],
    image: "./pokemon/metagross.png",
    storyZh: "巨金怪巨大又聪明。它像蓝色的钢铁战车。",
    words: [
      { word: "huge", meaning: "巨大的" },
      { word: "smart", meaning: "聪明的" },
      { word: "steel", meaning: "钢" }
    ],
    sentences: ["Metagross is huge.", "It is smart.", "It is made of steel."],
    interactions: ["tap-steel-shine", "tap-psychic-wave"],
    quizzes: [
      { question: "Which word means 巨大的？", options: ["huge", "tiny", "pink"], answer: "huge" },
      { question: "Fill in: It is made of ____.", options: ["steel", "grass", "paper"], answer: "steel" }
    ]
  },
  {
    id: "gible",
    nameEn: "Gible",
    nameZh: "圆陆鲨",
    type: "dragon",
    types: ["dragon", "ground"],
    stage: 1,
    evolutionLine: ["gible", "gabite", "garchomp"],
    image: "./pokemon/gible.png",
    storyZh: "圆陆鲨小小的却很有冲劲，喜欢在地面上快速奔跑。",
    words: [
      { word: "bite", meaning: "咬" },
      { word: "ground", meaning: "地面" },
      { word: "run", meaning: "跑" }
    ],
    sentences: ["Gible can bite.", "It runs on the ground.", "It is a dragon."],
    interactions: ["tap-dragon-glow", "tap-ground-shake"],
    quizzes: [
      { question: "Which word means 地面？", options: ["ground", "sky", "moon"], answer: "ground" },
      { question: "Fill in: Gible can ____.", options: ["bite", "sing", "shine"], answer: "bite" }
    ]
  },
  {
    id: "gabite",
    nameEn: "Gabite",
    nameZh: "尖牙陆鲨",
    type: "dragon",
    types: ["dragon", "ground"],
    stage: 2,
    evolutionLine: ["gible", "gabite", "garchomp"],
    image: "./pokemon/gabite.png",
    storyZh: "尖牙陆鲨速度很快，尖尖的爪子让它看起来很酷。",
    words: [
      { word: "claw", meaning: "爪子" },
      { word: "quick", meaning: "快的" },
      { word: "cool", meaning: "酷的" }
    ],
    sentences: ["Gabite has claws.", "It is quick.", "It looks cool."],
    interactions: ["tap-claw-shine", "tap-ground-shake"],
    quizzes: [
      { question: "Which word means 爪子？", options: ["claw", "ribbon", "coin"], answer: "claw" },
      { question: "Fill in: Gabite is ____.", options: ["quick", "slow", "soft"], answer: "quick" }
    ]
  },
  {
    id: "garchomp",
    nameEn: "Garchomp",
    nameZh: "烈咬陆鲨",
    type: "dragon",
    types: ["dragon", "ground"],
    stage: 3,
    evolutionLine: ["gible", "gabite", "garchomp"],
    image: "./pokemon/garchomp.png",
    storyZh: "烈咬陆鲨像会飞奔的龙。它强壮又迅速。",
    words: [
      { word: "sharp", meaning: "锋利的" },
      { word: "speed", meaning: "速度" },
      { word: "dragon", meaning: "龙" }
    ],
    sentences: ["Garchomp is sharp.", "It has speed.", "It is a dragon."],
    interactions: ["tap-dragon-glow", "tap-ground-shake"],
    quizzes: [
      { question: "Which word means 速度？", options: ["speed", "sleep", "song"], answer: "speed" },
      { question: "Fill in: It is a ____.", options: ["dragon", "cat", "fish"], answer: "dragon" }
    ]
  },
  {
    id: "larvitar",
    nameEn: "Larvitar",
    nameZh: "幼基拉斯",
    type: "rock",
    types: ["rock", "ground"],
    stage: 1,
    evolutionLine: ["larvitar", "pupitar", "tyranitar"],
    image: "./pokemon/larvitar.png",
    storyZh: "幼基拉斯喜欢岩石和泥土。它一点点长大，变得更结实。",
    words: [
      { word: "rock", meaning: "岩石" },
      { word: "ground", meaning: "地面" },
      { word: "grow", meaning: "生长" }
    ],
    sentences: ["Larvitar likes rocks.", "It can grow.", "It stands on the ground."],
    interactions: ["tap-rock-shake", "tap-ground-shake"],
    quizzes: [
      { question: "Which word means 岩石？", options: ["rock", "snow", "fur"], answer: "rock" },
      { question: "Fill in: Larvitar can ____.", options: ["grow", "fly", "sing"], answer: "grow" }
    ]
  },
  {
    id: "pupitar",
    nameEn: "Pupitar",
    nameZh: "沙基拉斯",
    type: "rock",
    types: ["rock", "ground"],
    stage: 2,
    evolutionLine: ["larvitar", "pupitar", "tyranitar"],
    image: "./pokemon/pupitar.png",
    storyZh: "沙基拉斯被坚硬的壳包住。它正在积蓄力量。",
    words: [
      { word: "shell", meaning: "壳" },
      { word: "hard", meaning: "硬的" },
      { word: "wait", meaning: "等待" }
    ],
    sentences: ["Pupitar has a shell.", "It is hard.", "It can wait."],
    interactions: ["tap-rock-shake", "tap-body-shake"],
    quizzes: [
      { question: "Which word means 等待？", options: ["wait", "run", "melt"], answer: "wait" },
      { question: "Fill in: Pupitar has a ____.", options: ["shell", "flower", "ribbon"], answer: "shell" }
    ]
  },
  {
    id: "tyranitar",
    nameEn: "Tyranitar",
    nameZh: "班基拉斯",
    type: "rock",
    types: ["rock", "dark"],
    stage: 3,
    evolutionLine: ["larvitar", "pupitar", "tyranitar"],
    image: "./pokemon/tyranitar.png",
    storyZh: "班基拉斯非常强大，像山一样稳稳站着。",
    words: [
      { word: "mountain", meaning: "山" },
      { word: "strong", meaning: "强壮的" },
      { word: "dark", meaning: "黑暗的" }
    ],
    sentences: ["Tyranitar is strong.", "It is like a mountain.", "It looks dark."],
    interactions: ["tap-rock-shake", "tap-dark-glow"],
    quizzes: [
      { question: "Which word means 山？", options: ["mountain", "river", "cloud"], answer: "mountain" },
      { question: "Fill in: Tyranitar is ____.", options: ["strong", "soft", "tiny"], answer: "strong" }
    ]
  },
  {
    id: "bagon",
    nameEn: "Bagon",
    nameZh: "宝贝龙",
    type: "dragon",
    stage: 1,
    evolutionLine: ["bagon", "shelgon", "salamence"],
    image: "./pokemon/bagon.png",
    storyZh: "宝贝龙一直梦想飞上天空。它每天练习跳得更高。",
    words: [
      { word: "dream", meaning: "梦想" },
      { word: "jump", meaning: "跳" },
      { word: "sky", meaning: "天空" }
    ],
    sentences: ["Bagon has a dream.", "It can jump.", "It likes the sky."],
    interactions: ["tap-dragon-glow", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 梦想？", options: ["dream", "water", "coin"], answer: "dream" },
      { question: "Fill in: Bagon likes the ____.", options: ["sky", "ground", "shell"], answer: "sky" }
    ]
  },
  {
    id: "shelgon",
    nameEn: "Shelgon",
    nameZh: "甲壳龙",
    type: "dragon",
    stage: 2,
    evolutionLine: ["bagon", "shelgon", "salamence"],
    image: "./pokemon/shelgon.png",
    storyZh: "甲壳龙躲在坚硬的壳里，等待长出翅膀的那一天。",
    words: [
      { word: "shell", meaning: "壳" },
      { word: "wait", meaning: "等待" },
      { word: "wing", meaning: "翅膀" }
    ],
    sentences: ["Shelgon has a shell.", "It can wait.", "It wants wings."],
    interactions: ["tap-shell-hide", "tap-dragon-glow"],
    quizzes: [
      { question: "Which word means 翅膀？", options: ["wing", "rock", "spoon"], answer: "wing" },
      { question: "Fill in: Shelgon has a ____.", options: ["shell", "coin", "flower"], answer: "shell" }
    ]
  },
  {
    id: "salamence",
    nameEn: "Salamence",
    nameZh: "暴飞龙",
    type: "dragon",
    types: ["dragon", "flying"],
    stage: 3,
    evolutionLine: ["bagon", "shelgon", "salamence"],
    image: "./pokemon/salamence.png",
    storyZh: "暴飞龙终于拥有翅膀。它快乐地飞过蓝天。",
    words: [
      { word: "wing", meaning: "翅膀" },
      { word: "fly", meaning: "飞" },
      { word: "happy", meaning: "开心的" }
    ],
    sentences: ["Salamence has wings.", "It can fly.", "It is happy."],
    interactions: ["tap-wing-fly", "tap-dragon-glow"],
    quizzes: [
      { question: "Which word means 飞？", options: ["fly", "wait", "hide"], answer: "fly" },
      { question: "Fill in: Salamence has ____.", options: ["wings", "coins", "fins"], answer: "wings" }
    ]
  },
  {
    id: "togepi",
    nameEn: "Togepi",
    nameZh: "波克比",
    type: "fairy",
    stage: 1,
    evolutionLine: ["togepi", "togetic", "togekiss"],
    image: "./pokemon/togepi.png",
    storyZh: "波克比住在蛋壳里，带来快乐和好运。",
    words: [
      { word: "egg", meaning: "蛋" },
      { word: "happy", meaning: "开心的" },
      { word: "luck", meaning: "好运" }
    ],
    sentences: ["Togepi has an egg shell.", "It is happy.", "It brings luck."],
    interactions: ["tap-ribbon-sparkle", "tap-body-hop"],
    quizzes: [
      { question: "Which word means 蛋？", options: ["egg", "rock", "tail"], answer: "egg" },
      { question: "Fill in: It brings ____.", options: ["luck", "fire", "snow"], answer: "luck" }
    ]
  },
  {
    id: "togetic",
    nameEn: "Togetic",
    nameZh: "波克基古",
    type: "fairy",
    types: ["fairy", "flying"],
    stage: 2,
    evolutionLine: ["togepi", "togetic", "togekiss"],
    image: "./pokemon/togetic.png",
    storyZh: "波克基古会飞到温柔的人身边，把快乐分享出去。",
    words: [
      { word: "kind", meaning: "友善的" },
      { word: "share", meaning: "分享" },
      { word: "fly", meaning: "飞" }
    ],
    sentences: ["Togetic is kind.", "It can fly.", "It can share joy."],
    interactions: ["tap-wing-fly", "tap-ribbon-sparkle"],
    quizzes: [
      { question: "Which word means 分享？", options: ["share", "bite", "dig"], answer: "share" },
      { question: "Fill in: Togetic can ____.", options: ["fly", "swim", "burn"], answer: "fly" }
    ]
  },
  {
    id: "togekiss",
    nameEn: "Togekiss",
    nameZh: "波克基斯",
    type: "fairy",
    types: ["fairy", "flying"],
    stage: 3,
    evolutionLine: ["togepi", "togetic", "togekiss"],
    image: "./pokemon/togekiss.png",
    storyZh: "波克基斯在天空中优雅飞翔，像带来和平的白色飞机。",
    words: [
      { word: "peace", meaning: "和平" },
      { word: "sky", meaning: "天空" },
      { word: "graceful", meaning: "优雅的" }
    ],
    sentences: ["Togekiss likes peace.", "It flies in the sky.", "It is graceful."],
    interactions: ["tap-wing-fly", "tap-ribbon-sparkle"],
    quizzes: [
      { question: "Which word means 和平？", options: ["peace", "storm", "coin"], answer: "peace" },
      { question: "Fill in: It flies in the ____.", options: ["sky", "sea", "cave"], answer: "sky" }
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
