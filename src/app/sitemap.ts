import type { MetadataRoute } from "next";

import { getDestinations, getEtlSources, getIntegrations, getReverseEtlDestinations, getWarehouses } from "@/lib/cms";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** Lists every page that exists on this site, using the original Webflow URL paths. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/integrations",
    "/destinations",
    "/data-warehouses",
    ...getIntegrations().map((i) => `/integration/${i.slug}`),
    ...getDestinations().map((d) => `/destinations/${d.slug}`),
    ...getWarehouses().map((w) => `/warehouses/${w.slug}`),
    ...getEtlSources().map((e) => `/etl-sources/${e.slug}`),
    ...getReverseEtlDestinations().map((r) => `/reverse-etl-destinations/${r.slug}`),
  ];
  return paths.map((p) => ({ url: `${SITE_URL}${p}` }));
}
