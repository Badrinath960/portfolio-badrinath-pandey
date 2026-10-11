import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("ProVision links, resume layout and print document", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  const project = page.locator("#projects .project-card").first();
  await expect(project).toContainText("ProVision");
  await expect(
    project.getByRole("link", { name: "Repository" }),
  ).toHaveAttribute("href", "https://github.com/Badrinath960/provision");
  await expect(
    project.getByRole("link", { name: "Live demo" }),
  ).toHaveAttribute("href", "https://provision-two.vercel.app/");
  await page
    .locator("#projects")
    .screenshot({ path: "test-results/projects-desktop.png" });
  await page.getByRole("link", { name: "Résumé", exact: true }).first().click();
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/resume-${width}.png`,
      fullPage: true,
    });
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact || ""),
      ),
    ).toEqual([]);
  }
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  await expect(page.locator(".resume-toolbar")).toBeHidden();
  await expect(page.locator(".header")).toBeHidden();
  await page.pdf({
    path: "test-results/resume-print.pdf",
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  expect(errors).toEqual([]);
});

test("browser-injected root class does not cause hydration warnings", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.route("**/*", async (route) => {
    if (route.request().resourceType() !== "document") return route.continue();
    const response = await route.fetch();
    await route.fulfill({
      response,
      body: (await response.text()).replace(
        '<html lang="en"',
        '<html class="hydrated" lang="en"',
      ),
    });
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.getByRole("searchbox").fill("provision");
  await expect(page.locator("#projects .project-card")).toHaveCount(1);
  expect(errors).toEqual([]);
});
