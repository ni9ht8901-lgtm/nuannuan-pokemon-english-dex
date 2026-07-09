export type GrowthEventType =
  | "app_opened"
  | "session_started"
  | "session_ended"
  | "lesson_started"
  | "lesson_completed"
  | "task_completed"
  | "progress_updated"
  | "achievement_unlocked"
  | "reward_claimed"
  | "legacy_data_migrated"
  | "sync_completed"
  | "sync_failed"
  | "error_occurred"
  | string;

export type GrowthProgress = {
  percent?: number;
  currentLevel?: string;
  chapter?: string;
  checkinDays?: number;
  collectedCount?: number;
  score?: number;
  counters?: Record<string, number>;
  custom?: Record<string, unknown>;
};

export type GrowthEventRecord = {
  eventId: string;
  type: GrowthEventType;
  familyId: string;
  profileId: string;
  projectId: string;
  deviceId: string;
  sessionId: string;
  version: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type GrowthStorage = {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
};

export type GrowthTransportResult = {
  ok: boolean;
  acceptedEventIds?: string[];
  error?: string;
};

export type GrowthTransport = {
  send(records: GrowthEventRecord[]): Promise<GrowthTransportResult>;
};

export type GrowthClientConfig = {
  projectId: string;
  familyId?: string;
  profileId?: string;
  deviceId?: string;
  version?: string;
  storage?: GrowthStorage;
  transport?: GrowthTransport;
};

export type LegacyMigrationInput = {
  source: string;
  legacyData: unknown;
  progress: GrowthProgress;
};

export type FlushResult = {
  ok: boolean;
  sent: number;
  remaining: number;
  error?: string;
};

export type GrowthClient = {
  identifyUser(input: { familyId: string; profileId: string; deviceId?: string }): Promise<void>;
  startSession(payload?: Record<string, unknown>): Promise<GrowthEventRecord>;
  endSession(payload?: Record<string, unknown>): Promise<GrowthEventRecord>;
  trackEvent(type: GrowthEventType, payload?: Record<string, unknown>): Promise<GrowthEventRecord>;
  updateProgress(progress: GrowthProgress): Promise<GrowthEventRecord>;
  unlockAchievement(achievementId: string, payload?: Record<string, unknown>): Promise<GrowthEventRecord>;
  syncUserData(data: Record<string, unknown>): Promise<void>;
  getUserData<T extends Record<string, unknown> = Record<string, unknown>>(): Promise<T | null>;
  migrateLegacyData(input: LegacyMigrationInput): Promise<GrowthEventRecord>;
  flushOfflineQueue(): Promise<FlushResult>;
};

type IdentityState = {
  familyId: string;
  profileId: string;
  deviceId: string;
};

let eventCounter = 0;

export function createMemoryStorage(initial?: Record<string, string>): GrowthStorage {
  const values = new Map<string, string>(Object.entries(initial ?? {}));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    }
  };
}

export function createBrowserStorage(prefix = "nuannuan-growth-sdk"): GrowthStorage {
  if (typeof window === "undefined" || !window.localStorage) {
    return createMemoryStorage();
  }

  return {
    getItem: (key) => window.localStorage.getItem(`${prefix}:${key}`),
    setItem: (key, value) => window.localStorage.setItem(`${prefix}:${key}`, value),
    removeItem: (key) => window.localStorage.removeItem(`${prefix}:${key}`)
  };
}

export function createSupabaseTransport(input: { supabaseUrl: string; anonKey: string }): GrowthTransport {
  const endpoint = `${input.supabaseUrl.replace(/\/$/, "")}/rest/v1/events`;

  return {
    async send(records) {
      if (records.length === 0) {
        return { ok: true, acceptedEventIds: [] };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          apikey: input.anonKey,
          Authorization: `Bearer ${input.anonKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=ignore-duplicates"
        },
        body: JSON.stringify(records.map(toSupabaseEventRow))
      });

      if (!response.ok) {
        return { ok: false, error: await response.text() };
      }

      return { ok: true, acceptedEventIds: records.map((record) => record.eventId) };
    }
  };
}

export function initializeProject(config: GrowthClientConfig): GrowthClient {
  const storage = config.storage ?? createBrowserStorage();
  const transport = config.transport;
  const identity: IdentityState = {
    familyId: config.familyId ?? "family-local",
    profileId: config.profileId ?? "nuannuan",
    deviceId: config.deviceId ?? getOrCreateDeviceId(storage, config.projectId)
  };
  const version = config.version ?? "0.0.0-local";
  let sessionId = createId(config.projectId, "session");

  const queueKey = `${config.projectId}:offline-queue`;
  const dataKey = `${config.projectId}:user-data`;
  const identityKey = `${config.projectId}:identity`;

  async function readQueue(): Promise<GrowthEventRecord[]> {
    const raw = await storage.getItem(queueKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as GrowthEventRecord[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async function writeQueue(records: GrowthEventRecord[]) {
    await storage.setItem(queueKey, JSON.stringify(records));
  }

  async function enqueue(record: GrowthEventRecord) {
    const current = await readQueue();
    const byEventId = new Map(current.map((item) => [item.eventId, item]));
    byEventId.set(record.eventId, record);
    await writeQueue(Array.from(byEventId.values()));
    return record;
  }

  async function trackEvent(type: GrowthEventType, payload: Record<string, unknown> = {}) {
    return enqueue({
      eventId: createId(config.projectId, "event"),
      type,
      familyId: identity.familyId,
      profileId: identity.profileId,
      projectId: config.projectId,
      deviceId: identity.deviceId,
      sessionId,
      version,
      payload: clonePlain(payload),
      createdAt: new Date().toISOString()
    });
  }

  return {
    async identifyUser(input) {
      identity.familyId = input.familyId;
      identity.profileId = input.profileId;
      identity.deviceId = input.deviceId ?? identity.deviceId;
      await storage.setItem(identityKey, JSON.stringify(identity));
    },
    async startSession(payload = {}) {
      sessionId = createId(config.projectId, "session");
      return trackEvent("session_started", payload);
    },
    async endSession(payload = {}) {
      return trackEvent("session_ended", payload);
    },
    trackEvent,
    async updateProgress(progress) {
      return trackEvent("progress_updated", { progress: clonePlain(progress) });
    },
    async unlockAchievement(achievementId, payload = {}) {
      return trackEvent("achievement_unlocked", {
        achievementId,
        ...clonePlain(payload)
      });
    },
    async syncUserData(data) {
      await storage.setItem(dataKey, JSON.stringify(clonePlain(data)));
      await trackEvent("sync_completed", { keys: Object.keys(data) });
    },
    async getUserData() {
      const raw = await storage.getItem(dataKey);
      return raw ? JSON.parse(raw) : null;
    },
    async migrateLegacyData(input) {
      return trackEvent("legacy_data_migrated", {
        source: input.source,
        legacyData: clonePlain(input.legacyData),
        progress: clonePlain(input.progress)
      });
    },
    async flushOfflineQueue() {
      const current = await readQueue();
      if (current.length === 0) {
        return { ok: true, sent: 0, remaining: 0 };
      }
      if (!transport) {
        return {
          ok: false,
          sent: 0,
          remaining: current.length,
          error: "No transport configured. Events remain in the offline queue."
        };
      }

      try {
        const result = await transport.send(current);
        if (!result.ok) {
          return {
            ok: false,
            sent: 0,
            remaining: current.length,
            error: result.error ?? "Transport rejected the event batch."
          };
        }

        const accepted = new Set(result.acceptedEventIds ?? current.map((record) => record.eventId));
        const remaining = current.filter((record) => !accepted.has(record.eventId));
        await writeQueue(remaining);
        return {
          ok: true,
          sent: current.length - remaining.length,
          remaining: remaining.length
        };
      } catch (error) {
        return {
          ok: false,
          sent: 0,
          remaining: current.length,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  };
}

function createId(projectId: string, kind: "device" | "event" | "session") {
  eventCounter += 1;
  const randomPart = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
  return `${projectId}:${kind}:${Date.now()}:${eventCounter}:${randomPart}`;
}

function getOrCreateDeviceId(storage: GrowthStorage, projectId: string) {
  const key = `${projectId}:device-id`;
  const generated = createId(projectId, "device");
  const maybeStored = storage.getItem(key);

  if (typeof maybeStored === "string" && maybeStored) {
    return maybeStored;
  }

  void Promise.resolve(maybeStored).then((stored) => {
    if (!stored) {
      return storage.setItem(key, generated);
    }
    return undefined;
  });
  return generated;
}

function clonePlain<T>(value: T): T {
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

function toSupabaseEventRow(record: GrowthEventRecord) {
  return {
    event_id: record.eventId,
    type: record.type,
    family_id: record.familyId,
    profile_id: record.profileId,
    project_id: record.projectId,
    device_id: record.deviceId,
    session_id: record.sessionId,
    project_version: record.version,
    payload: record.payload,
    occurred_at: record.createdAt
  };
}
