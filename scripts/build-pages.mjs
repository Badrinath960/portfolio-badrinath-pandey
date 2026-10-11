import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
const env = {
  ...process.env,
  GITHUB_PAGES: "true",
  NEXT_PUBLIC_BASE_PATH: "/portfolio-badrinath-pandey",
  SITE_ORIGIN: "https://badrinath960.github.io",
};
for (const args of [
  ["node_modules/tsx/dist/cli.mjs", "scripts/project-content.ts"],
  ["node_modules/next/dist/bin/next", "build", "--webpack"],
]) {
  const result = spawnSync(process.execPath, args, {
    env,
    stdio: "inherit",
    windowsHide: true,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
writeFileSync("out/.nojekyll", "");
