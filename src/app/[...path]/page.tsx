import { notFound } from "next/navigation";

import { Blocks } from "@/components/blocks/blocks";
import { getPageByPath, getPages } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

// Serves every section-based page from content/pages at its own `path`.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPages().map((p) => ({ path: p.path.slice(1).split("/") }));
}

export async function generateMetadata({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const page = getPageByPath(`/${path.join("/")}`);
  if (!page) return {};
  const hero = page.blocks.find((b) => b.type === "hero");
  return {
    ...pageMetadata({
      path: page.path,
      title: page.seoTitle || page.title,
      description: page.seoDescription,
      image: hero && hero.type === "hero" ? hero.image : undefined,
    }),
    ...(page.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function SectionPage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const page = getPageByPath(`/${path.join("/")}`);
  if (!page) notFound();
  return <Blocks blocks={page.blocks} />;
}
