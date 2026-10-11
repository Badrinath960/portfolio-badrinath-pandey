import { chromium } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";
const browser = await chromium.launch({ channel: "msedge", headless: true });
await mkdir("docs/qa", { recursive: true });
const results = { browser: browser.version(), routes: {} };
for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  const page = await browser.newPage({
    viewport,
    reducedMotion: viewport.width < 500 ? "reduce" : "no-preference",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const responses = [];
  page.on("response", (r) => responses.push(r));
  await page.goto("http://127.0.0.1:3001/");
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `docs/qa/hero-${viewport.width}.png` });
  const resources = [];
  for (const r of responses) {
    const url = r.url();
    if (!url.includes("127.0.0.1")) continue;
    try {
      const b = await r.body();
      resources.push({
        path: new URL(url).pathname,
        bytes: b.length,
        gzip: gzipSync(b).length,
      });
    } catch {}
  }
  const links = await page
    .locator("a")
    .evaluateAll((els) =>
      els.map((a) => ({ href: a.getAttribute("href"), label: a.textContent })),
    );
  const brokenAnchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((els) =>
      els
        .filter(
          (a) => !document.getElementById(a.getAttribute("href").slice(1)),
        )
        .map((a) => a.getAttribute("href")),
    );
  results.routes[viewport.width] = { errors, resources, links, brokenAnchors };
  await page.close();
}
await writeFile("docs/qa/resources.json", JSON.stringify(results, null, 2));
for (const width of [320, 390, 768, 1024, 1440]) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  await page.goto("http://127.0.0.1:3001/");
  await page.locator('html[data-motion="reduced"]').waitFor();
  await page.screenshot({
    path: `docs/qa/portfolio-${width}-reduced.png`,
    fullPage: true,
  });
  await page.close();
}
const full = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await full.goto("http://127.0.0.1:3001/");
await full.locator("#step-analyze").scrollIntoViewIfNeeded();
await full.waitForTimeout(500);
await full.screenshot({ path: "docs/qa/story-desktop.png" });
await full.close();
await browser.close();
console.log(
  "Saved hero screenshots, resource sizes, links and console diagnostics.",
);
