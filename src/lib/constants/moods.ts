export const MOODS = [
  { id: "calm", label: "平静", emoji: "🌿" },
  { id: "energized", label: "充沛", emoji: "⚡" },
  { id: "tired", label: "疲惫", emoji: "🌧" },
  { id: "focused", label: "专注", emoji: "🔥" },
] as const;

export type MoodId = (typeof MOODS)[number]["id"];

export function getMoodById(moodId: MoodId | null) {
  return MOODS.find((mood) => mood.id === moodId) ?? null;
}

