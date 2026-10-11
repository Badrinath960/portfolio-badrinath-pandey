import type { ComponentProps } from "react";
import { sitePath } from "@/lib/config";

// Document navigation works on plain static hosts without RSC segment rewrites.
// The portfolio has only two public pages; in-page navigation stays immediate.
export function SiteLink({
  href,
  ...props
}: ComponentProps<"a"> & { href: string }) {
  return <a href={sitePath(href)} {...props} />;
}
