# Implementation record — 11 October 2026

## Update — 12 October 2026

- Added owner-supplied ProVision, with repository-backed summary and actual demo/source links. Provenance is in `PROJECT_SOURCES.md`; no prediction accuracy, impact numbers or dates were inferred.
- Separated application projects into an editorial timeline with filters. Internal work summaries remain in Work in Practice. Added Projects navigation and responsive illustration sizing.
- Replaced the résumé page with a paper-style document and real browser print/save-as-PDF action.
- Root-only `suppressHydrationWarning` tolerates the browser-injected `hydrated` class shown in the owner's screenshot. No application script sets that class; content hydration remains checked. A regression test injects the class into the document response before React starts.
- Static GitHub Pages export uses a repository base path, production canonical/sitemap/social image and `.nojekyll`. Document links avoid Next's RSC segment prefetch requests, which were not available at their requested paths on the plain static preview server. Two-page navigation remains reliable without host rewrites.
- The public repository builds from the reviewed, schema-validated public snapshot. Original source documents and editorial packages are Git-ignored. The absent case-study route has a reusable template; an empty static parameter list is unsupported by this exporter.
- The user subsequently authorized Pages deployment. The workflow verifies and deploys `main` pushes; PR builds cannot deploy. Existing repository visibility is preserved.

The original implementation notes and measurements below describe the first release; the update QA is recorded separately in `QA_REPORT.md`.

## Decisions and compatibility

- Source documents were read in the package's dependency order before application work. Public facts use only the supplied JSON and reconciliation rules.
- Verified stable registry versions: Next 16.4.0, React/React DOM 19.3.0, R3F 9.8.1 and Drei 10.7.9. The installed peer graph is clean. Three 0.186.1, GSAP 3.15.0, @gsap/react 2.1.2, Tailwind 4.3.3 and Zod 4.6.5 are pinned.
- Tested host: Windows, Node 22.14.0, pnpm 12.11.2. `pnpm-lock.yaml` records the complete resolved graph.
- TypeScript 7 and ESLint 10 were initially returned as latest, but typescript-eslint and several ESLint plugins did not support them. Selected TypeScript 6.0.3 and ESLint 9.39.4 instead; peer checks, strict type checking and lint pass. This is an intentional compatible set, not a claim that every package is the newest major.
- Turbopack's CSS worker exited before its IPC connection on this machine, including outside the sandbox. Supported Webpack production and development commands work and are recorded in package scripts.
- Local bundled Next.js guides for server/client components, navigation and metadata were read. Research references: [Next 16.4](https://nextjs.org/blog/next-16-4), [security guidance](https://nextjs.org/blog/security-update-2025-12-11), [R3F React compatibility](https://r3f.docs.pmnd.rs/getting-started/installation), [GSAP React lifecycle](https://gsap.com/resources/React/), and [Tailwind framework setup](https://tailwindcss.com/docs/installation/framework-guides/nextjs).
- The page is server-rendered with client islands. No database, login, paid API, telemetry or live contact-delivery service is needed.
- Manrope and IBM Plex Mono are locally bundled. Procedural geometry and original SVGs replace photographs and unverified project screenshots.
- Animation uses GSAP for coordinated SVG/DOM changes and R3F for the canvas. The sculpture is deferred, capped at 96 desktop instances / 48 small-canvas instances, DPR ≤1.5 (1 for small canvases), and no shadows or postprocessing. Slow frames reduce DPR, then remove the canvas if sustained.
- Reduced-motion and no-JavaScript visitors retain all profile facts, work summaries, four story stages and contact destinations. Static story layout uses illustrated cards instead of an empty sticky column. Header navigation remains available with JavaScript disabled.
- Core text never starts hidden. The sample data uses 24 records, with four distinct intentional issues; valid region counts are 7, 6, 7.

## Task sequence and evidence

| Task | Implementation and evidence |
| --- | --- |
| T01 | Exact compatible stack, lockfile, strict TS, production build, lint and peer check. |
| T02 | Zod allowlist, cross-document reference validation, generated public content, provider boundary and unit tests. |
| T03 | Tokens, local fonts, sticky header, mobile disclosure, skip link, focus states; responsive screenshots and keyboard tests. |
| T04 | Complete hero, three work summaries, capabilities, two experience entries, education, ten credentials, recognition, about and contact. No-JS browser check. |
| T05 | Debounced search, categories, OR tool group, reset/count/empty state, URL persistence and history; unit and browser tests. |
| T06 | System/Reduced/Full, OS changes, storage failure, pause/resume and cleanup; browser tests. |
| T07 | Committed synthetic records, reusable validator, four illustrated stages, real chart denominators, expandable accessible data table. |
| T08 | Scoped useGSAP/matchMedia, reversible four-stage SVG timeline, pin graphic only on large/tall viewports; reduced-mode teardown tested. |
| T09 | Lazy procedural instanced scene, pointer tilt and shared story progress, SVG poster, import/error/context-loss fallback, visibility scheduling and degradation. See QA report for exercised vs untested paths. |
| T10 | User-triggered 2.4-second deterministic workflow, issue selection, replay, reduced-motion immediate result, human review explanation. |
| T11 | HTML résumé, Person JSON-LD, preview noindex, origin-gated canonical/sitemap, PNG social image, SVG icon. No PDF download without a public asset. |
| T12 | Evidence-gated article template implemented. No supplied project qualifies for publication; summary and unknown slugs return 404. |
| T13 | Build, lint, typecheck, unit tests, browser flows, axe, viewport captures, resource measures and Lighthouse. Platform and manual-test limits are explicitly recorded in QA_REPORT.md. |
| T14 | README, content-edit guide, asset record, measured QA report and local restart commands. |

This log supersedes the historical “not started” planning snapshot in the supplied TASKS.md; it does not imply that untested physical devices or screen readers were verified.

## Evidence limitations retained

Employer spelling follows the resume provisionally. Award relationships are not resolved or totaled. Internal project stacks are unknown, and extended employer artifacts are withheld. Public project links, measured impact, profile photo, phone and PDF résumé remain absent. AiQ is recognition only. Educational exposure is labeled separately from work experience.
