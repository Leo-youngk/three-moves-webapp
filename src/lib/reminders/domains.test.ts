import { describe, expect, it } from "vitest";
import { getDateKeyInTimeZone, getReminderNotificationUrl, listActiveReminderSubscriptionsForSlot } from "./domains";

describe("reminder domains", () => {
  it("formats a date key in the configured timezone", () => {
    const date = new Date("2026-04-03T12:00:00.000Z");

    expect(getDateKeyInTimeZone(date, "Asia/Shanghai")).toBe("2026-04-03");
  });

  it("maps the fixed reminder slot to the dedicated notification path", () => {
    expect(getReminderNotificationUrl("19-00")).toBe("/reminder/19-00");
    expect(getReminderNotificationUrl("5")).toBe("/reminder/5");
    expect(getReminderNotificationUrl("9")).toBe("/reminder/9");
  });

  it("filters active subscriptions for a specific slot", () => {
    const subscriptions = listActiveReminderSubscriptionsForSlot(
      {
        version: 1,
        subscriptions: {
          a: {
            installId: "a",
            slotId: "5",
            timezone: "Asia/Shanghai",
            endpoint: "https://example.com/a",
            keys: { p256dh: "p256", auth: "auth" },
            expirationTime: null,
            createdAt: "2026-04-03T11:00:00.000Z",
            updatedAt: "2026-04-03T11:00:00.000Z",
            revokedAt: null,
          },
          b: {
            installId: "b",
            slotId: "5",
            timezone: "Asia/Shanghai",
            endpoint: "https://example.com/b",
            keys: { p256dh: "p256", auth: "auth" },
            expirationTime: null,
            createdAt: "2026-04-03T11:00:00.000Z",
            updatedAt: "2026-04-03T11:00:00.000Z",
            revokedAt: "2026-04-03T11:30:00.000Z",
          },
          c: {
            installId: "c",
            slotId: "9",
            timezone: "Asia/Shanghai",
            endpoint: "https://example.com/c",
            keys: { p256dh: "p256", auth: "auth" },
            expirationTime: null,
            createdAt: "2026-04-03T11:00:00.000Z",
            updatedAt: "2026-04-03T11:00:00.000Z",
            revokedAt: null,
          },
        },
      },
      "5",
    );

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions[0]?.installId).toBe("a");
  });
});
