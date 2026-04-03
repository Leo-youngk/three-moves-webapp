import { describe, expect, it } from "vitest";
import { buildReminderNotification, PRIMARY_REMINDER_PATH, PRIMARY_REMINDER_SLOT_ID } from "./payload";

describe("buildReminderNotification", () => {
  it("builds a notification that opens the primary reminder route", () => {
    const payload = buildReminderNotification({
      slotId: PRIMARY_REMINDER_SLOT_ID,
      dateKey: "2026-04-03",
      todayItems: ["A", "B", "C"],
    });

    expect(payload.title).toBe("Three Moves 提醒");
    expect(payload.body).toContain("19:00");
    expect(payload.url).toBe(PRIMARY_REMINDER_PATH);
  });
});
