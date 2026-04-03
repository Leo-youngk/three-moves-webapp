import { describe, expect, it } from "vitest";
import {
  createReminderSubscriptionIndex,
  listActiveReminderSubscriptions,
  upsertReminderSubscription,
} from "./server-store";

describe("reminder subscription store", () => {
  it("stores one active subscription per install id", () => {
    const initial = createReminderSubscriptionIndex();
    const next = upsertReminderSubscription(initial, {
      installId: "abc",
      slotId: "5",
      timezone: "Asia/Shanghai",
      endpoint: "https://example.com",
      keys: { p256dh: "p256", auth: "auth" },
      expirationTime: null,
      createdAt: "2026-04-03T11:00:00.000Z",
      updatedAt: "2026-04-03T11:00:00.000Z",
      revokedAt: null,
    });

    expect(listActiveReminderSubscriptions(next)).toHaveLength(1);
  });
});
