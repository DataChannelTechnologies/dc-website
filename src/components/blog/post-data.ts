import "server-only";

import { getAuthor, getBlogTag, type BlogPost } from "@/lib/cms";
import type { PostCardData } from "./post-card";

/** Shapes a post for cards (keeps the payload small for client components). */
export function toCard(p: BlogPost): PostCardData {
  const tag = getBlogTag(p.tag);
  const author = getAuthor(p.author);
  return {
    slug: p.slug,
    name: p.name,
    summary: p.summary,
    image: p.image,
    readTime: p.readTime,
    tag: p.tag,
    tagData: tag ? { name: tag.name, color: tag.color, background: tag.background } : undefined,
    authorData: author ? { name: author.name, image: author.image } : undefined,
  };
}
