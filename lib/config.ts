export const features = {
  scene3d: true,
  aiWorkflowDemo: true,
  liveAiAssistant: false,
  analytics: false,
  contactForm: false,
} as const;
export function getOrigin() {
  const value = process.env.SITE_ORIGIN;
  if (!value) return undefined;
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("SITE_ORIGIN must be HTTPS");
  return url.origin;
}
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const sitePath = (path: string) => `${basePath}${path}`;
export const siteUrl = (path = "/") =>
  `${getOrigin() || "http://127.0.0.1:3000"}${sitePath(path)}`;
