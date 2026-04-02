import { describe, expect, it } from "vitest";
import { createEmptyDailyEntry } from "../domain/daily-entry";
import { createEmptyStore, getEntryForDate, listEntries, loadStore, saveStore, upsertEntry } from "./store";

function createMemoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    dump: () => map,
  };
}

describe("store", () => {
  it("loads an empty store when storage is empty", () => {
    const storage = createMemoryStorage();

    expect(loadStore(storage)).toEqual(createEmptyStore());
  });

  it("saves and reloads the store", () => {
    const storage = createMemoryStorage();
    const store = upsertEntry(
      createEmptyStore(),
      {
        ...createEmptyDailyEntry("2026-04-02", new Date("2026-04-02T00:00:00.000Z")),
        items: ["A", "B", "C"],
        note: "note",
        mood: "专注",
        updatedAt: "2026-04-02T01:00:00.000Z",
      },
    );

    saveStore(storage, store);

    expect(loadStore(storage)).toEqual(store);
  });

  it("keeps only one entry per date and returns history in descending order", () => {
    const base = createEmptyStore();
    const first = upsertEntry(base, {
      ...createEmptyDailyEntry("2026-04-01", new Date("2026-04-01T00:00:00.000Z")),
      items: ["1", "2", "3"],
      updatedAt: "2026-04-01T01:00:00.000Z",
    });
    const second = upsertEntry(first, {
      ...createEmptyDailyEntry("2026-04-02", new Date("2026-04-02T00:00:00.000Z")),
      items: ["4", "5", "6"],
      updatedAt: "2026-04-02T01:00:00.000Z",
    });
    const updated = upsertEntry(second, {
      ...createEmptyDailyEntry("2026-04-02", new Date("2026-04-02T00:00:00.000Z")),
      items: ["7", "8", "9"],
      updatedAt: "2026-04-02T02:00:00.000Z",
    });

    expect(Object.keys(updated.entries)).toHaveLength(2);
    expect(getEntryForDate(updated, "2026-04-02").items).toEqual(["7", "8", "9"]);
    expect(listEntries(updated).map((entry) => entry.dateKey)).toEqual(["2026-04-02", "2026-04-01"]);
  });
});

