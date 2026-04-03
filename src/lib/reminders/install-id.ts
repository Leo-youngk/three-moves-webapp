import { REMINDER_INSTALL_ID_STORAGE_KEY } from "./config";

export interface ReminderInstallStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function createInstallId() {
  return globalThis.crypto?.randomUUID?.() ?? `reminder-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateReminderInstallId(storage: ReminderInstallStorageLike | null): string {
  if (!storage) {
    return createInstallId();
  }

  const existing = storage.getItem(REMINDER_INSTALL_ID_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const installId = createInstallId();
  storage.setItem(REMINDER_INSTALL_ID_STORAGE_KEY, installId);
  return installId;
}
