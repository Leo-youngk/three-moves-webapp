import { afterEach, describe, expect, it, vi } from "vitest";
import { createReminderSubscriptionStorageAdapter } from "./storage-adapter";

const originalEnv = {
  ...process.env,
};

const cloudbaseMocks = vi.hoisted(() => {
  const docGet = vi.fn();
  const docSet = vi.fn();
  const doc = vi.fn(() => ({
    get: docGet,
    set: docSet,
  }));
  const collection = vi.fn(() => ({
    doc,
  }));
  const createCollection = vi.fn(async () => undefined);
  const database = vi.fn(() => ({
    collection,
    createCollection,
  }));

  return {
    docGet,
    docSet,
    doc,
    collection,
    createCollection,
    database,
  };
});

vi.mock("./cloudbase-client", () => ({
  getCloudBaseApp: () => ({
    database: cloudbaseMocks.database,
  }),
  resetCloudBaseAppForTest: vi.fn(),
}));

afterEach(() => {
  process.env = { ...originalEnv };
  vi.clearAllMocks();
});

describe("storage adapter", () => {
  it("loads and saves the reminder subscription index through CloudBase SDK", async () => {
    cloudbaseMocks.docGet.mockResolvedValue({
      data: [
        {
          subscriptions: {
            alpha: {
              installId: "alpha",
              slotId: "19-00",
              timezone: "Asia/Shanghai",
              endpoint: "https://push.example.com/alpha",
              keys: { p256dh: "p256", auth: "auth" },
              expirationTime: null,
              createdAt: "2026-04-03T11:00:00.000Z",
              updatedAt: "2026-04-03T11:00:00.000Z",
              revokedAt: null,
            },
          },
          updatedAt: "2026-04-03T12:00:00.000Z",
        },
      ],
    });

    const adapter = createReminderSubscriptionStorageAdapter();
    const index = await adapter.loadIndex();
    await adapter.saveIndex(index);

    expect(index.version).toBe(1);
    expect(index.subscriptions.alpha?.installId).toBe("alpha");
    expect(cloudbaseMocks.collection).toHaveBeenCalledWith("tm_reminder_subs");
    expect(cloudbaseMocks.createCollection).toHaveBeenCalledWith("tm_reminder_subs");
    expect(cloudbaseMocks.doc).toHaveBeenCalledWith("current");
    expect(cloudbaseMocks.docSet).toHaveBeenCalledWith(
      expect.objectContaining({
        subscriptions: [
          expect.objectContaining({
            installId: "alpha",
            slotId: "19-00",
          }),
        ],
      }),
    );
  });
});
