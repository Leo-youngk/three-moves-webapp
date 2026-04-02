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
    question: "我此刻正在通过我正在做的事，来逃避什么？",
  },
  {
    id: "2",
    label: "Midday",
    time: "10:30",
    question: "如果有人拍下我过去两个小时的行为，他会得出什么结论：我到底想从人生中得到什么？",
  },
  {
    id: "3",
    label: "Afternoon",
    time: "13:30",
    question: "我是在朝我厌恶的人生前进，还是在朝我想要的人生前进？",
  },
  {
    id: "4",
    label: "Late Afternoon",
    time: "16:30",
    question: "我正在假装不重要、但其实最重要的那件事是什么？",
  },
  {
    id: "5",
    label: "Evening",
    time: "19:30",
    question: "我今天做的哪些事，是出于保护自我认同，而不是真实的渴望？",
  },
  {
    id: "6",
    label: "Night",
    time: "21:00",
    question: "我今天什么时候最有生命力？什么时候最麻木？",
  },
];

export function getReminderSlot(slotId: string | undefined): ReminderSlot {
  return REMINDER_SLOTS.find((slot) => slot.id === slotId) ?? REMINDER_SLOTS[0];
}

