import { PRIMARY_REMINDER_TIME, REMINDER_NOTIFICATION_TITLE } from "./config";
import { getReminderNotificationUrl } from "./domains";
import type { ReminderNotificationPayload } from "./types";

export { PRIMARY_REMINDER_SLOT_ID } from "./config";

export function buildReminderNotification({
  slotId,
  dateKey,
  todayItems,
}: {
  slotId: string;
  dateKey: string;
  todayItems: string[];
}): ReminderNotificationPayload {
  const filledItems = todayItems.map((item) => item.trim()).filter(Boolean);
  const body =
    filledItems.length > 0
      ? `${PRIMARY_REMINDER_TIME} 了，今天的三件事还在这里：${filledItems.slice(0, 3).join(" / ")}。`
      : `${PRIMARY_REMINDER_TIME} 了，打开 Three Moves，把今天最重要的三件事补上。`;

  return {
    title: REMINDER_NOTIFICATION_TITLE,
    body,
    url: getReminderNotificationUrl(slotId),
    tag: `three-moves-reminder:${dateKey}:${slotId}`,
  };
}
