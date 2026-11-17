import { expect, test } from "@playwright/test";

test.describe("security surface", () => {
  test("admin area redirects anonymous users to login", async ({ page }) => {
    const response = await page.goto("/admin/dashboard");
    expect(response?.status()).toBeLessThan(500);
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("contact form is public and includes honeypot field", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Get in touch" })).toBeVisible();
    await expect(page.locator('input[name="company"]')).toHaveCount(1);
    await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
  });

  test("security headers are present on public pages", async ({ request }) => {
    const response = await request.get("/");
    expect(response.ok()).toBeTruthy();
    const headers = response.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  });
});
