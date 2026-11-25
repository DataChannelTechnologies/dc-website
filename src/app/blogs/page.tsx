import { CtaCards } from "@/components/sections/cta-cards";
import { PageHero } from "@/components/cms/page-hero";
import { PostCard } from "@/components/blog/post-card";
import { PostExplorer } from "@/components/blog/post-explorer";
import { toCard } from "@/components/blog/post-data";
import { getBlogPosts, getBlogTags } from "@/lib/cms";
import { homeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/blogs",
  title: "DataChannel - Blog | Get latest insights on ETL & Reverse ETL",
  description: "Read the latest insights by industry experts on all topics related to Data Engineering, ETL and Reverse ETL.",
});

export default function BlogIndexPage() {
  const posts = getBlogPosts();
  const featured = posts.filter((p) => p.featuredOnBlogPage || p.featureMain).slice(0, 3);
  const lead = featured[0] ?? posts[0];
  const side = (featured.length > 1 ? featured.slice(1) : posts.slice(1, 3)).slice(0, 2);
  return (
    <>
      <PageHero
        crumbs={[{ label: "Blog" }]}
        title="Data engineering insights"
        subtitle="The latest on ETL, Reverse ETL, data activation and the modern data stack from the DataChannel team."
      />
      <section className="pb-12">
        <div className="container-page grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
          {lead && <PostCard post={toCard(lead)} large />}
          <div className="grid gap-6">
            {side.map((p) => (
              <PostCard key={p.slug} post={toCard(p)} />
            ))}
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="container-page">
          <h2 className="mb-6 text-2xl font-bold text-ink">All posts</h2>
          <PostExplorer posts={posts.map(toCard)} tags={getBlogTags().map((t) => ({ slug: t.slug, name: t.name }))} />
        </div>
      </section>
      <CtaCards ctaCards={homeContent.ctaCards} />
    </>
  );
}
