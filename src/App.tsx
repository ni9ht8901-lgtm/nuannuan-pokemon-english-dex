import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registerSW } from "virtual:pwa-register";
import { DAILY_LEARNING_COUNT, pokemonData, type Pokemon } from "./data/pokemonData";
import {
  canEvolve,
  completePokemon,
  completeReview,
  evolvePokemon,
  getPokemonStatus,
  getTodayPokemonIds,
  loadProgress,
  passQuiz,
  saveProgress,
  typeLabel,
  typeZhLabel,
  type UserProgress
} from "./lib/progress";
import { PokemonPortrait } from "./components/PokemonPortrait";
import { ProgressRing } from "./components/ProgressRing";

type Tab = "adventure" | "dex" | "review" | "rewards";
type Route = { tab: Tab; pokemonId?: string; quizPokemonId?: string };

const tabs: Array<{ id: Tab; label: string; icon: string }> = [
  { id: "adventure", label: "Adventure", icon: "🧭" },
  { id: "dex", label: "Dex", icon: "📘" },
  { id: "review", label: "Review", icon: "🎲" },
  { id: "rewards", label: "Rewards", icon: "⭐" }
];

const typeClass = {
  fire: "border-orange-200 bg-orange-50 text-orange-700",
  water: "border-sky-200 bg-sky-50 text-sky-700",
  grass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  electric: "border-yellow-200 bg-yellow-50 text-yellow-700",
  normal: "border-pink-200 bg-pink-50 text-pink-700",
  fighting: "border-red-200 bg-red-50 text-red-700",
  ghost: "border-violet-200 bg-violet-50 text-violet-700",
  dragon: "border-indigo-200 bg-indigo-50 text-indigo-700"
};

registerSW({ immediate: true });

export function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute());
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());

  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const updateProgress = (next: UserProgress) => {
    setProgress(next);
    saveProgress(next);
  };

  const navigate = (next: Route) => {
    window.location.hash = stringifyRoute(next);
    setRoute(next);
  };

  const selectedPokemon = pokemonData.find((pokemon) => pokemon.id === route.pokemonId);
  const quizPokemon = pokemonData.find((pokemon) => pokemon.id === route.quizPokemonId);

  return (
    <div className="min-h-screen bg-[#fff7ed] text-slate-800">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#bae6fd,transparent_32%),radial-gradient(circle_at_bottom_right,#bbf7d0,transparent_28%)]" />
      <main className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-28 pt-[max(18px,env(safe-area-inset-top))] sm:px-6">
        <AnimatePresence mode="wait">
          {quizPokemon ? (
            <QuizPage
              key={`quiz-${quizPokemon.id}`}
              pokemon={quizPokemon}
              progress={progress}
              onPass={(correct, total) => updateProgress(passQuiz(quizPokemon.id, progress, correct, total))}
              onDone={() => navigate({ tab: route.tab, pokemonId: quizPokemon.id })}
            />
          ) : selectedPokemon ? (
            <LearnPage
              key={`learn-${selectedPokemon.id}`}
              pokemon={selectedPokemon}
              progress={progress}
              onBack={() => navigate({ tab: route.tab })}
              onQuiz={() => navigate({ tab: route.tab, quizPokemonId: selectedPokemon.id })}
              onComplete={() => updateProgress(completePokemon(selectedPokemon.id, progress))}
              onEvolve={() => updateProgress(evolvePokemon(selectedPokemon.id, progress))}
            />
          ) : route.tab === "dex" ? (
            <DexPage key="dex" progress={progress} onOpen={(id) => navigate({ tab: "dex", pokemonId: id })} />
          ) : route.tab === "review" ? (
            <ReviewPage
              key="review"
              progress={progress}
              onOpen={(id) => navigate({ tab: "review", quizPokemonId: id })}
              onReviewComplete={(ids) => updateProgress(completeReview(progress, ids))}
            />
          ) : route.tab === "rewards" ? (
            <RewardsPage key="rewards" progress={progress} onOpenDex={() => navigate({ tab: "dex" })} />
          ) : (
            <AdventurePage
              key="adventure"
              progress={progress}
              onOpen={(id) => navigate({ tab: "adventure", pokemonId: id })}
            />
          )}
        </AnimatePresence>
      </main>
      <BottomNav active={route.tab} onSelect={(tab) => navigate({ tab })} />
    </div>
  );
}

function parseRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [tabValue, mode, id] = hash.split("/");
  const tab = tabs.some((item) => item.id === tabValue) ? (tabValue as Tab) : "adventure";
  if (mode === "pokemon" && id) return { tab, pokemonId: id };
  if (mode === "quiz" && id) return { tab, quizPokemonId: id };
  return { tab };
}

function stringifyRoute(route: Route) {
  if (route.pokemonId) return `/${route.tab}/pokemon/${route.pokemonId}`;
  if (route.quizPokemonId) return `/${route.tab}/quiz/${route.quizPokemonId}`;
  return `/${route.tab}`;
}

function BottomNav({ active, onSelect }: { active: Tab; onSelect: (tab: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/80 bg-white/90 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mx-auto grid max-w-3xl grid-cols-4 gap-1 px-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`rounded-2xl px-2 py-2 text-center text-xs font-black transition sm:text-sm ${
              active === tab.id ? "bg-sky-100 text-sky-700" : "text-slate-500"
            }`}
            onClick={() => onSelect(tab.id)}
            type="button"
          >
            <span className="block text-xl" aria-hidden>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function AdventurePage({ progress, onOpen }: { progress: UserProgress; onOpen: (id: string) => void }) {
  const todayIds = getTodayPokemonIds(progress);
  const todayPokemon = todayIds.map((id) => pokemonData.find((pokemon) => pokemon.id === id)!).filter(Boolean);
  const completed = progress.completedTodayPokemonIds.length;
  const collected = progress.unlockedPokemonIds.length;
  const doneToday = completed >= DAILY_LEARNING_COUNT;

  return (
    <PageShell>
      <section className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-sky-700">Today&apos;s Adventure</p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">今天认识 3 只宝可梦吧！</h1>
        </div>
        <ProgressRing value={Math.min(completed, DAILY_LEARNING_COUNT)} total={DAILY_LEARNING_COUNT} />
      </section>

      <section className="grid grid-cols-3 gap-2 sm:gap-4">
        <Stat label="Streak" value={`${progress.streakDays} 天`} />
        <Stat label="Stars" value={`${progress.stars}`} />
        <Stat label="Collected" value={`${collected}/${pokemonData.length}`} />
      </section>

      {doneToday && (
        <motion.section
          className="rounded-[28px] border-2 border-yellow-200 bg-yellow-50 p-5 text-center shadow-soft"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-4xl">🍬</div>
          <h2 className="mt-2 text-2xl font-black text-yellow-800">今日打卡成功！</h2>
          <p className="mt-1 font-bold text-yellow-700">Great job! You got a Candy.</p>
        </motion.section>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        {todayPokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            progress={progress}
            onClick={() => onOpen(pokemon.id)}
            cta={progress.completedTodayPokemonIds.includes(pokemon.id) ? "Done" : "Start"}
          />
        ))}
      </section>
    </PageShell>
  );
}

function LearnPage({
  pokemon,
  progress,
  onBack,
  onQuiz,
  onComplete,
  onEvolve
}: {
  pokemon: Pokemon;
  progress: UserProgress;
  onBack: () => void;
  onQuiz: () => void;
  onComplete: () => void;
  onEvolve: () => void;
}) {
  const [effect, setEffect] = useState<string>();
  const [effectLabel, setEffectLabel] = useState<string>();
  const quizPassed = progress.quizPassedPokemonIds.includes(pokemon.id);
  const completed = progress.completedTodayPokemonIds.includes(pokemon.id);
  const locked = !progress.unlockedPokemonIds.includes(pokemon.id);
  const evolutionReady = canEvolve(pokemon.id, progress);
  const nextEvolution = pokemon.evolutionLine[pokemon.stage];
  const nextPokemon = pokemonData.find((item) => item.id === nextEvolution);

  const triggerEffect = (nextEffect: string, label?: string, speechText?: string) => {
    setEffect(nextEffect);
    setEffectLabel(label);
    if (speechText) speak(speechText);
    window.setTimeout(() => {
      setEffect(undefined);
      setEffectLabel(undefined);
    }, 900);
  };

  const tapPokemon = () => {
    const nextEffect = pokemon.interactions[Math.floor(Math.random() * pokemon.interactions.length)];
    triggerEffect(nextEffect);
  };

  return (
    <PageShell>
      <button className="w-fit rounded-2xl bg-white px-4 py-2 font-black text-slate-600 shadow" onClick={onBack} type="button">
        ← Back
      </button>
      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <PokemonPortrait pokemon={pokemon} activeEffect={effect} effectLabel={effectLabel} locked={locked} onTap={tapPokemon} />
          <p className="mt-3 text-center text-sm font-bold text-slate-500">Tap me, words, or sentences!</p>
        </div>
        <div className="space-y-4">
          <div className={`rounded-[28px] border-2 p-5 ${typeClass[pokemon.type]}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-black">{pokemon.nameZh}</p>
                <h1 className="text-4xl font-black text-slate-900">{pokemon.nameEn}</h1>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-black">{typeLabel[pokemon.type]} · {typeZhLabel[pokemon.type]}</span>
            </div>
            <p className="mt-4 text-lg font-bold leading-relaxed text-slate-700">{pokemon.storyZh}</p>
            <p className="mt-3 text-sm font-black text-slate-500">Evolution: {pokemon.evolutionLine.map(idToName).join(" → ")}</p>
          </div>

          <LearningList
            title="Words"
            items={pokemon.words.map((word) => ({
              id: word.word,
              label: word.word,
              sublabel: word.meaning,
              icon: iconForText(word.word, pokemon.type),
              effect: effectForText(word.word, pokemon)
            }))}
            onPlay={(item) => triggerEffect(item.effect, item.label, item.label)}
          />
          <LearningList
            title="Sentences"
            items={pokemon.sentences.map((sentence) => ({
              id: sentence,
              label: sentence,
              sublabel: sentenceHint(sentence),
              icon: iconForText(sentence, pokemon.type),
              effect: effectForText(sentence, pokemon)
            }))}
            onPlay={(item) => triggerEffect(item.effect, item.label, item.label)}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <button className="big-button bg-sky-500 text-white" onClick={onQuiz} type="button">
              Play Quiz
            </button>
            <button
              className={`big-button ${quizPassed && !completed ? "bg-emerald-500 text-white" : "bg-white text-slate-500"}`}
              disabled={!quizPassed || completed}
              onClick={onComplete}
              type="button"
            >
              {completed ? "Completed" : quizPassed ? "+1 Star" : "Finish Quiz First"}
            </button>
          </div>

          {evolutionReady && nextPokemon && (
            <motion.button
              className="w-full rounded-[28px] border-2 border-yellow-200 bg-yellow-100 p-5 text-left shadow-soft"
              onClick={onEvolve}
              type="button"
              animate={{ boxShadow: ["0 0 0 rgba(250,204,21,0)", "0 0 30px rgba(250,204,21,0.7)", "0 0 0 rgba(250,204,21,0)"] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <p className="text-sm font-black uppercase tracking-[0.12em] text-yellow-700">Ready to evolve</p>
              <p className="mt-1 text-xl font-black text-slate-900">
                {pokemon.nameEn} evolved into {nextPokemon.nameEn}!
              </p>
              <p className="font-bold text-yellow-800">Tap to use {pokemon.stage === 1 ? 2 : 3} Candy.</p>
            </motion.button>
          )}
        </div>
      </section>
    </PageShell>
  );
}

type LearningItem = {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  effect: string;
};

function LearningList({ title, items, onPlay }: { title: string; items: LearningItem[]; onPlay: (item: LearningItem) => void }) {
  return (
    <section className="rounded-[28px] bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-slate-900">{title}</h2>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">Tap to move</span>
      </div>
      <div className="mt-3 grid gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            className="group flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-left transition hover:bg-sky-50 active:scale-[0.99]"
            onClick={() => onPlay(item)}
            type="button"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-sm transition group-active:scale-110">
              {item.icon}
            </span>
            <span className="min-w-0">
              <span className="block text-xl font-black leading-tight text-slate-800">{item.label}</span>
              <span className="mt-1 block text-sm font-bold text-slate-500">{item.sublabel}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function QuizPage({
  pokemon,
  progress,
  onPass,
  onDone
}: {
  pokemon: Pokemon;
  progress: UserProgress;
  onPass: (correct: number, total: number) => void;
  onDone: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<"great" | "try" | undefined>();
  const [correct, setCorrect] = useState(0);
  const quiz = pokemon.quizzes[index];
  const completed = index >= pokemon.quizzes.length;
  const alreadyPassed = progress.quizPassedPokemonIds.includes(pokemon.id);

  const choose = (option: string) => {
    if (option === quiz.answer) {
      setFeedback("great");
      setCorrect((value) => value + 1);
      window.setTimeout(() => {
        setFeedback(undefined);
        setIndex((value) => value + 1);
      }, 650);
    } else {
      setFeedback("try");
      window.setTimeout(() => setFeedback(undefined), 700);
    }
  };

  useEffect(() => {
    if (completed && !alreadyPassed) onPass(correct, pokemon.quizzes.length);
  }, [alreadyPassed, completed, correct, onPass, pokemon.quizzes.length]);

  if (completed) {
    return (
      <PageShell>
        <section className="mx-auto max-w-md rounded-[32px] bg-white p-6 text-center shadow-soft">
          <div className="text-6xl">⭐</div>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Great!</h1>
          <p className="mt-2 text-lg font-bold text-slate-600">{pokemon.nameEn} quiz is done. Now you can get a Star.</p>
          <button className="big-button mt-5 w-full bg-emerald-500 text-white" onClick={onDone} type="button">
            Back to Learn
          </button>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-2xl rounded-[32px] bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-sky-100 p-2">
            <PokemonPortrait pokemon={pokemon} />
          </div>
          <div>
            <p className="text-sm font-black text-sky-700">Quiz {index + 1}/{pokemon.quizzes.length}</p>
            <h1 className="text-2xl font-black text-slate-900">{quiz.question}</h1>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {quiz.options.map((option) => (
            <button key={option} className="big-button bg-slate-50 text-slate-800" onClick={() => choose(option)} type="button">
              {option}
            </button>
          ))}
        </div>
        <div className="mt-5 min-h-9 text-center text-xl font-black">
          {feedback === "great" && <span className="text-emerald-600">Great! +1</span>}
          {feedback === "try" && <span className="text-orange-600">Try again! Look at {pokemon.nameEn}.</span>}
        </div>
      </section>
    </PageShell>
  );
}

function DexPage({ progress, onOpen }: { progress: UserProgress; onOpen: (id: string) => void }) {
  return (
    <PageShell>
      <Header eyebrow="Pokémon Dex" title="图鉴收集" subtitle="彩色代表已解锁，金色边框代表已掌握。" />
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {pokemonData.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} progress={progress} onClick={() => onOpen(pokemon.id)} />
        ))}
      </section>
    </PageShell>
  );
}

function ReviewPage({
  progress,
  onOpen,
  onReviewComplete
}: {
  progress: UserProgress;
  onOpen: (id: string) => void;
  onReviewComplete: (ids: string[]) => void;
}) {
  const learned = pokemonData.filter((pokemon) => progress.learnedPokemonIds.includes(pokemon.id));
  const reviewSet = useMemo(() => learned.slice().sort(() => 0.5 - Math.random()).slice(0, 3), [progress.learnedPokemonIds.join("|")]);

  return (
    <PageShell>
      <Header eyebrow="Review" title="轻松复习" subtitle="从已学宝可梦里抽 3 个复习。完成后可以获得 1 颗星星。" />
      {learned.length === 0 ? (
        <EmptyState title="还没有可复习内容" text="先完成今日冒险里的任意一只宝可梦吧。" />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            {reviewSet.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} progress={progress} onClick={() => onOpen(pokemon.id)} cta="Quiz" />
            ))}
          </section>
          <button
            className="big-button w-full bg-yellow-400 text-yellow-950"
            onClick={() => onReviewComplete(reviewSet.map((pokemon) => pokemon.id))}
            type="button"
          >
            Review Done · +1 Star
          </button>
        </>
      )}
    </PageShell>
  );
}

function RewardsPage({ progress, onOpenDex }: { progress: UserProgress; onOpenDex: () => void }) {
  return (
    <PageShell>
      <Header eyebrow="Rewards" title="奖励背包" subtitle="星星来自学习和复习，糖果可以用来进化。" />
      <section className="grid grid-cols-2 gap-4">
        <Reward value={progress.stars} label="Stars" icon="⭐" />
        <Reward value={progress.candies} label="Candy" icon="🍬" />
        <Reward value={progress.streakDays} label="Streak Days" icon="🔥" />
        <Reward value={progress.unlockedPokemonIds.length} label="Unlocked" icon="📘" />
      </section>
      <section className="rounded-[28px] bg-white p-5 shadow-soft">
        <h2 className="text-2xl font-black text-slate-900">Badges</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Badge active={progress.streakDays >= 3} label="3 Day Explorer" />
          <Badge active={progress.streakDays >= 7} label="7 Day Hero" />
          <Badge active={progress.masteredPokemonIds.length >= 3} label="Word Master" />
        </div>
        <button className="big-button mt-5 w-full bg-sky-500 text-white" onClick={onOpenDex} type="button">
          Open Dex
        </button>
      </section>
    </PageShell>
  );
}

function PokemonCard({
  pokemon,
  progress,
  onClick,
  cta = "Open"
}: {
  pokemon: Pokemon;
  progress: UserProgress;
  onClick: () => void;
  cta?: string;
}) {
  const status = getPokemonStatus(pokemon.id, progress);
  const locked = status === "locked";
  const mastered = status === "mastered";
  const completed = progress.completedTodayPokemonIds.includes(pokemon.id);

  return (
    <button
      className={`rounded-[28px] border-2 bg-white p-3 text-left shadow-soft transition active:scale-[0.98] ${
        mastered ? "border-yellow-300" : locked ? "border-slate-200 opacity-70" : "border-white"
      }`}
      onClick={onClick}
      type="button"
    >
      <PokemonPortrait pokemon={pokemon} locked={locked} />
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-slate-500">{locked ? "???" : pokemon.nameZh}</p>
          <h3 className="text-xl font-black text-slate-900">{locked ? "Locked" : pokemon.nameEn}</h3>
          <p className="mt-1 text-xs font-black uppercase text-slate-400">{status}{completed ? " · today done" : ""}</p>
        </div>
        <span className={`rounded-full border px-2 py-1 text-xs font-black ${typeClass[pokemon.type]}`}>{locked ? "?" : cta}</span>
      </div>
    </button>
  );
}

function Header({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <section>
      <p className="text-sm font-black uppercase tracking-[0.14em] text-sky-700">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-5xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-lg font-bold text-slate-600">{subtitle}</p>
    </section>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <motion.div className="space-y-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      {children}
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-3 text-center shadow-soft">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function Reward({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="rounded-[28px] bg-white p-5 text-center shadow-soft">
      <div className="text-5xl">{icon}</div>
      <p className="mt-3 text-4xl font-black text-slate-900">{value}</p>
      <p className="font-black text-slate-500">{label}</p>
    </div>
  );
}

function Badge({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={`rounded-3xl border-2 p-4 text-center font-black ${active ? "border-yellow-300 bg-yellow-50 text-yellow-800" : "border-slate-200 bg-slate-50 text-slate-400"}`}>
      <div className="text-3xl">{active ? "🏅" : "🔒"}</div>
      <p className="mt-2">{label}</p>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <section className="rounded-[28px] bg-white p-8 text-center shadow-soft">
      <div className="text-5xl">🧭</div>
      <h2 className="mt-3 text-2xl font-black text-slate-900">{title}</h2>
      <p className="mt-2 font-bold text-slate-500">{text}</p>
    </section>
  );
}

function idToName(id: string) {
  return pokemonData.find((pokemon) => pokemon.id === id)?.nameEn ?? id;
}

function iconForText(text: string, type: Pokemon["type"]) {
  const value = text.toLowerCase();
  if (value.includes("fire") || value.includes("hot")) return "🔥";
  if (value.includes("spark") || value.includes("thunder")) return "⚡";
  if (value.includes("water") || value.includes("splash") || value.includes("wave") || value.includes("swim")) return "💦";
  if (value.includes("tail")) return "✨";
  if (value.includes("shell")) return "🐚";
  if (value.includes("wing") || value.includes("fly")) return "🪽";
  if (value.includes("dragon")) return "🐉";
  if (value.includes("sing") || value.includes("song")) return "🎵";
  if (value.includes("coin")) return "🪙";
  if (value.includes("arm") || value.includes("muscle") || value.includes("power") || value.includes("lift")) return "💪";
  if (value.includes("ghost") || value.includes("shadow") || value.includes("hide") || value.includes("float")) return "👻";
  if (value.includes("pearl") || value.includes("glow")) return "✨";
  if (value.includes("claw")) return "⚡";
  if (value.includes("seed")) return "🌱";
  if (value.includes("leaf") || value.includes("green")) return "🍃";
  if (value.includes("flower") || value.includes("bud") || value.includes("plant") || value.includes("grow")) return "🌸";
  if (value.includes("sun")) return "☀️";
  if (value.includes("forest")) return "🌳";
  if (value.includes("cannon")) return "💧";
  if (value.includes("big") || value.includes("strong")) return "💪";
  if (value.includes("blue")) return "🔵";
  return type === "fire" ? "🔥" : type === "water" ? "💧" : "🌿";
}

function effectForText(text: string, pokemon: Pokemon) {
  const value = text.toLowerCase();
  if (value.includes("fire") || value.includes("hot")) return pokemon.interactions.find((item) => item.includes("fire") || item.includes("glow")) ?? "tap-mouth-fire";
  if (value.includes("spark") || value.includes("thunder") || value.includes("yellow")) return pokemon.interactions.find((item) => item.includes("spark") || item.includes("tail")) ?? pokemon.interactions[0];
  if (value.includes("water") || value.includes("splash")) return pokemon.interactions.find((item) => item.includes("water") || item.includes("splash") || item.includes("cannon")) ?? "tap-mouth-water";
  if (value.includes("tail")) return pokemon.interactions.find((item) => item.includes("tail")) ?? pokemon.interactions[0];
  if (value.includes("shell")) return pokemon.interactions.find((item) => item.includes("shell")) ?? pokemon.interactions[0];
  if (value.includes("wing") || value.includes("fly")) return pokemon.interactions.find((item) => item.includes("wing") || item.includes("fly")) ?? "tap-wing-fly";
  if (value.includes("claw") || value.includes("strong") || value.includes("angry")) return pokemon.interactions.find((item) => item.includes("claw") || item.includes("body")) ?? pokemon.interactions[0];
  if (value.includes("sing") || value.includes("song") || value.includes("round") || value.includes("sleep")) return pokemon.interactions.find((item) => item.includes("song") || item.includes("body")) ?? pokemon.interactions[0];
  if (value.includes("cat") || value.includes("coin") || value.includes("meow") || value.includes("walk") || value.includes("quiet")) return pokemon.interactions.find((item) => item.includes("coin") || item.includes("body")) ?? pokemon.interactions[0];
  if (value.includes("arm") || value.includes("muscle") || value.includes("power") || value.includes("lift") || value.includes("heavy") || value.includes("hand")) return pokemon.interactions.find((item) => item.includes("arm") || item.includes("body")) ?? pokemon.interactions[0];
  if (value.includes("ghost") || value.includes("shadow") || value.includes("float") || value.includes("hide") || value.includes("purple")) return pokemon.interactions.find((item) => item.includes("ghost") || item.includes("body")) ?? pokemon.interactions[0];
  if (value.includes("dragon") || value.includes("pearl") || value.includes("glow") || value.includes("long") || value.includes("kind") || value.includes("far")) return pokemon.interactions.find((item) => item.includes("dragon") || item.includes("wing")) ?? pokemon.interactions[0];
  if (value.includes("seed") || value.includes("leaf") || value.includes("green") || value.includes("plant") || value.includes("grow")) {
    return pokemon.interactions.find((item) => item.includes("seed") || item.includes("leaf") || item.includes("bud") || item.includes("flower")) ?? pokemon.interactions[0];
  }
  if (value.includes("flower") || value.includes("bud") || value.includes("sun") || value.includes("forest")) return pokemon.interactions.find((item) => item.includes("flower") || item.includes("bud") || item.includes("sun")) ?? pokemon.interactions[0];
  return pokemon.interactions[0];
}

function sentenceHint(sentence: string) {
  if (sentence.includes("see")) return "Look and say it";
  if (sentence.includes("has") || sentence.includes("It has")) return "Find it on the Pokémon";
  if (sentence.includes("can")) return "Watch the action";
  if (sentence.includes("is")) return "Say the feeling or color";
  return "Tap to hear and move";
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}
