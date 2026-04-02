"use client";

import { useSyncExternalStore } from "react";
import { useLiveDateKey } from "./use-live-date-key";
import { toLocalDateKey } from "@/lib/domain/date";
import { createEmptyDailyEntry, normalizeItems } from "@/lib/domain/daily-entry";
import { nextStatus, type Status } from "@/lib/domain/status";
import {
  STORAGE_KEY,
  createEmptyStore,
  getEntryForDate,
  listEntries,
  persistStore,
  readStore,
  type StoreIssue,
  type ThreeMovesStore,
  upsertEntry,
} from "@/lib/storage/store";
import { type MoodId } from "@/lib/constants/moods";

const CHANGE_EVENT = "three-moves-webapp:storage-changed";

interface StoreSnapshot {
  store: ThreeMovesStore;
  issue: StoreIssue | null;
}

let cachedSnapshot: StoreSnapshot | null = null;

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function createEmptySnapshot(): StoreSnapshot {
  return {
    store: createEmptyStore(),
    issue: null,
  };
}

function readStoreSnapshot(): StoreSnapshot {
  if (cachedSnapshot) {
    return cachedSnapshot;
  }

  const storage = getStorage();
  if (!storage) {
    cachedSnapshot = {
      store: createEmptyStore(),
      issue: {
        kind: "unavailable",
        message: "当前浏览器无法读取本地存储，记录只会保留在当前会话中。",
      },
    };
    return cachedSnapshot;
  }

  const result = readStore(storage);
  cachedSnapshot = result;
  return result;
}

function writeStoreSnapshot(nextStore: ThreeMovesStore) {
  const storage = getStorage();
  const issue = persistStore(storage, nextStore);
  cachedSnapshot = {
    store: nextStore,
    issue,
  };

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cachedSnapshot = null;
      callback();
    }
  };

  const onCustomChange = () => {
    callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onCustomChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onCustomChange);
  };
}

function mutateStore(updater: (current: ThreeMovesStore) => ThreeMovesStore) {
  writeStoreSnapshot(updater(readStoreSnapshot().store));
}

export function useThreeMovesStore() {
  const snapshot = useSyncExternalStore(subscribe, readStoreSnapshot, createEmptySnapshot);
  const liveDateKey = useLiveDateKey();
  const ready = liveDateKey !== null;
  const todayKey = liveDateKey ?? "";
  const todayEntry = getEntryForDate(snapshot.store, todayKey);
  const history = listEntries(snapshot.store);

  const saveTodayItems = (items: [string, string, string]) => {
    const currentDateKey = toLocalDateKey(new Date());

    mutateStore((current) => {
      const existing = current.entries[currentDateKey];
      const normalizedItems = normalizeItems(items);
      const timestamp = new Date().toISOString();
      const nextEntry = {
        ...(existing ?? createEmptyDailyEntry(currentDateKey)),
        dateKey: currentDateKey,
        items: normalizedItems,
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp,
      };

      return upsertEntry(current, nextEntry);
    });
  };

  const setStatus = (dateKey: string, index: 0 | 1 | 2, status: Status) => {
    mutateStore((current) => {
      const existing = current.entries[dateKey] ?? createEmptyDailyEntry(dateKey);
      const nextStatuses = [...existing.statuses] as [Status, Status, Status];
      nextStatuses[index] = status;

      return upsertEntry(current, {
        ...existing,
        statuses: nextStatuses,
        updatedAt: new Date().toISOString(),
      });
    });
  };

  const toggleStatus = (dateKey: string, index: 0 | 1 | 2) => {
    mutateStore((current) => {
      const existing = current.entries[dateKey] ?? createEmptyDailyEntry(dateKey);
      const nextStatuses = [...existing.statuses] as [Status, Status, Status];
      nextStatuses[index] = nextStatus(nextStatuses[index]);

      return upsertEntry(current, {
        ...existing,
        statuses: nextStatuses,
        updatedAt: new Date().toISOString(),
      });
    });
  };

  const saveNightDetails = (dateKey: string, input: { note: string; mood: MoodId | null }) => {
    mutateStore((current) => {
      const existing = current.entries[dateKey] ?? createEmptyDailyEntry(dateKey);

      return upsertEntry(current, {
        ...existing,
        note: input.note,
        mood: input.mood,
        updatedAt: new Date().toISOString(),
      });
    });
  };

  return {
    ready,
    issue: snapshot.issue,
    todayKey,
    todayEntry,
    history,
    saveTodayItems,
    setStatus,
    toggleStatus,
    saveNightDetails,
  };
}
