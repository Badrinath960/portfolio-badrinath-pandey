import type { Project } from "./content/schema";
export type Filters = { q: string; category: string; tools: string[] };
export const emptyFilters: Filters = { q: "", category: "all", tools: [] };
export const toolKey = (s: string) =>
  s.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "-");
export function parseFilters(search: string, projects: Project[]): Filters {
  const params = new URLSearchParams(search),
    categories = new Set(projects.map((p) => p.category)),
    tools = new Set(projects.flatMap((p) => p.tools.map(toolKey)));
  const category = params.get("category") || "all";
  return {
    q: (params.get("q") || "").trim().slice(0, 150),
    category: categories.has(category as Project["category"])
      ? category
      : "all",
    tools: [
      ...new Set(
        (params.get("tools") || "").split(",").filter((t) => tools.has(t)),
      ),
    ],
  };
}
export function filterProjects(projects: Project[], filters: Filters) {
  return projects
    .filter(
      (p) =>
        (filters.category === "all" || p.category === filters.category) &&
        (!filters.tools.length ||
          p.tools.some((t) => filters.tools.includes(toolKey(t)))) &&
        `${p.title} ${p.summary} ${p.tools.join(" ")}`
          .toLowerCase()
          .includes(filters.q.trim().toLowerCase()),
    )
    .sort(
      (a, b) =>
        a.featuredRank - b.featuredRank || a.title.localeCompare(b.title),
    );
}
export function filterUrl(filters: Filters, anchor = "work") {
  const p = new URLSearchParams();
  if (filters.q.trim()) p.set("q", filters.q.trim());
  if (filters.category !== "all") p.set("category", filters.category);
  if (filters.tools.length) p.set("tools", filters.tools.join(","));
  return `${p.size ? "?" + p.toString() : ""}#${anchor}`;
}
