import assert from "node:assert/strict";
import test from "node:test";

import { createMemoryStorage, initializeProject } from "../packages/growth-sdk/dist/index.js";

test("records events offline, then flushes them through the configured transport", async () => {
  const sent = [];
  const client = initializeProject({
    projectId: "letter-transform-station",
    familyId: "family-demo",
    profileId: "nuannuan",
    deviceId: "ipad-test",
    version: "1.1.0",
    storage: createMemoryStorage(),
    transport: {
      send: async (records) => {
        sent.push(...records);
        return {
          ok: true,
          acceptedEventIds: records.map((record) => record.eventId)
        };
      }
    }
  });

  const session = await client.startSession();
  const completion = await client.trackEvent("lesson_completed", {
    taskId: "identity",
    correct: true
  });

  assert.equal(session.type, "session_started");
  assert.equal(completion.projectId, "letter-transform-station");
  assert.match(completion.eventId, /^letter-transform-station:/);

  const result = await client.flushOfflineQueue();

  assert.equal(result.ok, true);
  assert.equal(result.sent, 2);
  assert.equal(sent.length, 2);
  assert.deepEqual(sent.map((record) => record.type), ["session_started", "lesson_completed"]);
});

test("migrates legacy data without mutating the original local record", async () => {
  const legacyProgress = {
    stars: 3,
    completedTaskIds: ["identity"],
    stickerIds: ["sticker-switch-day1"]
  };
  const client = initializeProject({
    projectId: "letter-transform-station",
    familyId: "family-demo",
    profileId: "nuannuan",
    deviceId: "iphone-test",
    storage: createMemoryStorage()
  });

  const migrated = await client.migrateLegacyData({
    source: "localStorage:letter-transform-station-progress-v1",
    legacyData: legacyProgress,
    progress: {
      percent: 33,
      currentLevel: "identity",
      counters: { stars: 3, stickers: 1 }
    }
  });

  assert.equal(migrated.type, "legacy_data_migrated");
  assert.equal(legacyProgress.stars, 3);
  assert.equal(migrated.payload.source, "localStorage:letter-transform-station-progress-v1");
  assert.equal(migrated.payload.progress.percent, 33);
});
