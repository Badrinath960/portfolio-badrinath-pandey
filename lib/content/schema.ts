import { z } from "zod";
const date = z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/);
const refs = z
  .array(z.string().regex(/^(S[1-3]:p[1-9]\d*|P1:(readme|frontend|owner))$/))
  .min(1);
const https = z
  .url()
  .refine((v) => v.startsWith("https://"), "Only HTTPS URLs are public");
const record = { id: z.string().min(1), sourceRefs: refs };
const metric = z.object({
  value: z.number(),
  unit: z.string().min(1),
  method: z.string().min(1),
  scope: z.string().min(1),
  period: z.string().min(1),
  evidence: refs,
});
const caseStudy = z.object({
  problem: z.string().min(1),
  contribution: z.string().min(1),
  process: z.array(z.string()).min(1),
  result: z.string().min(1),
  limitations: z.string().min(1),
  evidence: refs,
});
export const projectSchema = z
  .object({
    ...record,
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string(),
    type: z.enum(["application", "internal-work-summary"]),
    category: z.enum(["automation", "data-applications", "analytics"]),
    summary: z.string(),
    tools: z.array(z.string()),
    featuredRank: z.number(),
    publication: z.enum(["summary-only", "draft", "published"]),
    repoUrl: https.nullable(),
    demoUrl: https.nullable(),
    caseStudy: caseStudy.nullable(),
    metrics: z.array(metric),
    date: date.nullable(),
  })
  .superRefine((p, ctx) => {
    if (p.publication === "published" && !p.caseStudy)
      ctx.addIssue({
        code: "custom",
        message: "Published article needs evidence and narrative",
      });
    if (p.publication !== "published" && p.caseStudy)
      ctx.addIssue({
        code: "custom",
        message: "Draft narrative must not enter public projection",
      });
  });
export const publicProfileSchema = z
  .object({
    identity: z.object({
      name: z.string(),
      role: z.string(),
      employer: z.string(),
      location: z.object({
        city: z.string(),
        region: z.string(),
        country: z.string(),
      }),
      email: z.email(),
      links: z.object({ linkedin: https, github: https }),
      sourceRefs: refs,
    }),
    proposedCopy: z.object({
      headline: z.string(),
      summary: z.string(),
      contact: z.string(),
      sourceRefs: refs,
    }),
    careerInterests: z.object({ items: z.array(z.string()), sourceRefs: refs }),
    experience: z.array(
      z
        .object({
          ...record,
          role: z.string(),
          employer: z.string(),
          start: date,
          end: date.nullable(),
          current: z.boolean(),
          highlights: z.array(z.string()),
        })
        .refine(
          (x) => !x.current || x.end === null,
          "Current role cannot have end date",
        ),
    ),
    projects: z.array(projectSchema),
    education: z.array(
      z.object({
        ...record,
        degree: z.string(),
        institution: z.string(),
        start: date,
        end: date.nullable(),
        status: z.string(),
        grade: z
          .object({ value: z.number(), scale: z.number(), type: z.string() })
          .nullable(),
      }),
    ),
    skillGroups: z.array(
      z.object({
        ...record,
        title: z.string(),
        items: z.array(z.string()),
        claimType: z.string(),
      }),
    ),
    languages: z.array(
      z.object({ name: z.string(), level: z.string(), sourceRefs: refs }),
    ),
    credentials: z.array(
      z.object({
        ...record,
        title: z.string(),
        issuer: z.string(),
        issued: date.nullable(),
        url: https.nullable(),
      }),
    ),
    recognition: z.array(
      z.object({
        ...record,
        title: z.string(),
        organization: z.string(),
        year: z.number().nullable(),
        work: z.string().optional(),
        principle: z.string().optional(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const ids = new Set<string>();
    for (const list of [
      data.projects,
      data.experience,
      data.education,
      data.skillGroups,
      data.credentials,
      data.recognition,
    ])
      for (const x of list) {
        if (ids.has(x.id))
          ctx.addIssue({ code: "custom", message: `Duplicate ID: ${x.id}` });
        ids.add(x.id);
      }
    const slugs = data.projects.map((p) => p.slug);
    if (new Set(slugs).size !== slugs.length)
      ctx.addIssue({ code: "custom", message: "Duplicate project slug" });
  });
export type Project = z.infer<typeof projectSchema>;
export type PublicProfile = z.infer<typeof publicProfileSchema>;
export function projectPublicContent(raw: unknown): PublicProfile {
  return publicProfileSchema.parse(raw);
}
