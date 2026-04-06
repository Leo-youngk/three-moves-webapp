import { afterEach, describe, expect, it } from "vitest";
import {
  getCloudBaseApiKey,
  getCloudBaseEnvId,
  getReminderDispatchSecret,
} from "./env";

const originalEnv = {
  ...process.env,
};

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("platform env", () => {
  it("defaults the cloudbase env id to the china production environment", () => {
    delete process.env.CLOUDBASE_ENV_ID;
    expect(getCloudBaseEnvId()).toBe("three-moves-cn-prod-1c372186c953");
  });

  it("reads an explicit cloudbase env id and api key", () => {
    process.env.CLOUDBASE_ENV_ID = "custom-env";
    process.env.CLOUDBASE_APIKEY = "cloudbase-key";

    expect(getCloudBaseEnvId()).toBe("custom-env");
    expect(getCloudBaseApiKey()).toBe("cloudbase-key");
  });

  it("reads the reminder dispatch secret from timer or explicit env vars", () => {
    delete process.env.REMINDER_DISPATCH_SECRET;
    process.env.SCF_TIMER_SECRET = "timer-secret";

    expect(getReminderDispatchSecret()).toBe("timer-secret");
    process.env.REMINDER_DISPATCH_SECRET = "dispatch-secret";
    expect(getReminderDispatchSecret()).toBe("dispatch-secret");
  });
});
