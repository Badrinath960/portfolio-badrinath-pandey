import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
await mkdir("docs/qa", { recursive: true });
const reports = [];
for (let run = 1; run <= 3; run++) {
  const file = `docs/qa/lighthouse-${run}.json`;
  await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        "node_modules/lighthouse/cli/index.js",
        "http://127.0.0.1:3001/",
        "--chrome-flags=--headless=new",
        "--only-categories=performance,accessibility,best-practices,seo",
        "--output=json",
        `--output-path=${file}`,
        "--quiet",
      ],
      {
        env: {
          ...process.env,
          CHROME_PATH: "C:/Program Files/Google/Chrome/Application/chrome.exe",
        },
        stdio: "inherit",
        windowsHide: true,
      },
    );
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`Lighthouse exited ${code}`)),
    );
  });
  const r = JSON.parse(await readFile(file, "utf8"));
  const result = {
    run,
    version: r.lighthouseVersion,
    browser: r.environment.hostUserAgent,
    settings: r.configSettings,
    scores: Object.fromEntries(
      Object.entries(r.categories).map(([k, v]) => [k, v.score * 100]),
    ),
    metrics: Object.fromEntries(
      [
        "largest-contentful-paint",
        "cumulative-layout-shift",
        "total-blocking-time",
        "first-contentful-paint",
        "speed-index",
      ].map((k) => [k, r.audits[k].numericValue]),
    ),
  };
  reports.push(result);
  console.log(JSON.stringify(result));
}
await writeFile(
  "docs/qa/lighthouse-summary.json",
  JSON.stringify(reports, null, 2),
);
