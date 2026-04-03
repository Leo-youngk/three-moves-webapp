import {
  PRIMARY_REMINDER_PATH,
  PRIMARY_REMINDER_SLOT_ID,
  PRIMARY_REMINDER_TIME,
} from "@/lib/reminders/config";

export interface ReminderSlot {
  id: string;
  label: string;
  time: string;
  question: string;
}

export const REMINDER_SLOTS: ReminderSlot[] = [
  {
    id: "1",
    label: "Morning",
    time: "08:30",
    question: "我现在正在通过什么来逃避真正重要的事？",
  },
  {
    id: "2",
    label: "Midday",
    time: "10:30",
    question: "如果有人拍下我过去两个小时的行为，会看到什么模式？",
  },
  {
    id: "3",
    label: "Afternoon",
    time: "13:30",
    question: "我现在是在朝自己厌恶的生活前进，还是朝自己想要的生活前进？",
  },
  {
    id: "4",
    label: "Late Afternoon",
    time: "16:30",
    question: "我此刻假装不重要的那件事，真正重要吗？",
  },
  {
    id: "5",
    label: "Evening",
    time: "19:00",
    question: "我今天做的哪些事，是出于保护自我认同，而不是出于真实愿望？",
  },
  {
    id: "6",
    label: "Night",
    time: "21:00",
    question: "我今天什么时候最有生命力？什么时候最麻木？",
  },
];

export { PRIMARY_REMINDER_PATH, PRIMARY_REMINDER_SLOT_ID, PRIMARY_REMINDER_TIME };

export function getReminderSlot(slotId: string | undefined): ReminderSlot {
  return (
    REMINDER_SLOTS.find((slot) => slot.id === slotId) ??
    REMINDER_SLOTS.find((slot) => slot.id === PRIMARY_REMINDER_SLOT_ID) ??
    REMINDER_SLOTS[0]
  );
}
