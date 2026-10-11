import { SiteLink as Link } from "@/components/layout/SiteLink";
import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";
import { MotionProvider } from "@/components/motion/Preferences";
import { Header } from "@/components/layout/Header";
import { getOrigin, siteUrl } from "@/lib/config";
const origin = getOrigin();
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Badrinath Pandey — From Data to Decision",
    template: "%s | Badrinath Pandey",
  },
  description:
    "Data Operations Analyst at NielsenIQ in Vadodara, India. Data quality, reporting, practical automation and full-stack applications.",
  robots: { index: !!origin, follow: !!origin },
  ...(origin
    ? {
        metadataBase: new URL(siteUrl()),
        alternates: { canonical: siteUrl() },
        openGraph: {
          type: "website",
          url: siteUrl(),
          title: "Badrinath Pandey — From Data to Decision",
          description: "Data quality. Practical automation. Clearer decisions.",
          images: [
            { url: siteUrl("/opengraph-image"), width: 1200, height: 630 },
          ],
        },
      }
    : {}),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Some browser integrations add a root `hydrated` class before React starts.
    // Tolerate root attributes only; content hydration remains fully checked.
    <html lang="en" suppressHydrationWarning>
      <body>
        <noscript>
          <style>{`.menu-trigger,.motion-menu,.work-controls,.work-meta,.scene-explore{display:none!important}.nav{display:flex!important;position:static!important;flex-wrap:wrap;padding:10px;flex-direction:row!important}.header-inner{flex-wrap:wrap}.header{position:relative}`}</style>
        </noscript>
        <MotionProvider>
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          <Header />
          {children}
          <footer className="footer">
            <Link className="wordmark" href="/" aria-label="Back to home">
              bp<span>.</span>
            </Link>
            <p>Thoughtful data. Useful outcomes.</p>
            <span className="mono small">Badrinath Pandey · 2026</span>
            <a href="#main" className="text-link">
              Back to top ↑
            </a>
          </footer>
        </MotionProvider>
      </body>
    </html>
  );
}
