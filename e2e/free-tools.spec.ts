import { expect, test } from "@playwright/test";
import { tools } from "../src/features/tools/data/catalog";
import { REGISTERED_TOOL_SLUGS } from "../src/features/tools/data/registered-slugs";

test.describe("free tools (no login)", () => {
  test("tools index lists free tools without redirecting to login", async ({ page }) => {
    const response = await page.goto("/tools");
    expect(response?.ok()).toBeTruthy();
    await expect(page).not.toHaveURL(/login|admin|auth/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/word counter/i).first()).toBeVisible();
  });

  for (const slug of REGISTERED_TOOL_SLUGS) {
    const tool = tools.find((entry) => entry.slug === slug);
    test(`${slug} loads and renders without login`, async ({ page }) => {
      expect(tool, `missing catalog entry for ${slug}`).toBeTruthy();
      const response = await page.goto(`/tools/${slug}`);
      expect(response?.status()).toBeLessThan(400);
      await expect(page).not.toHaveURL(/login|admin|auth/i);
      await expect(page.getByRole("heading", { name: tool!.title })).toBeVisible();
      await expect(page.getByText("This tool is not implemented yet.")).toHaveCount(0);
      await expect(page.locator("main")).toBeVisible();
    });
  }

  test("word counter updates counts without login", async ({ page }) => {
    await page.goto("/tools/word-counter");
    await page.locator("textarea").first().fill("hello world from oshaka");
    await expect(page.getByText("Words", { exact: true })).toBeVisible();
    await expect(page.getByText("4", { exact: true }).first()).toBeVisible();
  });

  test("json formatter pretty-prints without login", async ({ page }) => {
    await page.goto("/tools/json-formatter");
    await page.locator("textarea").first().fill('{"a":1,"b":2}');
    await page.getByRole("button", { name: "Pretty print" }).click();
    await expect(page.locator("textarea").nth(1)).toHaveValue(/"a": 1/);
  });

  test("salary calculator computes without login", async ({ page }) => {
    await page.goto("/tools/salary-calculator");
    await expect(page.getByRole("heading", { name: "Salary Calculator" })).toBeVisible();
    await expect(page.getByText("EPF employee", { exact: true })).toBeVisible();
    await expect(page.getByText("8000", { exact: true }).first()).toBeVisible();
  });
});
