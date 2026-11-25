import { Clock } from "lucide-react";

import { SmartLink } from "@/components/smart-link";
import type { Author, BlogPost, BlogTag } from "@/lib/cms";
import { cn } from "@/lib/utils";

export type PostCardData = Pick<BlogPost, "slug" | "name" | "summary" | "image" | "readTime" | "tag"> & {
  tagData?: Pick<BlogTag, "name" | "color" | "background">;
  authorData?: Pick<Author, "name" | "image">;
};

export function PostCard({ post, large, className }: { post: PostCardData; large?: boolean; className?: string }) {
  return (
    <article className={cn("group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-0.5 hover:shadow-lg", className)}>
      <div className={cn("overflow-hidden bg-muted", large ? "aspect-[16/8]" : "aspect-[16/9]")}>
        {post.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt="" loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {post.tagData && (
          <span
            className="w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ color: post.tagData.color || "var(--primary)", backgroundColor: post.tagData.background || "var(--secondary)" }}
          >
            {post.tagData.name}
          </span>
        )}
        <h3 className={cn("font-bold text-ink group-hover:text-primary", large ? "text-2xl" : "text-lg")}>
          <SmartLink href={`/blogs/${post.slug}`} className="after:absolute after:inset-0">
            {post.name}
          </SmartLink>
        </h3>
        {post.summary && <p className="line-clamp-2 text-sm text-muted-foreground">{post.summary}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          {post.authorData && (
            <span className="flex items-center gap-2">
              {post.authorData.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.authorData.image} alt="" className="size-6 rounded-full object-cover" />
              )}
              {post.authorData.name}
            </span>
          )}
          {post.readTime && (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> {post.readTime}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
