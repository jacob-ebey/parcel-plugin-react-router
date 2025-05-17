import { test, expect } from "@playwright/test";

test("client component route with loader can return RSC", async ({ page }) => {
  await page.goto("/fixture/server-component");

  await expect(page.getByText("From the loader.")).toBeVisible();
  await expect(page.getByText("From the component.")).toBeVisible();
});
