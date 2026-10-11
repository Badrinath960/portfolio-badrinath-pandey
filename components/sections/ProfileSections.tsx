import { SiteLink as Link } from "@/components/layout/SiteLink";
import type { PublicProfile } from "@/lib/content/schema";
export function formatDate(date: string | null) {
  if (!date) return "Present";
  if (date.length === 4) return date;
  return new Date(date + "-01T12:00:00Z").toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
export function Experience({ profile }: { profile: PublicProfile }) {
  return (
    <section id="experience" className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">05 / EXPERIENCE</p>
          <h2>
            Built through
            <br />
            <span className="muted">hands-on work.</span>
          </h2>
        </div>
        <Link href="/resume/" className="text-link">
          View full résumé ↗
        </Link>
      </div>
      <div className="timeline">
        {profile.experience.map((e) => (
          <article className="experience-row" key={e.id}>
            <div className="experience-date mono">
              <span
                className={e.current ? "timeline-dot current" : "timeline-dot"}
              />
              {formatDate(e.start)} — {formatDate(e.end)}
              {e.current && <span className="current-label">CURRENT ROLE</span>}
            </div>
            <div>
              <p className="eyebrow">{e.employer}</p>
              <h3>{e.role}</h3>
              <ul>
                {e.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
export function Learning({ profile }: { profile: PublicProfile }) {
  return (
    <section className="section learning">
      <div className="section-heading">
        <div>
          <p className="eyebrow">06 / ALWAYS LEARNING</p>
          <h2>
            A foundation.
            <br />
            <span className="muted">And a direction.</span>
          </h2>
        </div>
        <p className="section-intro">
          Growing toward Data Engineering and Analytics Engineering, with
          continued study and practical work.
        </p>
      </div>
      <div className="learning-grid">
        <div>
          <h3 className="subheading">Education</h3>
          {profile.education
            .filter((e) => e.id !== "hsc")
            .map((e) => (
              <article className="education-item" key={e.id}>
                <p className="mono small">
                  {formatDate(e.start)} — {formatDate(e.end)}{" "}
                  <span className="education-status">{e.status}</span>
                </p>
                <h4>{e.degree}</h4>
                <p>{e.institution}</p>
                {e.grade && (
                  <p className="small">
                    {e.grade.type} {e.grade.value}/{e.grade.scale}
                  </p>
                )}
              </article>
            ))}
        </div>
        <div>
          <h3 className="subheading">Selected credentials</h3>
          {profile.credentials.slice(0, 3).map((c) => (
            <article className="credential" key={c.id}>
              <span className="credential-symbol" aria-hidden="true">
                ↗
              </span>
              <div>
                <h4>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noreferrer">
                      {c.title}
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  ) : (
                    c.title
                  )}
                </h4>
                <p className="small">
                  {c.issuer} · {formatDate(c.issued)}
                </p>
              </div>
            </article>
          ))}
          <details className="more-credentials">
            <summary>
              View all credentials ({profile.credentials.length}) ＋
            </summary>
            {profile.credentials.slice(3).map((c) => (
              <article className="credential" key={c.id}>
                <div>
                  <h4>{c.title}</h4>
                  <p className="small">
                    {c.issuer} · {formatDate(c.issued)}
                  </p>
                </div>
              </article>
            ))}
          </details>
          <p className="small muted">
            Document-reported credentials; not independently verified.
          </p>
        </div>
      </div>
      <div className="recognition">
        <h3 className="subheading">Recognition</h3>
        {profile.recognition.map((r) => (
          <div className="recognition-row" key={r.id}>
            <span aria-hidden="true">✳</span>
            <h4>
              {r.title}
              {r.work && <small>{r.work}</small>}
            </h4>
            <p>
              {r.organization}
              {r.principle && <> · {r.principle}</>}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
