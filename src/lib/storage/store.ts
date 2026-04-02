import { createEmptyDailyEntry, type DailyEntry } from "../domain/daily-entry";

export interface ThreeMovesStore {
  version: 1;
  entries: Record<string, DailyEntry>;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export type StoreIssueKind = "unavailable" | "corrupt" | "quota";

export interface StoreIssue {
  kind: StoreIssueKind;
  message: string;
}

export interface StoreReadResult {
  store: ThreeMovesStore;
  issue: StoreIssue | null;
}

export const STORAGE_KEY = "three-moves-webapp:v1";

export function createEmptyStore(): ThreeMovesStore {
  return {
    version: 1,
    entries: {},
  };
}

export function loadStore(storage: StorageLike): ThreeMovesStore {
  return readStore(storage).store;
}

export function readStore(storage: StorageLike): StoreReadResult {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return { store: createEmptyStore(), issue: null };
    }

    const parsed = JSON.parse(raw) as Partial<ThreeMovesStore>;
    if (parsed.version !== 1 || !parsed.entries || typeof parsed.entries !== "object") {
      return {
        store: createEmptyStore(),
        issue: {
          kind: "corrupt",
          message: "本地数据已损坏，已自动重置为干净状态。",
        },
      };
    }

    return {
      store: {
        version: 1,
        entries: parsed.entries as Record<string, DailyEntry>,
      },
      issue: null,
    };
  } catch {
    return {
      store: createEmptyStore(),
      issue: {
        kind: "unavailable",
        message: "当前浏览器无法读取本地存储，记录只会保留在当前会话中。",
      },
    };
  }
}

export function saveStore(storage: StorageLike, store: ThreeMovesStore): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function persistStore(storage: StorageLike | null, store: ThreeMovesStore): StoreIssue | null {
  if (!storage) {
    return {
      kind: "unavailable",
      message: "当前浏览器无法写入本地存储，记录只会保留在当前会话中。",
    };
  }

  try {
    saveStore(storage, store);
    return null;
  } catch {
    return {
      kind: "quota",
      message: "本地存储写入失败，可能是浏览器空间不足或被阻止写入。",
    };
  }
}

export function getEntryForDate(store: ThreeMovesStore, dateKey: string): DailyEntry {
  return store.entries[dateKey] ?? createEmptyDailyEntry(dateKey);
}

export function upsertEntry(store: ThreeMovesStore, entry: DailyEntry): ThreeMovesStore {
  return {
    ...store,
    entries: {
      ...store.entries,
      [entry.dateKey]: {
        ...store.entries[entry.dateKey],
        ...entry,
        updatedAt: entry.updatedAt,
        createdAt: store.entries[entry.dateKey]?.createdAt ?? entry.createdAt,
      },
    },
  };
}

export function listEntries(store: ThreeMovesStore): DailyEntry[] {
  return Object.values(store.entries).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}
