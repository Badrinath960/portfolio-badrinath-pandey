# Content editing

## Public facts

Edit the reviewed `content/public-profile.json`, preserving stable IDs and source references. Then run `npm run content` and `npm test`. Builds validate and normalize this snapshot. The original editorial packages stay local and are excluded from Git, so a fresh public clone builds without private files. Do not put draft prose or private metadata in the public snapshot.

The projector uses Zod objects with explicit fields; unrecognized fields are stripped. Editorial notes, source filenames, phone numbers, source paths and verification metadata cannot enter the public object by copying the source wholesale. Source references such as `S1:p1` may remain public; the underlying documents do not.

## Add a project without changing card code

Add one evidence-backed entry to the public `projects` array. Application entries appear in the Projects timeline and résumé; internal entries appear in Work in Practice. Required shape:

```json
{
  "id": "new-project-id",
  "slug": "new-project-slug",
  "title": "The documented project title",
  "type": "application",
  "category": "data-applications",
  "summary": "A concise statement supported by the source.",
  "tools": [],
  "featuredRank": 4,
  "publication": "summary-only",
  "repoUrl": null,
  "demoUrl": null,
  "caseStudy": null,
  "metrics": [],
  "date": null,
  "sourceRefs": ["S1:p1"]
}
```

This is a shape example, not a publishable claim. Replace its facts and source reference with actual supplied evidence before adding it. Never reuse a reference for an unrelated claim. Register new source documents in the source registry, and extend the allowed source-ID validation intentionally. Then regenerate and test. Card rendering, tool controls, category controls, counts, and stable ordering follow the content automatically.

Tools are project-specific evidence. Empty tools are correct for the two supplied internal summaries. Categories are shown only when an eligible project exists. Search combines text AND category AND tools, with OR within the selected tool group. Unknown URL values normalize safely.

## Publish a case study later

Set `publication` to `published` only after filling `caseStudy` with `problem`, `contribution`, `process` (array), `result`, `limitations` and `evidence` (source references). Then copy `templates/case-study-page.tsx` to `app/work/[slug]/page.tsx` and run the static export checks. The route is intentionally absent at launch: this Next.js static exporter rejects a dynamic route whose generated parameter list is empty. Tools come from the project. Provide actual HTTPS repository/demo URLs if available. A published record without a complete narrative fails validation. Keep unpublished prose in private editorial files. Unknown and summary-only slugs return 404 and never appear in the sitemap.

Metrics need value, unit, method, scope, period and evidence. No quantitative project impact is supplied at launch.

## Credentials and education

Add approved credentials to `credentials` rather than unresolved `resumeOnlyCredentials`. Preserve detailed titles, issue dates and optional verification links. Update the actual education status rather than predicting a completion date. Do not merge or total potentially overlapping NIQ awards.

## Add story content

The narrative registry is `storySteps` in `lib/demo.ts`; records and validation are shared by the charts and table. The launch choreography intentionally has four phases, so changing the number of stages also requires adjusting the normalized progress mapping and SVG transformation in `components/sections/Story.tsx`. Keep the static step illustrations and accessible table in sync. The workflow is illustrative fixed logic, never a model call.

## Future CMS

Replace the local provider implementation while retaining `getPublicProfile`, `listProjects`, `getPublishedProject` and `listCredentials`. Run the same schema and source validation before returning content, and supply a last-known validated snapshot or an honest error if the provider fails. Never compile visitor-supplied MDX or return raw CMS metadata to client components.
