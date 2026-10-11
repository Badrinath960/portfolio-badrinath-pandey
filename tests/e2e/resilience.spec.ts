import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("failed deferred scene chunk preserves SVG and contact", async ({
  page,
}) => {
  let blocked = 0;
  await page.route(
    /\/_next\/static\/chunks\/[a-z0-9]+\.[a-f0-9]+\.js$/,
    (route) => {
      blocked++;
      return route.abort();
    },
  );
  await page.goto("./");
  await expect.poll(() => blocked).toBeGreaterThan(0);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".sculpture-poster")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Get in touch", exact: true }),
  ).toBeVisible();
});

test("WebGL unavailable preserves readable fallback", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      (window as typeof window & { attemptedWebGL: boolean }).attemptedWebGL =
        true;
      if (
        type === "webgl" ||
        type === "webgl2" ||
        type === "experimental-webgl"
      )
        return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("./");
  await expect
    .poll(() =>
      page.evaluate(() =>
        Boolean(
          (window as typeof window & { attemptedWebGL?: boolean })
            .attemptedWebGL,
        ),
      ),
    )
    .toBe(true);
  await expect(
    page.getByRole("button", { name: "Explore visualization" }),
  ).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".sculpture-poster")).toBeVisible();
  await expect(page.locator("h1")).toContainText("Turning complex");
});

test("mobile and data-saver visits do not download or mount the 3D scene", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    }),
  );
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await expect(
    page.getByRole("button", { name: "Explore visualization" }),
  ).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".sculpture-poster")).toBeVisible();
});

test("canvas stops drawing offscreen, paused, and when document is hidden", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const scope = window as typeof window & { draws: number };
    scope.draws = 0;
    const original = WebGL2RenderingContext.prototype.drawElementsInstanced;
    WebGL2RenderingContext.prototype.drawElementsInstanced = function (
      ...args
    ) {
      scope.draws++;
      return original.apply(this, args);
    };
  });
  await page.goto("./");
  await expect(page.locator("canvas")).toBeVisible();
  const draws = () =>
    page.evaluate(() => (window as typeof window & { draws: number }).draws);
  await expect.poll(draws).toBeGreaterThan(2);
  await page.locator(".motion-menu summary").click();
  await page.getByRole("button", { name: "Pause animation" }).click();
  await page.waitForTimeout(150);
  const paused = await draws();
  await page.waitForTimeout(250);
  expect(await draws()).toBe(paused);
  await page.getByRole("button", { name: "Resume animation" }).click();
  await expect.poll(draws).toBeGreaterThan(paused);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const offscreen = await draws();
  await page.waitForTimeout(250);
  expect(await draws()).toBe(offscreen);
  await page.locator("h1").scrollIntoViewIfNeeded();
  await expect.poll(draws).toBeGreaterThan(offscreen);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(150);
  const hidden = await draws();
  await page.waitForTimeout(250);
  expect(await draws()).toBe(hidden);
});

test("story geometry transforms, reverses and does not accumulate pins on navigation", async ({
  page,
}) => {
  await page.goto("./");
  await page.locator("#step-automate").scrollIntoViewIfNeeded();
  await expect(page.locator(".morph-workflow")).toHaveCSS("opacity", "1");
  await page.locator("#step-collect").scrollIntoViewIfNeeded();
  await expect(page.locator(".morph-workflow")).toHaveCSS("opacity", "0");
  for (let i = 0; i < 2; i++) {
    await page
      .getByRole("link", { name: "Résumé", exact: true })
      .first()
      .click();
    await expect(page.locator("h1")).toHaveText("Badrinath Pandey");
    await page.getByRole("link", { name: "Back to portfolio" }).click();
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
    await expect(page.locator("canvas")).toHaveCount(1);
  }
});

test("400 percent equivalent reflow, text spacing, mobile axe and preview metadata", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await page.addStyleTag({
    content:
      "*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Menu" }).click();
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    ),
  ).toEqual([]);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    process.env.TEST_BASE_URL?.includes("3002")
      ? "index, follow"
      : "noindex, nofollow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(
    process.env.TEST_BASE_URL?.includes("3002") ? 1 : 0,
  );
  const response = await page.request.get("./opengraph-image");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
});
