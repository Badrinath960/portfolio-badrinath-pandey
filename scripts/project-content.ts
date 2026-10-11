import { readFileSync, writeFileSync } from "node:fs";
import { projectPublicContent } from "../lib/content/schema";
// Build from reviewed public content; the original editorial package stays private.
const raw = JSON.parse(readFileSync("content/public-profile.json", "utf8"));
const projected = projectPublicContent(raw);
projected.projects = projected.projects.filter(
  (p) => p.publication !== "draft",
);
writeFileSync(
  "content/public-profile.json",
  JSON.stringify(projected, null, 2) + "\n",
);
console.log("Validated public profile and source-reference allowlist.");
