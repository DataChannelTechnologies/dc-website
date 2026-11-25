// Content is stored as JSON in /content and edited through Decap CMS (/admin).
// Types are inferred from the JSON so the page breaks loudly at build time
// if the CMS schema and the components drift apart.
import home from "@content/home.json";
import site from "@content/site.json";

export type HomeContent = typeof home;
export type SiteContent = typeof site;
export type Link = { label: string; href: string };

export const homeContent: HomeContent = home;
export const siteContent: SiteContent = site;

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
