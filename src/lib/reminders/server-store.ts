import { kv } from "@vercel/kv";
import { REMINDER_SUBSCRIPTION_INDEX_KEY } from "./config";
import type {
  ReminderSubscriptionIndex,
  ReminderSubscriptionRecord,
} from "./types";

export function createReminderSubscriptionIndex(): ReminderSubscriptionIndex {
  return {
    version: 1,
    subscriptions: {},
  };
}

function normalizeReminderSubscriptionIndex(value: unknown): ReminderSubscriptionIndex {
  if (
    !value ||
    typeof value !== "object" ||
    !("version" in value) ||
    (value as { version?: unknown }).version !== 1 ||
    !("subscriptions" in value) ||
    typeof (value as { subscriptions?: unknown }).subscriptions !== "object" ||
    Array.isArray((value as { subscriptions?: unknown }).subscriptions)
  ) {
    return createReminderSubscriptionIndex();
  }

  return {
    version: 1,
    subscriptions: (value as ReminderSubscriptionIndex).subscriptions,
  };
}

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

export async function loadReminderSubscriptionIndex(): Promise<ReminderSubscriptionIndex> {
  const stored = await kv.get<unknown>(REMINDER_SUBSCRIPTION_INDEX_KEY);
  return normalizeReminderSubscriptionIndex(stored);
}

export async function saveReminderSubscriptionIndex(index: ReminderSubscriptionIndex): Promise<void> {
  await kv.set(REMINDER_SUBSCRIPTION_INDEX_KEY, index);
}
