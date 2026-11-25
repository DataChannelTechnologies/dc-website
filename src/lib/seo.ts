import type { Metadata } from "next";

export const SITE_URL = "https://www.datachannel.co";

/** Page metadata with a canonical URL that matches the original Webflow path exactly (no trailing slash). */
export function pageMetadata({ path, title, description, image }: { path: string; title: string; description: string; image?: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", ...(image ? { images: [image] } : {}) },
    twitter: { card: "summary_large_image", title, description },
  };
}
