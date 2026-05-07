import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3400";

test("home renders with hero", async ({ page }) => {
  await page.goto(BASE);
  await expect(page.locator("h1")).toContainText("storybook", { ignoreCase: true });
});

test("pricing page lists 3 tiers", async ({ page }) => {
  await page.goto(`${BASE}/pricing`);
  await expect(page.locator("h3", { hasText: "Free" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "Premium" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "Printed Book" })).toBeVisible();
});

test("login page has email input + magic-link form", async ({ page }) => {
  await page.goto(`${BASE}/login`);
  await expect(page.locator("input[name=email]")).toBeVisible();
  await expect(page.locator("button[type=submit]")).toContainText("sign-in link", { ignoreCase: true });
});

test("studio is gated", async ({ page }) => {
  await page.goto(`${BASE}/studio`);
  // Without ink_session cookie, middleware redirects to /login
  await expect(page).toHaveURL(/\/login/);
});

test("portal is gated", async ({ page }) => {
  await page.goto(`${BASE}/portal`);
  await expect(page).toHaveURL(/\/login/);
});
