import { describe, it, expect } from "vitest";
import { JwtToken } from "../utils/JwtToken";

describe("JwtToken", () => {
  const manager = new JwtToken();

  it("should sign a paylaod and verify it successfully", () => {
    const payload = { id: "user_100", admin: false };

    const token = manager.generate(payload);
    expect(typeof token).toBe("string");

    const decoded = manager.verify(token);
    expect(decoded.id).toBe("user_100");
    expect(decoded.admin).toBe(false);
  });
});
