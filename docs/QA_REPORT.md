# QA report — 11 October 2026

## Update verification — 12 October 2026

The ProVision/project timeline, document résumé and GitHub Pages update passed:

- Frozen-lockfile pnpm install, public content validation, 9 unit tests, strict TypeScript and ESLint.
- Static Pages export, exercised under `/portfolio-badrinath-pandey/` on the local static server.
- All 16 Playwright tests in one run against the export: filtering/history, no-JS content, mobile keyboard menu, storage/clipboard failure, motion preferences, GSAP reversal/cleanup, WebGL and chunk failures, context loss, pause/offscreen scheduling, root-class hydration regression, and actual ProVision URL assertions.
- Homepage and résumé overflow checks at 320, 390, 768, 1024 and 1440 CSS px. No serious/critical axe findings on the exercised home/menu and résumé layouts. Narrow reflow with increased text spacing passes.
- Desktop and mobile screenshots visually reviewed. A 320px illustration overflow was fixed by giving the mobile artwork an explicit width/height instead of allowing its aspect ratio to impose a minimum width.
- Print output generated as A4 PDF and visually inspected; print media hides navigation/toolbars and uses a light page color scheme.
- Static navigation uses normal document links. This eliminated a missing RSC segment prefetch request on the plain static server. Fonts, styles, script chunks, icon and social image are served below the repository path.

Evidence is local in ignored `test-results/` and `.tools/` directories. Original Lighthouse values below apply to the earlier release, not this update; they were not remeasured. Physical iOS/Android devices, Safari, Firefox and assistive-technology testing remain unverified. The ProVision demo URL responded successfully, but its backend/model accuracy was not audited. No paid service was enabled.

The historical report below records the first local implementation, before the user's subsequent authorization to deploy.

## Result

The local implementation builds successfully and the exercised launch checks pass. No public deployment was performed. Missing evidence-dependent assets and untested platforms are listed below rather than treated as verified.

| Check | Result |
| --- | --- |
| Production build | Pass, Next 16.4.0 with Webpack; all intended routes render, draft/unknown project slugs 404. |
| Strict TypeScript | Pass, TypeScript 6.0.3. |
| ESLint | Pass, no errors or warnings. |
| Dependency peers | No peer dependency issues. |
| Vitest | 9 passing tests: projection privacy, duplicate IDs/slugs, unsafe URLs/dates/references/metrics, publication gate, filter combinations/order, URL parsing and sample totals. |
| Playwright | 14 passing browser tests, run as the 12-test integrated suite plus two final fault-injection tests. |
| Automated accessibility | No serious/critical axe violations on desktop or the 320px mobile menu/text-spacing configuration. Lighthouse accessibility 100. |
| Content and anchors | No broken internal anchors or page errors in the measured default desktop/mobile visits. Email and social destinations match supplied facts. |
| Preview metadata | Noindex/nofollow, no canonical or production sitemap entries without SITE_ORIGIN; valid PNG social preview. |

## Browser and interaction coverage

Windows desktop; Edge **155.0.4283.45** through Playwright **1.64.0**, Chrome **154** through Lighthouse **13.5.0**. Production server at `127.0.0.1:3001`, development server at `127.0.0.1:3000`.

Exercised search/category/tool combinations, settled counts, reset and empty state, URL reload/Back/Forward, mobile keyboard menu and Escape focus return, System/Reduced/Full preference changes, denied storage, OS preference changes, reduced workflow results and replay, clipboard denial instructions, mailto/social destinations, no-JavaScript profile and projects, unknown/draft case-study rejection, WebGL context loss, unavailable WebGL, failed deferred chunks, data-saver fallback, reversible story geometry, reduced-mode pin removal, repeated résumé navigation and canvas/pin cleanup.

WebGL draw-call instrumentation confirmed drawing stops when paused or offscreen. The hidden-document handler was exercised by setting the visibility state and dispatching `visibilitychange`; this is a controlled browser test, not a claim about every OS background-window policy.

Screenshots cover **320, 390, 768, 1024 and 1440 CSS px**, including reduced mode. Normal desktop sculpture and story, plus mobile poster, have dedicated captures. Automated document-width checks pass at each width. The 320px test also applies 1.5 line height, 0.12em letter spacing, 0.16em word spacing and 2em paragraph spacing. This exercises narrow reflow equivalent to 400% on a 1280px viewport; native browser zoom and assistive technology remain manual checks.

Evidence: `docs/qa/hero-1440.png`, `hero-390.png`, `portfolio-*-reduced.png`, `story-desktop.png`, `resources.json`, and `lighthouse-summary.json`. Raw Lighthouse reports are retained alongside the summary. Playwright generates transient screenshots/traces and its HTML report under ignored output directories.

## Performance

Three sequential final Lighthouse mobile runs, with other browser tests finished: simulated mobile viewport **412×823**, DPR **1.75**, 4× CPU slowdown, simulated network approximately **1.6 Mbps / 150ms RTT**. Measurements use the local production build, not the dev server.

| Metric | Run 1 | Run 2 | Run 3 | Median |
| --- | ---: | ---: | ---: | ---: |
| Performance | 95 | 94 | 96 | **95** |
| Accessibility | 100 | 100 | 100 | **100** |
| Best practices | 100 | 100 | 100 | **100** |
| LCP | 2.80s | 2.84s | 2.66s | **2.80s** |
| Total blocking time | 81.5ms | 120.0ms | 80.0ms | **81.5ms** |
| CLS | 0.00394 | 0.00394 | 0.00394 | **0.00394** |

The ≥90 mobile performance target and ≤0.1 lab CLS budget pass. Lab LCP is above 2.5 seconds on this simulated profile; it is reported honestly rather than substituted for the brief's real-user p75 target. There is no production field LCP, INP or CLS dataset. TBT is not INP. The SEO score of 63 reflects intentionally non-indexable preview settings and should not be interpreted as production SEO approval.

Measured resources (gzip computed from returned bodies, not an assertion about a future hosting provider's compression):

| Budget | Measured | Target |
| --- | ---: | ---: |
| Core route JS, no 3D | 190,971 bytes gzip (~186.5 KiB) | ≤220 KB |
| Additional deferred 3D JS | 249,191 bytes gzip (~243.4 KiB) | ≤600 KB |
| Fonts | 39,544 bytes (~38.6 KiB) | ≤150 KB |
| Mobile initial resources | ~261 KB computed gzip | ≤1 MB |
| Desktop resources including scene | ~515 KB computed gzip | — |

The mobile visit uses the SVG default and makes no deferred-scene request. Desktop uses a reserved canvas area with one instanced data-block draw and one base mesh, no postprocessing or shadows. The source caps instances and DPR. Smoothness is not claimed as measured 60fps on all devices.

## Remaining limits and owner inputs

- Safari, Firefox, physical iOS/Android devices, NVDA and VoiceOver were not available for this verification. A final manual browser/screen-reader pass is still recommended before public launch; automated axe is not a complete WCAG certification.
- The low-frame-rate degradation path is implemented, but no sustained physical low-end GPU test was performed. Context-loss, unavailable-WebGL, import-failure, pause and visibility fallbacks were tested directly.
- Native 200%/400% browser zoom and an independent 30-second recruiter comprehension study were not performed. Responsive reflow and text-spacing checks are documented above.
- Remote LinkedIn/GitHub/credential validity was not independently established; URLs follow the provided evidence. Clipboard denial was tested; actual email delivery remains the visitor's mail client.
- Public project repositories/demos, detailed case-study evidence, approved employer artifacts, a public résumé PDF and the production origin were not supplied. Their actions/routes remain omitted or gated. No invented outcomes fill these gaps.
- The tested Windows Turbopack CSS-worker path failed; the documented Webpack path is the verified startup/build route. Vitest emits a forward-looking Vite config-loader warning; current tests pass and it does not affect the site.
