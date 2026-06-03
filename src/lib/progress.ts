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
  completedTodayPokemonIds: [],
  unlockedPokemonIds: starterIds,
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
  if (progress.lastVisitDate === today) return progress;

  const keptStreak = isYesterday(progress.lastCompletedDate, today) ? progress.streakDays : 0;
  const next = {
    ...progress,
    lastVisitDate: today,
    streakDays: keptStreak,
    completedTodayPokemonIds: [],
    quizPassedPokemonIds: []
  };
  saveProgress(next);
  return next;
};

export const getTodayPokemonIds = (progress: UserProgress) => {
  const unlocked = pokemonData.filter((pokemon) => progress.unlockedPokemonIds.includes(pokemon.id));
  const notLearned = unlocked.filter((pokemon) => !progress.learnedPokemonIds.includes(pokemon.id));
  const learned = unlocked.filter((pokemon) => progress.learnedPokemonIds.includes(pokemon.id));
  return [...notLearned, ...learned].slice(0, DAILY_LEARNING_COUNT).map((pokemon) => pokemon.id);
};

export const typeLabel = {
  fire: "Fire",
  water: "Water",
  grass: "Grass",
  electric: "Electric",
  normal: "Normal",
  fighting: "Fighting",
  ghost: "Ghost",
  dragon: "Dragon"
} as const;

export const typeZhLabel = {
  fire: "火系",
  water: "水系",
  grass: "草系",
  electric: "电系",
  normal: "一般系",
  fighting: "格斗系",
  ghost: "幽灵系",
  dragon: "龙系"
} as const;

export const getPokemonStatus = (id: string, progress: UserProgress) => {
  if (progress.masteredPokemonIds.includes(id)) return "mastered";
  if (progress.learnedPokemonIds.includes(id)) return "learned";
  if (progress.unlockedPokemonIds.includes(id)) return "unlocked";
  return "locked";
};

export const canEvolve = (id: string, progress: UserProgress) => {
  const pokemon = pokemonData.find((item) => item.id === id);
  if (!pokemon || pokemon.stage === 3 || !progress.learnedPokemonIds.includes(id)) return false;

  const nextId = pokemon.evolutionLine[pokemon.stage];
  if (progress.unlockedPokemonIds.includes(nextId)) return false;

  return progress.candies >= (pokemon.stage === 1 ? 2 : 3);
};

export const evolvePokemon = (id: string, progress: UserProgress): UserProgress => {
  const pokemon = pokemonData.find((item) => item.id === id);
  if (!pokemon || !canEvolve(id, progress)) return progress;

  const nextId = pokemon.evolutionLine[pokemon.stage];
  const cost = pokemon.stage === 1 ? 2 : 3;

  return {
    ...progress,
    candies: progress.candies - cost,
    unlockedPokemonIds: Array.from(new Set([...progress.unlockedPokemonIds, nextId])),
    evolvedPokemonIds: Array.from(new Set([...progress.evolvedPokemonIds, nextId]))
  };
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
  const awardCandy = dailyDone && !progress.candyAwardedDates.includes(today);

  return {
    ...progress,
    stars: progress.stars + 1,
    candies: progress.candies + (awardCandy ? 1 : 0),
    completedTodayPokemonIds,
    learnedPokemonIds,
    lastCompletedDate: awardCandy ? today : progress.lastCompletedDate,
    streakDays: awardCandy ? progress.streakDays + 1 : progress.streakDays,
    candyAwardedDates: awardCandy ? [...progress.candyAwardedDates, today] : progress.candyAwardedDates
  };
};

export const completeReview = (progress: UserProgress, masteredIds: string[]) => ({
  ...progress,
  stars: progress.stars + 1,
  masteredPokemonIds: Array.from(new Set([...progress.masteredPokemonIds, ...masteredIds]))
});
