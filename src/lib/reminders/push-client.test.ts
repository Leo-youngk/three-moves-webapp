import { describe, expect, it } from "vitest";
import { base64ToUint8Array, toReminderPushTarget } from "./push-client";

describe("base64ToUint8Array", () => {
  it("converts a url-safe base64 public key into bytes", () => {
    const bytes = base64ToUint8Array("BEl1bW15X3B1YmxpY19rZXk");
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(0);
  });

  it("maps a reminder subscription into a push target", () => {
    const target = toReminderPushTarget({
      installId: "abc",
      slotId: "5",
      timezone: "Asia/Shanghai",
      endpoint: "https://example.com",
      keys: { p256dh: "p256", auth: "auth" },
      expirationTime: 123,
      createdAt: "2026-04-03T11:00:00.000Z",
      updatedAt: "2026-04-03T11:00:00.000Z",
      revokedAt: null,
    });

    expect(target).toEqual({
      endpoint: "https://example.com",
      keys: { p256dh: "p256", auth: "auth" },
      expirationTime: 123,
    });
  });
});
