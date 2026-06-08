import { DAILY_LEARNING_COUNT, pokemonData } from "../data/pokemonData";

export type QuizRecord = {
  pokemonId: string;
  date: string;
  correct: number;
  total: number;
};

export type UserProgress = {
  lastVisitDate: string;
  lastCompletedDate: string;
  streakDays: number;
  stars: number;
  candies: number;
  todayPokemonIds: string[];
  todayPokemonDate: string;
  completedTodayPokemonIds: string[];
  unlockedPokemonIds: string[];
  learnedPokemonIds: string[];
  masteredPokemonIds: string[];
  quizPassedPokemonIds: string[];
  quizHistory: QuizRecord[];
  candyAwardedDates: string[];
  evolvedPokemonIds: string[];
};

const STORAGE_KEY = "nuannuan-pokemon-progress-v1";
const starterIds = ["charmander", "squirtle", "bulbasaur"];
const STARS_PER_CANDY = 3;

const todayString = () => new Date().toISOString().slice(0, 10);

const isYesterday = (date: string, today: string) => {
  if (!date) return false;
  const target = new Date(`${today}T12:00:00`);
  target.setDate(target.getDate() - 1);
  return target.toISOString().slice(0, 10) === date;
};

export const createInitialProgress = (): UserProgress => ({
  lastVisitDate: todayString(),
  lastCompletedDate: "",
  streakDays: 0,
  stars: 0,
  candies: 0,
  todayPokemonIds: [],
  todayPokemonDate: "",
  completedTodayPokemonIds: [],
  unlockedPokemonIds: [],
  learnedPokemonIds: [],
  masteredPokemonIds: [],
  quizPassedPokemonIds: [],
  quizHistory: [],
  candyAwardedDates: [],
  evolvedPokemonIds: []
});

const normalizeProgress = (raw: Partial<UserProgress>): UserProgress => {
  const initial = createInitialProgress();
  return {
    ...initial,
    ...raw,
    todayPokemonIds: raw.todayPokemonIds ?? initial.todayPokemonIds,
    todayPokemonDate: raw.todayPokemonDate ?? initial.todayPokemonDate,
    completedTodayPokemonIds: raw.completedTodayPokemonIds ?? initial.completedTodayPokemonIds,
    unlockedPokemonIds: raw.unlockedPokemonIds ?? initial.unlockedPokemonIds,
    learnedPokemonIds: raw.learnedPokemonIds ?? initial.learnedPokemonIds,
    masteredPokemonIds: raw.masteredPokemonIds ?? initial.masteredPokemonIds,
    quizPassedPokemonIds: raw.quizPassedPokemonIds ?? initial.quizPassedPokemonIds,
    quizHistory: raw.quizHistory ?? initial.quizHistory,
    candyAwardedDates: raw.candyAwardedDates ?? initial.candyAwardedDates,
    evolvedPokemonIds: raw.evolvedPokemonIds ?? initial.evolvedPokemonIds
  };
};

export const loadProgress = (): UserProgress => {
  if (typeof window === "undefined") return createInitialProgress();

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const progress = stored ? normalizeProgress(JSON.parse(stored) as Partial<UserProgress>) : createInitialProgress();
    return applyDailyReset(progress);
  } catch {
    return createInitialProgress();
  }
};

export const saveProgress = (progress: UserProgress) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const applyDailyReset = (progress: UserProgress): UserProgress => {
  const today = todayString();
  if (progress.lastVisitDate === today && progress.todayPokemonDate === today && progress.todayPokemonIds.length === DAILY_LEARNING_COUNT) {
    return progress;
  }

  const keptStreak = progress.lastCompletedDate === today || isYesterday(progress.lastCompletedDate, today) ? progress.streakDays : 0;
  const todayPokemonIds = chooseTodayBasePokemonIds(progress, today);
  const next = {
    ...progress,
    lastVisitDate: today,
    streakDays: keptStreak,
    todayPokemonIds,
    todayPokemonDate: today,
    completedTodayPokemonIds: [],
    quizPassedPokemonIds: [],
    unlockedPokemonIds: Array.from(new Set([...progress.unlockedPokemonIds, ...todayPokemonIds]))
  };
  saveProgress(next);
  return next;
};

export const getTodayPokemonIds = (progress: UserProgress) => {
  if (progress.todayPokemonIds.length === DAILY_LEARNING_COUNT) return progress.todayPokemonIds;
  return chooseTodayBasePokemonIds(progress, todayString());
};

export const typeLabel = {
  fire: "Fire",
  water: "Water",
  grass: "Grass",
  electric: "Electric",
  normal: "Normal",
  fighting: "Fighting",
  ghost: "Ghost",
  dragon: "Dragon",
  poison: "Poison",
  flying: "Flying",
  psychic: "Psychic",
  fairy: "Fairy"
} as const;

export const typeZhLabel = {
  fire: "火系",
  water: "水系",
  grass: "草系",
  electric: "电系",
  normal: "一般系",
  fighting: "格斗系",
  ghost: "幽灵系",
  dragon: "龙系",
  poison: "毒系",
  flying: "飞行系",
  psychic: "超能力系",
  fairy: "妖精系"
} as const;

export const getPokemonTypes = (pokemon: { type: keyof typeof typeLabel; types?: Array<keyof typeof typeLabel> }) =>
  pokemon.types?.length ? pokemon.types : [pokemon.type];

export const getPrimaryType = (pokemon: { type: keyof typeof typeLabel; types?: Array<keyof typeof typeLabel> }) =>
  getPokemonTypes(pokemon)[0];

export const getPokemonStatus = (id: string, progress: UserProgress) => {
  if (progress.masteredPokemonIds.includes(id)) return "mastered";
  if (progress.learnedPokemonIds.includes(id)) return "learned";
  if (progress.unlockedPokemonIds.includes(id)) return "unlocked";
  return "locked";
};

export const canEvolve = (id: string, progress: UserProgress) => {
  const pokemon = pokemonData.find((item) => item.id === id);
  if (!pokemon || pokemon.stage === 3 || !progress.learnedPokemonIds.includes(id)) return false;

  const nextIds = getEvolutionOptionIds(id).filter((nextId) => !progress.unlockedPokemonIds.includes(nextId));
  if (nextIds.length === 0) return false;

  return progress.candies >= (pokemon.stage === 1 ? 2 : 3);
};

export const evolvePokemon = (id: string, progress: UserProgress, targetId?: string): UserProgress => {
  const pokemon = pokemonData.find((item) => item.id === id);
  if (!pokemon || !canEvolve(id, progress)) return progress;

  const nextIds = getEvolutionOptionIds(id).filter((optionId) => !progress.unlockedPokemonIds.includes(optionId));
  const nextId = targetId && nextIds.includes(targetId) ? targetId : nextIds[0];
  if (!nextId) return progress;
  const cost = pokemon.stage === 1 ? 2 : 3;

  return {
    ...progress,
    candies: progress.candies - cost,
    unlockedPokemonIds: Array.from(new Set([...progress.unlockedPokemonIds, nextId])),
    evolvedPokemonIds: Array.from(new Set([...progress.evolvedPokemonIds, nextId]))
  };
};

export const getEvolutionOptionIds = (id: string) => {
  const pokemon = pokemonData.find((item) => item.id === id);
  if (!pokemon) return [];
  if (pokemon.evolvesTo?.length) return pokemon.evolvesTo;
  const nextId = pokemon.evolutionLine[pokemon.stage];
  return nextId ? [nextId] : [];
};

export const passQuiz = (pokemonId: string, progress: UserProgress, correct: number, total: number): UserProgress => ({
  ...progress,
  quizPassedPokemonIds: Array.from(new Set([...progress.quizPassedPokemonIds, pokemonId])),
  quizHistory: [...progress.quizHistory, { pokemonId, date: todayString(), correct, total }]
});

export const completePokemon = (pokemonId: string, progress: UserProgress): UserProgress => {
  if (progress.completedTodayPokemonIds.includes(pokemonId)) return progress;

  const completedTodayPokemonIds = Array.from(new Set([...progress.completedTodayPokemonIds, pokemonId]));
  const learnedPokemonIds = Array.from(new Set([...progress.learnedPokemonIds, pokemonId]));
  const today = todayString();
  const dailyDone = completedTodayPokemonIds.length >= DAILY_LEARNING_COUNT;
  const reward = exchangeStarsForCandy(progress.stars + 1, progress.candies);

  return {
    ...progress,
    stars: reward.stars,
    candies: reward.candies,
    completedTodayPokemonIds,
    learnedPokemonIds,
    lastCompletedDate: dailyDone ? today : progress.lastCompletedDate,
    streakDays: dailyDone && progress.lastCompletedDate !== today ? progress.streakDays + 1 : progress.streakDays,
    candyAwardedDates: dailyDone && !progress.candyAwardedDates.includes(today) ? [...progress.candyAwardedDates, today] : progress.candyAwardedDates
  };
};

export const completeReview = (progress: UserProgress, masteredIds: string[]) => {
  const reward = exchangeStarsForCandy(progress.stars + 1, progress.candies);
  return {
    ...progress,
    stars: reward.stars,
    candies: reward.candies,
    masteredPokemonIds: Array.from(new Set([...progress.masteredPokemonIds, ...masteredIds]))
  };
};

const chooseTodayBasePokemonIds = (progress: UserProgress, date: string) => {
  const basePokemon = pokemonData.filter((pokemon) => pokemon.stage === 1);
  const newBasePokemon = basePokemon.filter((pokemon) => !progress.learnedPokemonIds.includes(pokemon.id));
  const primaryPool = shuffleBySeed(newBasePokemon, `${date}:new:${progress.learnedPokemonIds.join("|")}`);
  const fallbackPool = shuffleBySeed(basePokemon, `${date}:all`);
  return Array.from(new Set([...primaryPool, ...fallbackPool].map((pokemon) => pokemon.id))).slice(0, DAILY_LEARNING_COUNT);
};

const shuffleBySeed = <T extends { id: string }>(items: T[], seed: string) =>
  items
    .map((item) => ({ item, sort: seededHash(`${seed}:${item.id}`) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);

const seededHash = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const exchangeStarsForCandy = (stars: number, candies: number) => ({
  stars: stars % STARS_PER_CANDY,
  candies: candies + Math.floor(stars / STARS_PER_CANDY)
});
