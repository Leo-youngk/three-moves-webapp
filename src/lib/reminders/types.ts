export interface ReminderSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface ReminderSubscriptionRecord {
  installId: string;
  slotId: string;
  timezone: string;
  endpoint: string;
  keys: ReminderSubscriptionKeys;
  expirationTime: number | null;
  createdAt: string;
  updatedAt: string;
  revokedAt: string | null;
  lastSentDateKey?: string | null;
}

export interface ReminderSubscriptionIndex {
  version: 1;
  subscriptions: Record<string, ReminderSubscriptionRecord>;
}

export interface ReminderNotificationPayload {
  title: string;
  body: string;
  url: string;
  tag: string;
}
