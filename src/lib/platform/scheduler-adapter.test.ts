import { afterEach, describe, expect, it } from "vitest";
import { assertAuthorizedReminderDispatch, isAuthorizedReminderDispatch } from "./scheduler-adapter";

const originalEnv = {
  ...process.env,
};

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("scheduler adapter", () => {
  it("allows reminder dispatch when no secret is configured", () => {
    delete process.env.REMINDER_DISPATCH_SECRET;
    delete process.env.SCF_TIMER_SECRET;

    const request = new Request("https://example.com/api/reminders/send");
    expect(isAuthorizedReminderDispatch(request)).toBe(true);
    expect(assertAuthorizedReminderDispatch(request)).toBeNull();
  });

  it("rejects reminder dispatch when the secret does not match", () => {
    process.env.REMINDER_DISPATCH_SECRET = "abc123";

    const request = new Request("https://example.com/api/reminders/send");
    expect(isAuthorizedReminderDispatch(request)).toBe(false);
    expect(assertAuthorizedReminderDispatch(request)?.status).toBe(401);
  });

  it("accepts reminder dispatch when the header secret matches", () => {
    process.env.REMINDER_DISPATCH_SECRET = "abc123";

    const request = new Request("https://example.com/api/reminders/send", {
      headers: {
        "x-three-moves-dispatch-secret": "abc123",
      },
    });

    expect(isAuthorizedReminderDispatch(request)).toBe(true);
    expect(assertAuthorizedReminderDispatch(request)).toBeNull();
  });
});
