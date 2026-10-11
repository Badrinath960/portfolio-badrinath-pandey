import { SiteLink as Link } from "@/components/layout/SiteLink";
export default function NotFound() {
  return (
    <main id="main" className="section not-found">
      <p className="eyebrow">404 / NOT IN THIS DATASET</p>
      <h1>A small detour.</h1>
      <p>This page isn’t available. There’s still plenty to explore.</p>
      <Link className="button" href="/#work">
        Back to work →
      </Link>
      <Link className="text-link" href="/#contact">
        Get in touch
      </Link>
    </main>
  );
}
