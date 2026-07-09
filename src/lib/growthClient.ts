import {
  createBrowserStorage,
  createSupabaseTransport,
  initializeProject,
  type GrowthProgress
} from "../../nuannuan-growth-center/packages/growth-sdk/src/index";

type LetterProgressSnapshot = {
  mode: "english" | "pinyin";
  stars: number;
  stickerIds: string[];
  completedTaskIds: string[];
  events: unknown[];
  recordings: unknown[];
  onboarded: boolean;
};

const supabaseUrl = import.meta.env.VITE_NUANNUAN_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_NUANNUAN_SUPABASE_ANON_KEY as string | undefined;

export const growthClient = initializeProject({
  projectId: "letter-transform-station",
  familyId: import.meta.env.VITE_NUANNUAN_FAMILY_ID ?? "family-local",
  profileId: import.meta.env.VITE_NUANNUAN_PROFILE_ID ?? "nuannuan",
  version: "1.1.0",
  storage: createBrowserStorage("letter-transform-station"),
  transport: supabaseUrl && supabaseAnonKey
    ? createSupabaseTransport({ supabaseUrl, anonKey: supabaseAnonKey })
    : undefined
});

export function mapLetterProgressToGrowthProgress(progress: LetterProgressSnapshot): GrowthProgress {
  const totalTasks = 3;
  const completedCount = progress.completedTaskIds.length;
  const nextTask = ["identity", "train", "tone"].find((taskId) => !progress.completedTaskIds.includes(taskId)) ?? "complete";

  return {
    percent: Math.round((completedCount / totalTasks) * 100),
    currentLevel: nextTask,
    counters: {
      stars: progress.stars,
      stickers: progress.stickerIds.length,
      completedTasks: completedCount,
      answerEvents: progress.events.length,
      recordings: progress.recordings.length
    },
    custom: {
      mode: progress.mode,
      onboarded: progress.onboarded,
      completedTaskIds: progress.completedTaskIds,
      stickerIds: progress.stickerIds
    }
  };
}
