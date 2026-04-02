import { describe, expect, it } from "vitest";
import { toLocalDateKey } from "./date";

describe("toLocalDateKey", () => {
  it("formats a local date as YYYY-MM-DD", () => {
    const date = new Date(2026, 3, 2, 8, 15, 0);

    expect(toLocalDateKey(date)).toBe("2026-04-02");
  });
});

