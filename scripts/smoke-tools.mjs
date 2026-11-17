import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE", m.text());
});

await page.goto("http://127.0.0.1:3000/tools/word-counter", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1000);
await page.locator("textarea").first().fill("hello world from oshaka");
await page.waitForTimeout(300);
const stats = await page.evaluate(() => {
  const labels = [...document.querySelectorAll("p")];
  const idx = labels.findIndex((p) => p.textContent === "Words");
  return {
    words: labels[idx + 1]?.textContent,
    chars: labels[idx + 3]?.textContent,
    input: document.querySelector("textarea")?.value,
  };
});
console.log("wordCounter", JSON.stringify(stats));

await page.goto("http://127.0.0.1:3000/tools/json-formatter");
await page.locator("textarea").first().fill('{"a":1,"b":2}');
await page.getByRole("button", { name: "Pretty print" }).click();
await page.waitForTimeout(300);
const out = await page.locator("textarea").nth(1).inputValue();
console.log("jsonOut", JSON.stringify(out));

await browser.close();
