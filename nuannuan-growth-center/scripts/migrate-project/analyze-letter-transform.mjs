import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const mapping = {
  projectId: "letter-transform-station",
  legacyStores: [
    "localStorage:letter-transform-station-progress-v1",
    "IndexedDB:letter-transform-station/progress/current"
  ],
  progressRules: {
    percent: "completedTaskIds.length / 3 * 100",
    currentLevel: "first missing task in identity/train/tone",
    achievements: "stickerIds as user_achievements",
    events: "AnswerEvent[] as lesson_completed/task_completed records"
  },
  mergeRules: {
    completedTaskIds: "union",
    stars: "max valid value",
    stickerIds: "union",
    events: "append with event id/time de-duplication",
    recordings: "union by id"
  }
};

const outputPath = path.resolve(process.argv[2] ?? "docs/project-data-mapping/letter-transform-station.generated.json");
writeFileSync(outputPath, `${JSON.stringify(mapping, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);

if (process.argv.includes("--check-source")) {
  const appPath = path.resolve("../src/App.tsx");
  const app = readFileSync(appPath, "utf8");
  for (const marker of ["letter-transform-station-progress-v1", "indexedDB.open", "growthClient"]) {
    if (!app.includes(marker)) {
      throw new Error(`Missing expected marker: ${marker}`);
    }
  }
}
