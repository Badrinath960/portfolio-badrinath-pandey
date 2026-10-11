"use client";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content/schema";
import {
  emptyFilters,
  filterProjects,
  filterUrl,
  parseFilters,
  toolKey,
  type Filters,
} from "@/lib/filters";
import { SiteLink as Link } from "@/components/layout/SiteLink";
import { ProjectDiagram } from "../charts/ProjectDiagram";
export function WorkGallery({
  projects,
  filterable = true,
  timeline = false,
}: {
  projects: Project[];
  filterable?: boolean;
  timeline?: boolean;
}) {
  const [filters, setFilters] = useState<Filters>(emptyFilters),
    [query, setQuery] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!filterable) return;
    const restore = () => {
      if (timer.current) clearTimeout(timer.current);
      const f = parseFilters(location.search, projects);
      setFilters(f);
      setQuery(f.q);
    };
    restore();
    addEventListener("popstate", restore);
    return () => {
      removeEventListener("popstate", restore);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [projects, filterable]);
  function update(next: Filters, replace = false) {
    if (timer.current) clearTimeout(timer.current);
    setFilters(next);
    history[replace ? "replaceState" : "pushState"](
      null,
      "",
      location.pathname + filterUrl(next, "projects"),
    );
  }
  function search(value: string) {
    setQuery(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => update({ ...filters, q: value }, true),
      150,
    );
  }
  const results = filterable ? filterProjects(projects, filters) : projects,
    tools = [...new Set(projects.flatMap((p) => p.tools))];
  const categories = [...new Set(projects.map((p) => p.category))];
  return (
    <>
      {filterable && (
        <>
          <div className="work-controls">
            <div
              className="category-controls"
              role="group"
              aria-label="Project category"
            >
              {["all", ...categories].map((c) => (
                <button
                  key={c}
                  aria-pressed={filters.category === c}
                  onClick={() => update({ ...filters, q: query, category: c })}
                >
                  {c === "all"
                    ? "All projects"
                    : c === "data-applications"
                      ? "Data Applications"
                      : c[0].toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
            <label className="search">
              <span aria-hidden="true">⌕</span>
              <span className="sr-only">Search projects</span>
              <input
                type="search"
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder="Search projects"
                maxLength={150}
              />
            </label>
          </div>
          <div className="work-meta">
            <details className="tool-filter">
              <summary>
                Filter by tool <span aria-hidden="true">+</span>
              </summary>
              <div role="group" aria-label="Project tools">
                {tools.map((t) => (
                  <button
                    key={t}
                    aria-pressed={filters.tools.includes(toolKey(t))}
                    onClick={() =>
                      update({
                        ...filters,
                        q: query,
                        tools: filters.tools.includes(toolKey(t))
                          ? filters.tools.filter((x) => x !== toolKey(t))
                          : [...filters.tools, toolKey(t)],
                      })
                    }
                  >
                    {filters.tools.includes(toolKey(t)) ? "✓ " : ""}
                    {t}
                  </button>
                ))}
              </div>
            </details>
            <p className="mono small" role="status">
              {results.length} {results.length === 1 ? "project" : "projects"}
            </p>
            {(filters.q ||
              filters.category !== "all" ||
              filters.tools.length > 0) && (
              <button
                className="text-button"
                onClick={() => {
                  setQuery("");
                  update(emptyFilters);
                }}
              >
                Clear filters <span aria-hidden="true">↺</span>
              </button>
            )}
          </div>
        </>
      )}
      <div className={timeline ? "work-grid project-timeline" : "work-grid"}>
        {results.map((p, i) => (
          <article
            key={p.id}
            className={`project-card ${p.id === "raktkadi" ? "featured" : ""}`}
          >
            <div className="project-art">
              <span className="art-index mono">
                {String(p.featuredRank).padStart(2, "0")} /{" "}
                {p.type === "application" ? "APPLICATION" : "AUTOMATION"}
              </span>
              <ProjectDiagram kind={p.id} />
              <span className="art-caption mono">
                CONCEPTUAL DIAGRAM · NOT A PRODUCT SCREENSHOT
              </span>
            </div>
            <div className="project-copy">
              <div className="eyebrow">
                <span className="status-dot" />
                {p.type === "application"
                  ? "Data application"
                  : "Internal project"}
              </div>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              {p.tools.length > 0 && (
                <ul className="tags" aria-label="Tools">
                  {p.tools.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
              <div className="project-actions">
                {p.repoUrl && <a href={p.repoUrl}>Repository ↗</a>}
                {p.demoUrl && <a href={p.demoUrl}>Live demo ↗</a>}
                {p.publication === "published" && p.caseStudy ? (
                  <Link href={`/work/${p.slug}/`}>Read case study ↗</Link>
                ) : (
                  <a href="#contact" aria-label={`Discuss ${p.title}`}>
                    Let’s discuss the work <span aria-hidden="true">↗</span>
                  </a>
                )}
                <span className="small">
                  {i === 0 && p.type === "application"
                    ? "Public summary"
                    : "Summary only"}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {results.length === 0 && (
        <div className="empty-state">
          <h3>No projects match these filters</h3>
          <p>Try a different category or a broader search.</p>
          <button
            className="button"
            onClick={() => {
              setQuery("");
              update(emptyFilters);
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
