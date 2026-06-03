import { motion } from "framer-motion";
import type { Pokemon } from "../data/pokemonData";

type PokemonPortraitProps = {
  pokemon: Pokemon;
  activeEffect?: string;
  effectLabel?: string;
  locked?: boolean;
  onTap?: () => void;
};

const typeGradient = {
  fire: "from-orange-300 via-amber-100 to-rose-200",
  water: "from-sky-300 via-cyan-100 to-blue-200",
  grass: "from-emerald-300 via-lime-100 to-green-200",
  electric: "from-yellow-300 via-amber-100 to-orange-200",
  normal: "from-pink-200 via-rose-100 to-fuchsia-100",
  fighting: "from-red-300 via-orange-100 to-amber-100",
  ghost: "from-violet-400 via-purple-200 to-slate-200",
  dragon: "from-indigo-300 via-sky-100 to-cyan-200",
  poison: "from-fuchsia-300 via-purple-100 to-pink-100",
  flying: "from-cyan-200 via-sky-100 to-white",
  psychic: "from-purple-300 via-fuchsia-100 to-pink-100",
  fairy: "from-rose-200 via-pink-100 to-white"
};

export function PokemonPortrait({ pokemon, activeEffect, effectLabel, locked, onTap }: PokemonPortraitProps) {
  const effectText = effectLabel ?? getEffectText(activeEffect, pokemon.type);
  const interactive = Boolean(onTap);
  const Wrapper = interactive ? "button" : "div";

  return (
    <Wrapper
      className={`relative mx-auto grid aspect-square w-full max-w-[280px] place-items-center overflow-hidden rounded-[28px] bg-gradient-to-br ${typeGradient[pokemon.type]} shadow-soft transition active:scale-95 ${
        locked ? "grayscale" : ""
      }`}
      onClick={onTap}
      {...(interactive ? { type: "button" as const } : {})}
      aria-label={`Tap ${pokemon.nameEn}`}
    >
      <motion.div
        className="absolute inset-3 rounded-full bg-white/45 blur-sm"
        animate={activeEffect ? { scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="absolute inset-x-6 bottom-4 h-16 rounded-[50%] bg-slate-900/10 blur-md"
        animate={activeEffect ? { scale: [1, 0.86, 1], opacity: [0.18, 0.1, 0.18] } : { scale: 1 }}
      />
      <motion.img
        src={pokemon.image}
        alt={locked ? "Locked Pokémon" : pokemon.nameEn}
        className={`relative z-10 h-[82%] w-[82%] object-contain drop-shadow-[0_20px_18px_rgba(15,23,42,0.22)] ${
          locked ? "brightness-0 opacity-70" : ""
        }`}
        animate={
          activeEffect
            ? getImageAnimation(activeEffect)
            : { y: [0, -4, 0] }
        }
        transition={{ duration: activeEffect ? 0.55 : 2.4, repeat: activeEffect ? 0 : Infinity }}
      />
      <EffectOverlay effect={activeEffect} type={pokemon.type} />
      <motion.div
        className="pointer-events-none absolute bottom-6 z-20 rounded-full bg-white/95 px-4 py-2 text-lg font-black text-slate-700 shadow"
        animate={activeEffect ? { opacity: [0, 1, 0], y: [10, -8, -20] } : { opacity: 0 }}
        transition={{ duration: 0.9 }}
      >
        {effectText}
      </motion.div>
    </Wrapper>
  );
}

function EffectOverlay({ effect, type }: { effect?: string; type: Pokemon["type"] }) {
  if (!effect) return null;

  if (effect.includes("water") || effect.includes("splash") || effect.includes("cannon") || effect.includes("wave")) {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-5xl"
        animate={{ x: [-30, 34, 70], opacity: [0, 1, 0] }}
        transition={{ duration: 0.75 }}
      >
        💦
      </motion.div>
    );
  }

  if (effect.includes("leaf") || effect.includes("seed") || effect.includes("bud") || effect.includes("flower") || effect.includes("grow")) {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 grid place-items-center text-5xl"
        animate={{ rotate: [0, 14, -14, 0], scale: [0.7, 1.12, 0.9], opacity: [0, 1, 0] }}
        transition={{ duration: 0.9 }}
      >
        🌿
      </motion.div>
    );
  }

  if (effect.includes("wing") || effect.includes("fly")) {
    return (
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-8 z-20 text-center text-4xl"
        animate={{ y: [20, -14, -28], opacity: [0, 1, 0] }}
        transition={{ duration: 0.9 }}
      >
        ✨
      </motion.div>
    );
  }

  if (effect.includes("spark")) {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 grid place-items-center text-6xl"
        animate={{ scale: [0.4, 1.15, 0.8], rotate: [-10, 8, -6], opacity: [0, 1, 0] }}
        transition={{ duration: 0.85 }}
      >
        ⚡
      </motion.div>
    );
  }

  if (effect.includes("song")) {
    return (
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-12 z-20 text-center text-5xl"
        animate={{ y: [18, -18, -30], opacity: [0, 1, 0] }}
        transition={{ duration: 0.95 }}
      >
        🎵
      </motion.div>
    );
  }

  if (effect.includes("coin")) {
    return (
      <motion.div
        className="pointer-events-none absolute right-9 top-12 z-20 text-5xl"
        animate={{ rotate: [0, 180, 360], scale: [0.5, 1.1, 0.7], opacity: [0, 1, 0] }}
        transition={{ duration: 0.9 }}
      >
        🪙
      </motion.div>
    );
  }

  if (effect.includes("arm")) {
    return (
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-16 z-20 text-center text-5xl"
        animate={{ scale: [0.5, 1.15, 0.9], opacity: [0, 1, 0] }}
        transition={{ duration: 0.8 }}
      >
        💪
      </motion.div>
    );
  }

  if (effect.includes("ghost")) {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 grid place-items-center text-6xl"
        animate={{ y: [18, -16, 0], opacity: [0, 0.9, 0], scale: [0.7, 1.12, 0.9] }}
        transition={{ duration: 0.95 }}
      >
        👻
      </motion.div>
    );
  }

  if (effect.includes("dragon")) {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 grid place-items-center text-6xl"
        animate={{ scale: [0.5, 1.15, 0.9], rotate: [-8, 8, -4], opacity: [0, 1, 0] }}
        transition={{ duration: 0.95 }}
      >
        ✨
      </motion.div>
    );
  }

  if (effect.includes("psychic")) {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 grid place-items-center text-6xl"
        animate={{ scale: [0.5, 1.25, 0.75], rotate: [0, 180, 360], opacity: [0, 1, 0] }}
        transition={{ duration: 1 }}
      >
        🌀
      </motion.div>
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute right-8 top-16 z-20 text-6xl"
      animate={{ scale: [0.3, 1.15, 0.8], rotate: [-8, 8, -8], opacity: [0, 1, 0] }}
      transition={{ duration: 0.82 }}
    >
      {type === "fire" ? "🔥" : type === "water" ? "💧" : "🌱"}
    </motion.div>
  );
}

function getImageAnimation(effect: string) {
  if (effect.includes("wing") || effect.includes("fly")) return { y: [0, -26, 0], rotate: [-3, 3, -3], scale: [1, 1.04, 1] };
  if (effect.includes("spark")) return { y: [0, -10, 0], rotate: [-5, 5, -4], scale: [1, 1.08, 1] };
  if (effect.includes("song")) return { y: [0, -16, 0], scale: [1, 1.1, 1] };
  if (effect.includes("coin")) return { rotate: [0, -6, 6, 0], scale: [1, 1.06, 1] };
  if (effect.includes("arm")) return { scale: [1, 1.12, 1], y: [0, -8, 0] };
  if (effect.includes("ghost")) return { y: [0, -20, 0], opacity: [1, 0.78, 1], scale: [1, 1.06, 1] };
  if (effect.includes("dragon")) return { y: [0, -18, 0], scale: [1, 1.08, 1] };
  if (effect.includes("psychic")) return { y: [0, -16, 0], scale: [1, 1.1, 1], rotate: [-2, 2, -2] };
  if (effect.includes("tail") || effect.includes("wave")) return { rotate: [0, -7, 7, 0], scale: [1, 1.05, 1] };
  if (effect.includes("shell") || effect.includes("hide")) return { scale: [1, 0.86, 1], y: [0, 8, 0] };
  if (effect.includes("jump") || effect.includes("hop")) return { y: [0, -22, 0], scale: [1, 1.06, 1] };
  if (effect.includes("flower") || effect.includes("bud") || effect.includes("seed")) return { scale: [1, 1.12, 1], rotate: [0, 3, -3, 0] };
  return { y: [0, -12, 0], rotate: [-2, 2, -2], scale: [1, 1.05, 1] };
}

function getEffectText(effect: string | undefined, type: Pokemon["type"]) {
  if (!effect) return "";
  if (effect.includes("water") || effect.includes("splash") || effect.includes("cannon")) return "Splash!";
  if (effect.includes("fire") || effect.includes("glow")) return "Glow!";
  if (effect.includes("wing") || effect.includes("fly")) return "Fly!";
  if (effect.includes("jump") || effect.includes("hop")) return "Hop!";
  if (effect.includes("flower") || effect.includes("bud") || effect.includes("seed")) return "Bloom!";
  if (effect.includes("psychic")) return "Mind power!";
  return type === "fire" ? "Flame!" : type === "water" ? "Splash!" : "Grow!";
}
