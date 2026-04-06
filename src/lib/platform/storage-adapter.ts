import { getCloudBaseApp } from "./cloudbase-client";
import type { ReminderSubscriptionIndex, ReminderSubscriptionRecord } from "../reminders/types";

export interface ReminderSubscriptionStorageAdapter {
  loadIndex(): Promise<ReminderSubscriptionIndex>;
  saveIndex(index: ReminderSubscriptionIndex): Promise<void>;
}

const REMINDER_SUBSCRIPTION_COLLECTION = "tm_reminder_subs";
const REMINDER_SUBSCRIPTION_DOC_ID = "current";

let ensureCollectionPromise: Promise<void> | null = null;

function createEmptyReminderSubscriptionIndex(): ReminderSubscriptionIndex {
  return {
    version: 1,
    subscriptions: {},
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isSubscriptionRecord(value: unknown): value is ReminderSubscriptionRecord {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.installId === "string" &&
    typeof value.slotId === "string" &&
    typeof value.timezone === "string" &&
    typeof value.endpoint === "string" &&
    isRecord(value.keys) &&
    typeof value.keys.p256dh === "string" &&
    typeof value.keys.auth === "string" &&
    (typeof value.expirationTime === "number" || value.expirationTime === null) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    (typeof value.revokedAt === "string" || value.revokedAt === null) &&
    (typeof value.lastSentDateKey === "string" || value.lastSentDateKey === null || typeof value.lastSentDateKey === "undefined")
  );
}

function indexToCloudBaseDocument(index: ReminderSubscriptionIndex) {
  return {
    subscriptions: Object.values(index.subscriptions),
    updatedAt: new Date().toISOString(),
  };
}

function cloudBaseDocumentToIndex(value: unknown): ReminderSubscriptionIndex {
  if (!isRecord(value)) {
    return createEmptyReminderSubscriptionIndex();
  }

  const subscriptions = value.subscriptions;
  if (Array.isArray(subscriptions)) {
    return {
      version: 1,
      subscriptions: subscriptions.filter(isSubscriptionRecord).reduce<Record<string, ReminderSubscriptionRecord>>(
        (accumulator, subscription) => {
          accumulator[subscription.installId] = subscription;
          return accumulator;
        },
        {},
      ),
    };
  }

  if (isRecord(subscriptions)) {
    return {
      version: 1,
      subscriptions: Object.entries(subscriptions).reduce<Record<string, ReminderSubscriptionRecord>>(
        (accumulator, [installId, subscription]) => {
          if (isSubscriptionRecord(subscription)) {
            accumulator[installId] = subscription;
          }
          return accumulator;
        },
        {},
      ),
    };
  }

  return createEmptyReminderSubscriptionIndex();
}

async function ensureReminderSubscriptionCollection() {
  if (!ensureCollectionPromise) {
    ensureCollectionPromise = (async () => {
      try {
        const app = getCloudBaseApp();
        await app.database().createCollection(REMINDER_SUBSCRIPTION_COLLECTION);
      } catch {
        // Best effort: if the collection already exists or the SDK user cannot create it,
        // subsequent reads/writes will still work when the collection is present.
      }
    })();
  }

  return ensureCollectionPromise;
}

async function loadReminderSubscriptionIndexFromCloudBase(): Promise<ReminderSubscriptionIndex> {
  await ensureReminderSubscriptionCollection();

  const app = getCloudBaseApp();
  const db = app.database();
  const response = await db.collection(REMINDER_SUBSCRIPTION_COLLECTION).doc(REMINDER_SUBSCRIPTION_DOC_ID).get();
  const document = Array.isArray(response?.data) ? response.data[0] : null;

  if (!document) {
    const emptyIndex = createEmptyReminderSubscriptionIndex();
    await saveReminderSubscriptionIndexToCloudBase(emptyIndex);
    return emptyIndex;
  }

  const index = cloudBaseDocumentToIndex(document);
  const normalizedDocument = indexToCloudBaseDocument(index);

  if (!isRecord(document.subscriptions) || !document.updatedAt) {
    await db.collection(REMINDER_SUBSCRIPTION_COLLECTION).doc(REMINDER_SUBSCRIPTION_DOC_ID).set(normalizedDocument);
  }

  return index;
}

async function saveReminderSubscriptionIndexToCloudBase(index: ReminderSubscriptionIndex): Promise<void> {
  await ensureReminderSubscriptionCollection();

  const app = getCloudBaseApp();
  const db = app.database();
  await db.collection(REMINDER_SUBSCRIPTION_COLLECTION).doc(REMINDER_SUBSCRIPTION_DOC_ID).set(indexToCloudBaseDocument(index));
}

export function createReminderSubscriptionStorageAdapter(): ReminderSubscriptionStorageAdapter {
  return {
    loadIndex: loadReminderSubscriptionIndexFromCloudBase,
    saveIndex: saveReminderSubscriptionIndexToCloudBase,
  };
}

export { createEmptyReminderSubscriptionIndex, cloudBaseDocumentToIndex as normalizeReminderSubscriptionIndex };
