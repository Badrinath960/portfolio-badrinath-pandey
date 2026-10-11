import { SiteLink as Link } from "@/components/layout/SiteLink";
import { getPublicProfile } from "@/lib/content/provider";
import { formatDate } from "@/components/sections/ProfileSections";
import { ResumePrint } from "@/components/sections/ResumePrint";
import { getOrigin, siteUrl } from "@/lib/config";
export const metadata = {
  title: "Résumé",
  ...(getOrigin() ? { alternates: { canonical: siteUrl("/resume/") } } : {}),
};
export default function Resume() {
  const p = getPublicProfile();
  return (
    <main id="main" tabIndex={-1} className="resume-shell">
      <div className="resume-toolbar">
        <Link className="text-link" href="/">
          ← Back to portfolio
        </Link>
        <ResumePrint />
      </div>
      <article className="resume-document" aria-label="Badrinath Pandey résumé">
        <header className="document-heading">
          <div>
            <p className="document-kicker">RÉSUMÉ / BADRINATH PANDEY</p>
            <h1>{p.identity.name}</h1>
            <p className="document-role">{p.identity.role}</p>
          </div>
          <div className="document-contact">
            <p>Vadodara, Gujarat, India</p>
            <a href={`mailto:${p.identity.email}`}>{p.identity.email}</a>
            <div>
              <a href={p.identity.links.linkedin}>LinkedIn ↗</a>
              <a href={p.identity.links.github}>GitHub ↗</a>
            </div>
          </div>
        </header>
        <p className="document-summary">{p.proposedCopy.summary}</p>
        <div className="document-columns">
          <div className="document-main">
            <section>
              <h2>Professional experience</h2>
              {p.experience.map((e) => (
                <article key={e.id}>
                  <div className="document-entry-heading">
                    <h3>{e.role}</h3>
                    <span>
                      {formatDate(e.start)} — {formatDate(e.end)}
                    </span>
                  </div>
                  <p className="document-employer">{e.employer}</p>
                  <ul>
                    {e.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>
            <section>
              <h2>Projects</h2>
              {p.projects
                .filter((w) => w.type === "application")
                .map((w) => (
                  <article key={w.id}>
                    <h3>{w.title}</h3>
                    <p>{w.summary}</p>
                    <p className="document-tools">{w.tools.join(" · ")}</p>
                    <div className="document-project-links">
                      {w.demoUrl && <a href={w.demoUrl}>Live project ↗</a>}
                      {w.repoUrl && <a href={w.repoUrl}>Source code ↗</a>}
                    </div>
                  </article>
                ))}
            </section>
            <section>
              <h2>Recognition</h2>
              {p.recognition.map((r) => (
                <p key={r.id}>
                  <strong>{r.title}</strong>
                  {r.work && ` · ${r.work}`}
                  <br />
                  {r.organization}
                </p>
              ))}
            </section>
          </div>
          <aside className="document-sidebar">
            <section>
              <h2>Education</h2>
              {p.education.map((e) => (
                <article key={e.id}>
                  <h3>{e.degree}</h3>
                  <p>{e.institution}</p>
                  <p>
                    {formatDate(e.start)} — {formatDate(e.end)}
                    <br />
                    {e.status}
                    {e.grade &&
                      ` · ${e.grade.type} ${e.grade.value}/${e.grade.scale}`}
                  </p>
                </article>
              ))}
            </section>
            <section>
              <h2>Capabilities</h2>
              {p.skillGroups.map((g) => (
                <article key={g.id}>
                  <h3>{g.title}</h3>
                  <p>
                    {g.items.join(", ")}
                    {g.id === "course-exposure" && " (educational exposure)"}
                  </p>
                </article>
              ))}
            </section>
            <section>
              <h2>Credentials</h2>
              {p.credentials.map((c) => (
                <p key={c.id}>
                  <strong>
                    {c.url ? <a href={c.url}>{c.title} ↗</a> : c.title}
                  </strong>
                  <br />
                  {c.issuer} · {formatDate(c.issued)}
                </p>
              ))}
              <p className="document-note">
                Document-reported; not independently verified.
              </p>
            </section>
            <section>
              <h2>Languages</h2>
              {p.languages.map((l) => (
                <p key={l.name}>
                  {l.name} · {l.level}
                </p>
              ))}
            </section>
          </aside>
        </div>
        <footer className="document-footer">
          Badrinath Pandey · Data quality, reporting and practical automation
        </footer>
      </article>
    </main>
  );
}
