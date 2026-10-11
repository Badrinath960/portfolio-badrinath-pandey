import { describe, it, expect } from "vitest";
import raw from "../content/public-profile.json";
import {
  projectPublicContent,
  publicProfileSchema,
} from "../lib/content/schema";
import {
  filterProjects,
  parseFilters,
  emptyFilters,
  filterUrl,
} from "../lib/filters";
import { checkedRecords, regionCounts } from "../lib/demo";
const profile = projectPublicContent(raw),
  projects = profile.projects;
describe("Public content boundary", () => {
  it("projects only explicitly allowed public facts", () => {
    const text = JSON.stringify(profile);
    for (const key of [
      "filename",
      "editorialNote",
      "employerSourceVariants",
      "openQuestions",
      "sourcePolicy",
      "resumeOnlyCredentials",
      "phone",
      "createdUtc",
    ])
      expect(text).not.toContain(key);
    expect(profile.identity.email).toBe("pandeybadrinath9@gmail.com");
    expect(profile.identity.links.github).toBe(
      "https://github.com/Badrinath960",
    );
    expect(
      profile.projects
        .filter((p) => p.type === "internal-work-summary")
        .every((p) => p.tools.length === 0),
    ).toBe(true);
  });
  it("rejects duplicate IDs and slugs", () => {
    const p = structuredClone(profile);
    p.projects.push(p.projects[0]);
    expect(() => publicProfileSchema.parse(p)).toThrow();
    const q = structuredClone(profile);
    q.projects[1].slug = q.projects[0].slug;
    expect(() => publicProfileSchema.parse(q)).toThrow();
  });
  it("rejects unsafe links, invalid dates, unreferenced claims and evidence-free metrics", () => {
    for (const mutate of [
      (p: typeof profile) => {
        p.projects[0].repoUrl = "javascript:alert(1)";
      },
      (p: typeof profile) => {
        p.experience[0].start = "2025-13";
      },
      (p: typeof profile) => {
        p.projects[0].sourceRefs = ["S9:p1"];
      },
      (p: typeof profile) => {
        p.projects[0].metrics = [{ value: 20 } as never];
      },
    ]) {
      const p = structuredClone(profile);
      mutate(p);
      expect(() => publicProfileSchema.parse(p)).toThrow();
    }
  });
  it("requires evidence and narrative for a published case study", () => {
    const p = structuredClone(profile);
    p.projects[0].publication = "published";
    expect(() => publicProfileSchema.parse(p)).toThrow();
  });
});
describe("Filter contract", () => {
  it("combines text AND category", () =>
    expect(
      filterProjects(projects, {
        q: " BLOOD ",
        category: "data-applications",
        tools: [],
      }).map((p) => p.id),
    ).toEqual(["raktkadi"]));
  it("does not infer automation stacks", () =>
    expect(
      filterProjects(projects, {
        q: "",
        category: "automation",
        tools: ["react"],
      }),
    ).toHaveLength(0));
  it("uses OR within tools and stable rank order with a synthetic fixture", () => {
    const fixture = [
      {
        ...projects[0],
        id: "test-sql",
        title: "SQL fixture",
        featuredRank: 2,
        tools: ["SQL"],
      },
      {
        ...projects[0],
        id: "test-python",
        title: "Python fixture",
        featuredRank: 1,
        tools: ["Python"],
      },
    ];
    expect(
      filterProjects(fixture, {
        ...emptyFilters,
        tools: ["sql", "python"],
      }).map((p) => p.id),
    ).toEqual(["test-python", "test-sql"]);
  });
  it("ignores unknown URL values and round-trips valid filters", () => {
    expect(
      parseFilters("?category=imaginary&tools=react,unknown", projects),
    ).toEqual({ ...emptyFilters, tools: ["react"] });
    const f = {
      q: "blood",
      category: "data-applications",
      tools: ["react", "sql"],
    };
    expect(parseFilters(filterUrl(f).split("#")[0], projects)).toEqual(f);
  });
});
describe("Illustrative dataset", () => {
  it("reconciles all counts and distinct validation rules", () => {
    expect(checkedRecords).toHaveLength(24);
    expect(checkedRecords.filter((r) => r.issue)).toHaveLength(4);
    expect(
      new Set(checkedRecords.filter((r) => r.issue).map((r) => r.issue)).size,
    ).toBe(4);
    expect(regionCounts.map((r) => r.count)).toEqual([7, 6, 7]);
  });
});
