import type { NextConfig } from "next";
const pages = process.env.GITHUB_PAGES === "true";
const config: NextConfig = {
  poweredByHeader: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  ...(pages
    ? {
        output: "export" as const,
        distDir: "out",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                {
                  key: "Referrer-Policy",
                  value: "strict-origin-when-cross-origin",
                },
                { key: "X-Frame-Options", value: "DENY" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()",
                },
              ],
            },
          ];
        },
      }),
};
export default config;
