import {
  FIXED_REMINDER_PATH,
  FIXED_REMINDER_SLOT_ID,
  PRIMARY_REMINDER_PATH,
  PRIMARY_REMINDER_SLOT_ID,
  REMINDER_TIMEZONE,
} from "./config";
import type { ReminderSubscriptionIndex } from "./types";

export function getDateKeyInTimeZone(date: Date, timeZone: string = REMINDER_TIMEZONE) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  return `${year}-${month}-${day}`;
}

export function getReminderNotificationUrl(slotId: string) {
  if (slotId === FIXED_REMINDER_SLOT_ID) {
    return FIXED_REMINDER_PATH;
  }

  return slotId === PRIMARY_REMINDER_SLOT_ID ? PRIMARY_REMINDER_PATH : `/reminder/${slotId}`;
}

export function listActiveReminderSubscriptionsForSlot(
  index: ReminderSubscriptionIndex,
  slotId: string,
) {
  return Object.values(index.subscriptions).filter(
    (subscription) => subscription.revokedAt === null && subscription.slotId === slotId,
  );
}
