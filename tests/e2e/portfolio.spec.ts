import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("filters, settled counts, URL restoration and empty state", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("searchbox", { name: "Search projects" }).fill("blood");
  await expect(page.locator("#projects .project-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Data Applications", exact: true })
    .click();
  await expect(page).toHaveURL(/category=data-applications/);
  await page.reload();
  await expect(page.getByRole("searchbox")).toHaveValue("blood");
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await page.getByRole("button", { name: "Analytics", exact: true }).click();
  await page.locator(".tool-filter summary").click();
  await page.getByRole("button", { name: "Django", exact: true }).click();
  await expect(page.getByText("No projects match these filters")).toBeVisible();
  await page.goBack();
  await expect(page.locator("#projects .project-card")).toHaveCount(1);
  await page.goForward();
  await expect(page.locator("#projects .project-card")).toHaveCount(0);
});
test("motion preference, workflow, clipboard denial and contact links", async ({
  page,
}) => {
  await page.goto("./");
  await page.locator(".motion-menu summary").click();
  await page.getByRole("radio", { name: "Reduced", exact: true }).check();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.getByRole("button", { name: "Run demo" }).click();
  await expect(
    page.getByText("Record D07 has no value.", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("Sample issue").selectOption("duplicate");
  await page.getByRole("button", { name: "Run demo" }).click();
  await expect(
    page.getByText("The second D12 repeats an ID.", { exact: false }),
  ).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
    });
  });
  await page.getByRole("button", { name: "Copy email" }).click();
  await expect(
    page.getByText("Copy unavailable.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.locator('a[href="mailto:pandeybadrinath9@gmail.com"]'),
  ).toBeVisible();
  await expect(
    page.locator('a[href="https://github.com/Badrinath960"]'),
  ).toBeVisible();
});
test("keyboard menu, Escape and focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const trigger = page.getByRole("button", { name: "Menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Projects", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
test("static fallback, no JavaScript content and draft routes", async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto(process.env.TEST_BASE_URL || "http://127.0.0.1:3001/");
  await expect(staticPage.locator("h1")).toContainText("Turning complex");
  await expect(staticPage.locator(".project-card")).toHaveCount(4);
  await expect(
    staticPage.getByRole("heading", { name: "Collect", exact: false }),
  ).toBeVisible();
  await expect(staticPage.locator(".sculpture-poster")).toBeVisible();
  await context.close();
  expect((await page.goto("./work/raktkadi"))?.status()).toBe(404);
  expect((await page.goto("./work/unknown"))?.status()).toBe(404);
  await page.goto("./resume/");
  await expect(
    page.getByRole("heading", { name: "Badrinath Pandey", exact: true }),
  ).toBeVisible();
});
test("OS changes and storage failure keep motion controls functional", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("blocked");
    };
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await page.locator(".motion-menu summary").click();
  await page.getByRole("radio", { name: "Reduced", exact: true }).check();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
});
test("responsive screenshots, overflow, axe and console health", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./");
    await expect(page.locator("html")).toHaveAttribute(
      "data-motion",
      "reduced",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/portfolio-${width}.png`,
      fullPage: true,
    });
  }
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    ),
  ).toEqual([]);
  expect(errors).toEqual([]);
});
test("WebGL context loss and reduced mode remove canvas without losing content", async ({
  page,
}) => {
  await page.goto("./");
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible({ timeout: 20000 });
  await canvas.evaluate((el) =>
    el.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
  );
  await expect(canvas).toHaveCount(0);
  await expect(page.locator(".sculpture-poster")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore my work" }),
  ).toBeVisible();
});
test("full motion story reverses and tears down pinning", async ({ page }) => {
  await page.goto("./");
  await page.locator("#step-automate").scrollIntoViewIfNeeded();
  await expect(page.locator(".graphic-stages a[aria-current]")).toHaveText(
    "Automate",
  );
  await page.locator("#step-collect").scrollIntoViewIfNeeded();
  await expect(page.locator(".graphic-stages a[aria-current]")).toHaveText(
    "Collect",
  );
  await page.locator(".motion-menu summary").click();
  await page.getByRole("radio", { name: "Reduced", exact: true }).check();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("#step-automate h3")).toBeVisible();
});
