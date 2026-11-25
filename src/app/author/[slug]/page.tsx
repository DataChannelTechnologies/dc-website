import { notFound } from "next/navigation";

import { PageHero } from "@/components/cms/page-hero";
import { PostCard } from "@/components/blog/post-card";
import { toCard } from "@/components/blog/post-data";
import { getAuthor, getAuthors, getBlogPosts } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getAuthor(slug);
  if (!a) return {};
  return pageMetadata({
    path: `/author/${a.slug}`,
    title: a.seoTitle || `${a.name} | DataChannel`,
    description: a.seoDescription || `List of articles written by ${a.name} on DataChannel's Data Engineering Blog`,
    image: a.image,
  });
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const posts = getBlogPosts().filter((p) => p.author === author.slug);
  return (
    <>
      <PageHero
        crumbs={[{ label: "Blog", href: "/blogs" }, { label: author.name }]}
        eyebrow={
          author.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={author.image} alt={author.name} className="size-20 rounded-full border-4 border-white object-cover shadow-lg" />
          ) : undefined
        }
        title={author.name}
        subtitle={`${posts.length} article${posts.length === 1 ? "" : "s"} on the DataChannel Data Engineering Blog`}
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
