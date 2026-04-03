export const REMINDER_TIMEZONE = "Asia/Shanghai";
export const PRIMARY_REMINDER_SLOT_ID = "5";
export const PRIMARY_REMINDER_TIME = "19:00";
export const PRIMARY_REMINDER_PATH = `/reminder/${PRIMARY_REMINDER_SLOT_ID}`;
export const REMINDER_APPLICATION_NAME = "Three Moves";
export const REMINDER_NOTIFICATION_TITLE = "Three Moves 提醒";
export const REMINDER_INSTALL_ID_STORAGE_KEY = "three-moves-webapp:reminder-install-id:v1";
export const REMINDER_SUBSCRIPTION_INDEX_KEY = "three-moves-webapp:reminders:index:v1";

export function getReminderPublicVapidKey() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
}

export function getReminderPrivateVapidKey() {
  return process.env.VAPID_PRIVATE_KEY ?? "";
}

export function getReminderSubject() {
  return process.env.VAPID_SUBJECT ?? "mailto:hello@example.com";
}
