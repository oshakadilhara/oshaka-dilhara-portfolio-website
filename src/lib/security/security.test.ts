import { describe, expect, it, beforeEach } from "vitest";
import {
  escapeHtml,
  rateLimit,
  resetRateLimitBuckets,
  safeAdminNextPath,
  safeMarkdownPreview,
  sanitizeHref,
  sanitizePlainText,
} from "@/lib/security";

describe("security helpers", () => {
  beforeEach(() => {
    resetRateLimitBuckets();
  });

  it("escapes html and builds a safe markdown preview", () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;"
    );
    const preview = safeMarkdownPreview("# Hi\n<script>x</script>");
    expect(preview).toContain("<h1>Hi</h1>");
    expect(preview).not.toContain("<script>");
    expect(preview).toContain("&lt;script&gt;");
  });

  it("sanitizes hrefs and plain text", () => {
    expect(sanitizeHref("javascript:alert(1)")).toBeUndefined();
    expect(sanitizeHref("https://example.com")).toBe("https://example.com");
    expect(sanitizeHref("/about")).toBe("/about");
    expect(sanitizePlainText("  hello\u0000  ", 10)).toBe("hello");
  });

  it("blocks open redirects outside /admin", () => {
    expect(safeAdminNextPath("/admin/messages")).toBe("/admin/messages");
    expect(safeAdminNextPath("https://evil.test")).toBe("/admin/dashboard");
    expect(safeAdminNextPath("/admin/login")).toBe("/admin/dashboard");
    expect(safeAdminNextPath("//evil.test")).toBe("/admin/dashboard");
  });

  it("rate limits repeated keys", () => {
    expect(rateLimit("t", 2, 60_000).success).toBe(true);
    expect(rateLimit("t", 2, 60_000).success).toBe(true);
    expect(rateLimit("t", 2, 60_000).success).toBe(false);
  });
});
