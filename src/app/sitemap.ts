import type { MetadataRoute } from "next";

import {
  getAuthors,
  getBlogPosts,
  getBlogTags,
  getCareers,
  getCaseStudies,
  getDestinations,
  getEtlSources,
  getIntegrations,
  getReverseEtlDestinations,
  getWarehouses,
} from "@/lib/cms";
import { getPages } from "@/lib/pages";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** Lists every indexable page on this site, using the original Webflow URL paths. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: { path: string; lastModified?: string }[] = [
    { path: "" },
    { path: "/integrations" },
    { path: "/destinations" },
    { path: "/data-warehouses" },
    { path: "/blogs" },
    { path: "/case-studies" },
    { path: "/careers" },
    ...getPages().filter((p) => !p.noindex).map((p) => ({ path: p.path })),
    ...getIntegrations().map((i) => ({ path: `/integration/${i.slug}` })),
    ...getDestinations().map((d) => ({ path: `/destinations/${d.slug}` })),
    ...getWarehouses().map((w) => ({ path: `/warehouses/${w.slug}` })),
    ...getEtlSources().map((e) => ({ path: `/etl-sources/${e.slug}` })),
    ...getReverseEtlDestinations().map((r) => ({ path: `/reverse-etl-destinations/${r.slug}` })),
    ...getBlogPosts().map((p) => ({ path: `/blogs/${p.slug}`, lastModified: p.updated || p.date || undefined })),
    ...getAuthors().map((a) => ({ path: `/author/${a.slug}` })),
    ...getBlogTags().map((t) => ({ path: `/blog-tag/${t.slug}` })),
    ...getCaseStudies().map((c) => ({ path: `/case-study/${c.slug}` })),
    ...getCareers().map((c) => ({ path: `/career/${c.slug}` })),
  ];
  return entries.map((e) => ({ url: `${SITE_URL}${e.path}`, ...(e.lastModified ? { lastModified: e.lastModified } : {}) }));
}
