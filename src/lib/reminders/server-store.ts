import {
  createEmptyReminderSubscriptionIndex,
  createReminderSubscriptionStorageAdapter,
} from "../platform/storage-adapter";
import type { ReminderSubscriptionStore } from "./providers";
import type {
  ReminderSubscriptionIndex,
  ReminderSubscriptionRecord,
} from "./types";

export function upsertReminderSubscription(
  index: ReminderSubscriptionIndex,
  subscription: ReminderSubscriptionRecord,
): ReminderSubscriptionIndex {
  const existing = index.subscriptions[subscription.installId];

  return {
    version: 1,
    subscriptions: {
      ...index.subscriptions,
      [subscription.installId]: {
        ...existing,
        ...subscription,
        createdAt: existing?.createdAt ?? subscription.createdAt,
        updatedAt: subscription.updatedAt,
        revokedAt: subscription.revokedAt ?? existing?.revokedAt ?? null,
      },
    },
  };
}

export function createReminderSubscriptionIndex(): ReminderSubscriptionIndex {
  return createEmptyReminderSubscriptionIndex();
}

export function listActiveReminderSubscriptions(index: ReminderSubscriptionIndex) {
  return Object.values(index.subscriptions).filter((subscription) => subscription.revokedAt === null);
}

export function revokeReminderSubscription(
  index: ReminderSubscriptionIndex,
  installId: string,
  revokedAt: string,
): ReminderSubscriptionIndex {
  const existing = index.subscriptions[installId];
  if (!existing) {
    return index;
  }

  return {
    version: 1,
    subscriptions: {
      ...index.subscriptions,
      [installId]: {
        ...existing,
        revokedAt,
        updatedAt: revokedAt,
      },
    },
  };
}

export function markReminderSubscriptionSent(
  index: ReminderSubscriptionIndex,
  installId: string,
  dateKey: string,
  sentAt: string,
): ReminderSubscriptionIndex {
  const existing = index.subscriptions[installId];
  if (!existing) {
    return index;
  }

  return {
    version: 1,
    subscriptions: {
      ...index.subscriptions,
      [installId]: {
        ...existing,
        lastSentDateKey: dateKey,
        updatedAt: sentAt,
      },
    },
  };
}

export function createReminderSubscriptionStore(): ReminderSubscriptionStore {
  return createReminderSubscriptionStorageAdapter();
}
