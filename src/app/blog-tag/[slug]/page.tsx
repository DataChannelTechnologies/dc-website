import { notFound } from "next/navigation";

import { PageHero } from "@/components/cms/page-hero";
import { PostCard } from "@/components/blog/post-card";
import { toCard } from "@/components/blog/post-data";
import { getBlogPosts, getBlogTag, getBlogTags } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogTags().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getBlogTag(slug);
  if (!t) return {};
  return pageMetadata({
    path: `/blog-tag/${t.slug}`,
    title: t.seoTitle || `${t.name} articles | DataChannel Blog`,
    description: t.seoDescription || `Articles about ${t.name.toLowerCase()} from the DataChannel Data Engineering Blog: guides, tutorials and industry insights.`,
  });
}

export default async function BlogTagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = getBlogTag(slug);
  if (!tag) notFound();
  const posts = getBlogPosts().filter((p) => p.tag === tag.slug);
  return (
    <>
      <PageHero
        crumbs={[{ label: "Blog", href: "/blogs" }, { label: tag.name }]}
        title={tag.name}
        subtitle={`${posts.length} articles on ${tag.name.toLowerCase()} from the DataChannel team.`}
      />
      <section className="pb-20">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={toCard(p)} />
          ))}
        </div>
      </section>
    </>
  );
}
