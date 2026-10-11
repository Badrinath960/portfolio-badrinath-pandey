# Badrinath Pandey — From Data to Decision

A responsive portfolio built from the supplied profile evidence, with a dedicated project timeline, ProVision and Raktkadi summaries, URL-backed filters, GSAP scrollytelling, a deferred React Three Fiber sculpture, an illustrative workflow, motion controls, and a printable document-style résumé. Supports both local Next.js development and a static GitHub Pages export.

## Run locally

Dependencies are installed. In PowerShell:

```powershell
Set-Location "C:\Projects\my_portfolio"
npm run dev
```

Open **http://127.0.0.1:3000**. Press Ctrl+C in that terminal to stop it. The development script uses Webpack because Turbopack's CSS worker failed in the tested Windows environment. The app binds to loopback only.

If port 3000 is occupied by the preview already started for this task, use that preview, or identify and stop that specific server before restarting. Do not terminate unrelated Node processes.

## Reinstall from the lockfile

Tested runtime: Node **22.14.0**; package manager: pnpm **12.11.2**. Exact direct dependencies are in `package.json`; transitive versions are locked in `pnpm-lock.yaml`.

```powershell
npm install --prefix .tools --no-audit --no-fund pnpm@12.11.2
node .tools/node_modules/pnpm/bin/pnpm.mjs install --frozen-lockfile
```

If pnpm 12.11.2 is already available, `pnpm install --frozen-lockfile` is equivalent. Required esbuild and resolver install scripts are explicitly allowed in `pnpm-workspace.yaml`.

## Verify

```powershell
npm run content
npm run lint
npm run typecheck
npm test
npm run build
```

For production browser tests, start this in another terminal:

```powershell
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3001
```

Then:

```powershell
npm run test:e2e
node scripts/measure.mjs
node scripts/lighthouse.mjs
```

Playwright uses installed Microsoft Edge. The Lighthouse script uses installed Google Chrome and writes three mobile audits. Adjust the executable/channel in those scripts if using a different OS. Lighthouse is a lab measurement, not field Core Web Vitals.

## Content and architecture

- `content/public-profile.json` is the reviewed public content snapshot. Builds validate its allowlisted fields and references. Original editorial packages in `docs/portfolio/` and `portfolio-context/` stay local and are excluded from Git and public assets; a fresh clone builds without them.
- `docs/PROJECT_SOURCES.md` records the additional ProVision evidence supplied by the owner. Edit the public snapshot only with supported facts; keep private editorial notes outside Git.
- `lib/content/schema.ts` validates IDs, dates, links, publication rules, and evidence-bearing metrics. `lib/content/provider.ts` is the future CMS boundary.
- `app/page.tsx` renders the profile, contact and section structure. Client islands own filtering, motion preferences, the story, and the optional canvas.
- `content/demo/records.json` contains only synthetic records. `lib/demo.ts` defines their rules, totals and story steps.
- `components/scene/` owns the deferred canvas, visibility scheduling, performance degradation and SVG replacement.
- `lib/config.ts` centralizes flags. Live AI, analytics and contact forms are disabled. No external service is configured.

See [Content editing](docs/CONTENT_EDITING.md), [Implementation record](docs/IMPLEMENTATION.md), [QA report](docs/QA_REPORT.md), and [Assets and licenses](docs/ASSETS.md).

## GitHub Pages

The repository targets `https://badrinath960.github.io/portfolio-badrinath-pandey/`. The Actions workflow verifies and deploys pushes to `main`, and can be started manually. Pull requests build without deploying. Repository Settings → Pages → Source must be **GitHub Actions**. See [GitHub's publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

```powershell
npm run build:pages
node scripts/preview-pages.mjs
```

The static preview is `http://127.0.0.1:3002/portfolio-badrinath-pandey/`. The export script sets the production origin and repository base path and writes `out/` with `.nojekyll`. This output contains only public assets. GitHub Pages cannot apply Next.js server response headers; no API routes, server actions, live AI, or contact backend are required.

To exercise the exported site while the preview server runs:

```powershell
$env:TEST_BASE_URL="http://127.0.0.1:3002/portfolio-badrinath-pandey/"
npm run test:e2e
Remove-Item Env:TEST_BASE_URL
```

Default local development remains `noindex, nofollow`; the Pages build includes the production canonical, sitemap and social image. If changing the repository name or owner, update the two values in `scripts/build-pages.mjs` and the prefix in `scripts/preview-pages.mjs`.

Only supplied project links are shown. ProVision has the owner's repository and demo URLs; Raktkadi has no fabricated links. The résumé's Print / save as PDF button opens the browser's real print dialog. Expanded case studies remain unpublished; the future route template is in `templates/case-study-page.tsx`. Internal summaries do not attribute an unevidenced technology stack or reveal private artifacts. No profile photograph, telephone number, numerical impact claim, availability badge, or live AI service is included.
