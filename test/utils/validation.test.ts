import { describe, it, expect } from "vitest";
import { describeValidationValue, formatValidationContextValue } from "../../src/utils/validation";

describe("Validation utilities", () => {
  it("should redact sensitive information in describeValidationValue", () => {
    const sensitiveData = {
      username: "jdoe",
      password: "supersecretpassword",
      apiToken: "1234567890abcdef",
      accessToken: "abc1234",
      secretKey: "shhh",
      credentials: "user:pass",
      normalField: "visible",
    };

    const described = describeValidationValue(sensitiveData);

    // Should contain the normal field
    expect(described).toContain('"normalField":"visible"');

    // Should redact sensitive fields
    expect(described).toContain('"password":"[REDACTED]"');
    expect(described).toContain('"apiToken":"[REDACTED]"');
    expect(described).toContain('"accessToken":"[REDACTED]"');
    expect(described).toContain('"secretKey":"[REDACTED]"');
    expect(described).toContain('"credentials":"[REDACTED]"');

    // Should not contain sensitive values
    expect(described).not.toContain("supersecretpassword");
    expect(described).not.toContain("1234567890abcdef");
    expect(described).not.toContain("abc1234");
    expect(described).not.toContain("shhh");
    expect(described).not.toContain("user:pass");
  });

  it("should redact sensitive information in formatValidationContextValue", () => {
    const sensitiveData = {
      key: "ssh-rsa AAAAB3NzaC1yc2...",
    };

    const formatted = formatValidationContextValue(sensitiveData);
    expect(formatted).toContain('"key":"[REDACTED]"');
    expect(formatted).not.toContain("ssh-rsa");
  });

  it("should format normal values correctly", () => {
    expect(formatValidationContextValue("hello")).toBe('"hello"');
    expect(formatValidationContextValue(123)).toBe("123");
    expect(formatValidationContextValue(true)).toBe("true");
    expect(formatValidationContextValue(null)).toBe("null");
    expect(formatValidationContextValue(undefined)).toBe("undefined");
    expect(formatValidationContextValue({ a: 1 })).toBe('{"a":1}');
  });
});
