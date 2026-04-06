import type {
  ReminderNotificationPayload,
  ReminderSubscriptionIndex,
  ReminderSubscriptionKeys,
  ReminderSubscriptionRecord,
} from "./types";

export interface ReminderSubscriptionStore {
  loadIndex(): Promise<ReminderSubscriptionIndex>;
  saveIndex(index: ReminderSubscriptionIndex): Promise<void>;
}

export interface ReminderPushTarget {
  endpoint: string;
  keys: ReminderSubscriptionKeys;
  expirationTime: number | null;
}

export interface ReminderPushTransport {
  send(target: ReminderPushTarget, payload: ReminderNotificationPayload): Promise<void>;
}

export type { ReminderNotificationPayload, ReminderSubscriptionIndex, ReminderSubscriptionRecord };
