import { SiteLink as Link } from "@/components/layout/SiteLink";
import { notFound } from "next/navigation";
export const dynamicParams = false;
import { getPublishedProject, listProjects } from "@/lib/content/provider";
export function generateStaticParams() {
  return listProjects()
    .filter((p) => p.publication === "published")
    .map((p) => ({ slug: p.slug }));
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    p = getPublishedProject(slug);
  if (!p?.caseStudy) notFound();
  return (
    <main className="section resume-page" id="main">
      <Link href="/#work">← Selected work</Link>
      <p className="eyebrow">CASE STUDY</p>
      <h1>{p.title}</h1>
      <p>{p.summary}</p>
      <h2>Problem</h2>
      <p>{p.caseStudy.problem}</p>
      <h2>My contribution</h2>
      <p>{p.caseStudy.contribution}</p>
      <h2>Process</h2>
      <ol>
        {p.caseStudy.process.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <h2>Tools</h2>
      <p>{p.tools.join(", ")}</p>
      <h2>Result</h2>
      <p>{p.caseStudy.result}</p>
      <h2>Limitations</h2>
      <p>{p.caseStudy.limitations}</p>
      <h2>Evidence</h2>
      <p>{p.caseStudy.evidence.join(", ")}</p>
    </main>
  );
}
