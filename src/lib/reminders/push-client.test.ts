import { describe, expect, it } from "vitest";
import { base64ToUint8Array } from "./push-client";

describe("base64ToUint8Array", () => {
  it("converts a url-safe base64 public key into bytes", () => {
    const bytes = base64ToUint8Array("BEl1bW15X3B1YmxpY19rZXk");
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(0);
  });
});
