import { PRIMARY_REMINDER_PATH } from "@/lib/reminders/config";

export const NAV_ITEMS = [
  { href: "/", label: "Today" },
  { href: PRIMARY_REMINDER_PATH, label: "Reminder" },
  { href: "/night", label: "Night" },
  { href: "/history", label: "History" },
] as const;
