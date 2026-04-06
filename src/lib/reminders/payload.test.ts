import { describe, expect, it } from "vitest";
import { buildReminderNotification } from "./payload";

describe("buildReminderNotification", () => {
  it("builds a notification that opens the fixed reminder route", () => {
    const payload = buildReminderNotification({
      slotId: "19-00",
      dateKey: "2026-04-03",
      todayItems: ["A", "B", "C"],
    });

    expect(payload.title).toBe("Three Moves 提醒");
    expect(payload.body).toContain("19:00");
    expect(payload.url).toBe("/reminder/19-00");
  });

  it("keeps non-primary reminder routes stable", () => {
    const payload = buildReminderNotification({
      slotId: "9",
      dateKey: "2026-04-03",
      todayItems: [],
    });

    expect(payload.url).toBe("/reminder/9");
  });
});
