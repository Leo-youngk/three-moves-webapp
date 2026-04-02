import type { Status } from "./status";

export interface DailyEntry {
  dateKey: string;
  items: [string, string, string];
  statuses: [Status, Status, Status];
  note: string;
  mood: string | null;
  createdAt: string;
  updatedAt: string;
}

export function createEmptyDailyEntry(dateKey: string, now = new Date()): DailyEntry {
  const timestamp = now.toISOString();
  return {
    dateKey,
    items: ["", "", ""],
    statuses: ["not_started", "not_started", "not_started"],
    note: "",
    mood: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function normalizeItems(items: string[]): [string, string, string] {
  return [
    (items[0] ?? "").trim(),
    (items[1] ?? "").trim(),
    (items[2] ?? "").trim(),
  ];
}

