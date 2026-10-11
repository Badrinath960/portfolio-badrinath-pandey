import "server-only";
import data from "@/content/public-profile.json";
import { publicProfileSchema } from "./schema";
const profile = publicProfileSchema.parse(data);
export const getPublicProfile = () => profile;
export const listProjects = () =>
  profile.projects
    .filter((p) => p.publication !== "draft")
    .sort(
      (a, b) =>
        a.featuredRank - b.featuredRank || a.title.localeCompare(b.title),
    );
export const listCredentials = () => profile.credentials;
export const getPublishedProject = (slug: string) =>
  profile.projects.find(
    (p) => p.slug === slug && p.publication === "published" && p.caseStudy,
  );
