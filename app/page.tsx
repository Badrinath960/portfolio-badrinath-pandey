import { SiteLink as Link } from "@/components/layout/SiteLink";
import { getPublicProfile, listProjects } from "@/lib/content/provider";
import { SceneBoundary } from "@/components/scene/SceneBoundary";
import { WorkGallery } from "@/components/work/WorkGallery";
import { Story } from "@/components/sections/Story";
import { Experience, Learning } from "@/components/sections/ProfileSections";
import { CopyEmail } from "@/components/sections/ContactActions";
const sectionIds = [
  "projects",
  "work",
  "approach",
  "capabilities",
  "experience",
  "about",
  "contact",
];
export default function Home() {
  const p = getPublicProfile();
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.identity.name,
    jobTitle: p.identity.role,
    worksFor: { "@type": "Organization", name: p.identity.employer },
    homeLocation: { "@type": "Place", name: "Vadodara, Gujarat, India" },
    sameAs: Object.values(p.identity.links),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main" tabIndex={-1} data-sections={sectionIds.join(" ")}>
        <section className="hero section">
          <div className="hero-topline mono">
            <span>
              <span className="status-dot" /> BADRINATH PANDEY
            </span>
            <span>
              VADODARA, INDIA <span aria-hidden="true">↗</span>
            </span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-role">
                Data Operations Analyst <span>at NielsenIQ</span>
              </p>
              <h1>
                Turning complex
                <br />
                data into{" "}
                <span className="accent">
                  clear
                  <br className="desktop-break" /> decisions.
                </span>
              </h1>
              <p className="hero-description">{p.proposedCopy.summary}</p>
              <div className="hero-actions">
                <a className="button primary" href="#projects">
                  Explore my work <span aria-hidden="true">↗</span>
                </a>
                <a className="button secondary" href="#contact">
                  Get in touch <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <SceneBoundary />
          </div>
          <div className="hero-bottom">
            <p className="mono">
              PYTHON <span>/</span> SQL <span>/</span> POWER BI <span>/</span>{" "}
              POWER PLATFORM
            </p>
            <a href="#projects" className="mono scroll-cue">
              SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <section id="projects" className="section projects">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / PERSONAL PROJECTS</p>
              <h2>
                Ideas into tools.
                <br />
                <span className="muted">Built to be useful.</span>
              </h2>
            </div>
            <p className="section-intro">
              Explore my applications, their purpose, and the technologies
              behind them. ProVision is my latest addition.
            </p>
          </div>
          <WorkGallery
            projects={listProjects().filter(
              (project) => project.type === "application",
            )}
            timeline
          />
        </section>
        <section id="work" className="section work">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / WORK IN PRACTICE</p>
              <h2>
                Practical problems.
                <br />
                <span className="muted">Purposeful solutions.</span>
              </h2>
            </div>
            <p className="section-intro">
              High-level summaries of internal automation work. Employer data
              and detailed implementation rules remain private.
            </p>
          </div>
          <WorkGallery
            projects={listProjects().filter(
              (project) => project.type === "internal-work-summary",
            )}
            filterable={false}
          />
        </section>
        <Story />
        <section
          id="capabilities"
          tabIndex={-1}
          className="section capabilities"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 / THE TOOLKIT</p>
              <h2>
                Connected skills.
                <br />
                <span className="muted">Useful in practice.</span>
              </h2>
            </div>
            <p className="section-intro">
              Data work rarely stays in one tool.
              <br />
              These are the foundations I bring together.
            </p>
          </div>
          <div className="capabilities-grid">
            {p.skillGroups
              .filter((g) => g.id !== "course-exposure")
              .map((g, i) => (
                <article key={g.id}>
                  <span className="capability-icon mono" aria-hidden="true">
                    {["[ ∑ ]", "↳ ↗", "{ : }", "< / >"][i]}
                  </span>
                  <h3>{g.title}</h3>
                  <p className="small evidence-label">
                    {i === 0
                      ? "Work experience & listed skills"
                      : i === 1
                        ? "Current-role activities"
                        : i === 2
                          ? "Resume-listed foundations"
                          : "Application & internship experience"}
                  </p>
                  <ul>
                    {g.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
          </div>
          <p className="course-exposure">
            <span className="mono">COURSE EXPOSURE</span>{" "}
            {p.skillGroups
              .find((g) => g.id === "course-exposure")
              ?.items.join(" · ")}
            <span className="small">
              Educational exposure, not a claim of production expertise.
            </span>
          </p>
        </section>
        <Experience profile={p} />
        <Learning profile={p} />
        <section id="about" className="section about">
          <div>
            <p className="eyebrow">07 / A LITTLE CONTEXT</p>
            <h2>
              Curiosity in.
              <br />
              <span className="accent">Clarity out.</span>
            </h2>
            <div className="about-mark" aria-hidden="true">
              [ b<span>p</span>. ]
            </div>
          </div>
          <div className="about-copy">
            <p className="large-copy">
              I’m Badrinath, a Data Operations Analyst based in Vadodara, India.
            </p>
            <p>
              My work brings together data validation, reporting and practical
              automation. Alongside my experience with Python and Microsoft
              Power Platform, I have built full-stack applications with React
              and Django.
            </p>
            <p>
              I’m pursuing an MCA with AI and growing toward Data Engineering
              and Analytics Engineering.
            </p>
            <div className="about-details">
              <div>
                <span className="eyebrow">BASED IN</span>
                <p>Vadodara, Gujarat, India</p>
              </div>
              <div>
                <span className="eyebrow">LANGUAGES</span>
                <p>
                  {p.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="section contact">
          <p className="eyebrow">08 / LET’S CONNECT</p>
          <h2>
            Let’s talk about data,
            <br />
            automation and
            <br />
            <span className="accent">useful tools.</span>
            <span className="contact-arrow" aria-hidden="true">
              ↗
            </span>
          </h2>
          <div className="contact-bottom">
            <div>
              <a className="email-link" href={`mailto:${p.identity.email}`}>
                {p.identity.email}
              </a>
              <CopyEmail email={p.identity.email} />
            </div>
            <div className="social-links">
              <a
                href={p.identity.links.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗<span className="sr-only"> (opens in new tab)</span>
              </a>
              <a
                href={p.identity.links.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗<span className="sr-only"> (opens in new tab)</span>
              </a>
              <Link href="/resume/">Résumé ↗</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
