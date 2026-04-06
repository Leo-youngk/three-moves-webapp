import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const assertAuthorizedReminderDispatch = vi.fn();
  const createReminderSubscriptionStore = vi.fn();
  const createWebPushReminderTransport = vi.fn();

  return {
    assertAuthorizedReminderDispatch,
    createReminderSubscriptionStore,
    createWebPushReminderTransport,
  };
});

vi.mock("@/lib/platform/scheduler-adapter", () => ({
  assertAuthorizedReminderDispatch: mocks.assertAuthorizedReminderDispatch,
}));

vi.mock("@/lib/reminders/server-store", async () => {
  const actual = await vi.importActual<typeof import("@/lib/reminders/server-store")>(
    "@/lib/reminders/server-store",
  );

  return {
    ...actual,
    createReminderSubscriptionStore: mocks.createReminderSubscriptionStore,
  };
});

vi.mock("@/lib/reminders/transport", () => ({
  createWebPushReminderTransport: mocks.createWebPushReminderTransport,
}));

import { GET } from "./route";

const originalEnv = {
  ...process.env,
};

afterEach(() => {
  process.env = { ...originalEnv };
  vi.clearAllMocks();
});

describe("reminder dispatch route", () => {
  it("returns structured JSON when dispatch setup fails", async () => {
    mocks.assertAuthorizedReminderDispatch.mockReturnValue(null);
    mocks.createReminderSubscriptionStore.mockReturnValue({
      loadIndex: vi.fn().mockRejectedValue(new Error("CloudBase unavailable")),
      saveIndex: vi.fn(),
    });
    mocks.createWebPushReminderTransport.mockReturnValue({
      send: vi.fn(),
    });

    const response = await GET(new Request("https://example.com/api/reminders/send?slot=19-00"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      success: false,
      slot: "19-00",
      sent: [],
      errors: [
        {
          reason: "dispatch-failed",
          message: "CloudBase unavailable",
        },
      ],
    });
    expect(body.error).toBeUndefined();
  });
});
