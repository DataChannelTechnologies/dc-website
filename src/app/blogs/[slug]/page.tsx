import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";

import { Breadcrumbs } from "@/components/cms/breadcrumbs";
import { CtaCards } from "@/components/sections/cta-cards";
import { PostCard } from "@/components/blog/post-card";
import { toCard } from "@/components/blog/post-data";
import { SmartLink } from "@/components/smart-link";
import { getAuthor, getBlogPost, getBlogPosts, getBlogTag, renderArticle } from "@/lib/cms";
import { formatDate, homeContent } from "@/lib/content";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getBlogPost(slug);
  if (!p) return {};
  const meta = pageMetadata({
    path: `/blogs/${p.slug}`,
    title: p.seoTitle || p.name,
    description: p.seoDescription || p.summary,
    image: p.image,
  });
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: p.date, modifiedTime: p.updated } };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const tag = getBlogTag(post.tag);
  const author = getAuthor(post.author);
  const { html, toc } = renderArticle(post.content);
  const related = getBlogPosts()
    .filter((p) => p.slug !== post.slug && p.tag === post.tag)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.name,
    description: post.summary,
    image: post.image ? `${SITE_URL}${post.image}` : undefined,
    datePublished: post.date || undefined,
    dateModified: post.updated || post.date || undefined,
    author: author ? { "@type": "Person", name: author.name, url: `${SITE_URL}/author/${author.slug}` } : undefined,
    publisher: { "@type": "Organization", name: "DataChannel", logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` } },
    mainEntityOfPage: `${SITE_URL}/blogs/${post.slug}`,
  };

  return (
    <>
      <article>
        <header className="relative isolate -mt-16 overflow-hidden pt-16 lg:-mt-[4.5rem] lg:pt-[4.5rem]">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary to-white" />
          <div className="container-page max-w-4xl pt-8 pb-10 lg:pt-12">
            <Breadcrumbs items={[{ label: "Blog", href: "/blogs" }, ...(tag ? [{ label: tag.name, href: `/blog-tag/${tag.slug}` }] : []), { label: post.name }]} />
            <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl lg:leading-[1.1]">{post.name}</h1>
            {post.summary && <p className="mt-5 text-lg text-muted-foreground">{post.summary}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {author && (
                <SmartLink href={`/author/${author.slug}`} className="flex items-center gap-2.5 font-semibold text-ink hover:text-primary">
                  {author.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={author.image} alt="" className="size-9 rounded-full object-cover" />
                  )}
                  {author.name}
                </SmartLink>
              )}
              {post.date && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </span>
              )}
              {post.readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" /> {post.readTime}
                </span>
              )}
            </div>
          </div>
          {post.image && (
            <div className="container-page max-w-5xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.name} className="w-full rounded-3xl border shadow-xl" />
            </div>
          )}
        </header>

        <div className="container-page grid max-w-6xl gap-12 py-14 lg:grid-cols-[1fr_240px]">
          <div
            className="prose prose-slate prose-lg max-w-none prose-headings:scroll-mt-28 prose-headings:text-ink prose-a:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-img:mx-auto prose-img:rounded-xl prose-img:border [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-xl"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {toc.length > 2 && (
            <aside className="hidden lg:block">
              <nav aria-label="Table of contents" className="sticky top-28 flex flex-col gap-3 border-l pl-5">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">On this page</p>
                {toc.map((h) => (
                  <a key={h.id} href={`#${h.id}`} className="text-sm leading-snug text-muted-foreground hover:text-primary">
                    {h.text}
                  </a>
                ))}
              </nav>
            </aside>
          )}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </article>

      {related.length > 0 && (
        <section className="bg-muted/60 py-16">
          <div className="container-page">
            <h2 className="mb-8 text-2xl font-bold text-ink">Related posts</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={toCard(p)} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaCards ctaCards={homeContent.ctaCards} />
    </>
  );
}
