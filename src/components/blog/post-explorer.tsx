"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { PostCard, type PostCardData } from "./post-card";

const PAGE = 12;

/** Filter + search + "load more" over all posts. Every post link is in the HTML for crawlers. */
export function PostExplorer({ posts, tags }: { posts: PostCardData[]; tags: { slug: string; name: string }[] }) {
  const [tag, setTag] = React.useState("all");
  const [q, setQ] = React.useState("");
  const [limit, setLimit] = React.useState(PAGE);
  const query = q.trim().toLowerCase();
  const matches = posts.filter(
    (p) => (tag === "all" || p.tag === tag) && (!query || p.name.toLowerCase().includes(query) || p.summary.toLowerCase().includes(query))
  );
  const shown = new Set(matches.slice(0, limit).map((p) => p.slug));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {[{ slug: "all", name: "All posts" }, ...tags].map((t) => (
            <button
              key={t.slug}
              type="button"
              aria-pressed={tag === t.slug}
              onClick={() => {
                setTag(t.slug);
                setLimit(PAGE);
              }}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                tag === t.slug ? "border-primary bg-primary text-white" : "bg-white text-muted-foreground hover:text-foreground"
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
        <label className="relative w-full md:max-w-xs">
          <span className="sr-only">Search posts</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setLimit(PAGE);
            }}
            placeholder="Search posts"
            className="h-11 w-full rounded-full border bg-white pr-4 pl-11 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          />
        </label>
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug} className={shown.has(p.slug) ? undefined : "hidden"}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
      {matches.length === 0 && <p className="py-10 text-center text-muted-foreground">No posts match your search.</p>}
      {matches.length > limit && (
        <button
          type="button"
          onClick={() => setLimit((l) => l + PAGE)}
          className="mx-auto rounded-full border bg-white px-6 py-2.5 text-sm font-semibold text-ink shadow-xs hover:bg-accent"
        >
          Load more ({matches.length - limit} remaining)
        </button>
      )}
    </div>
  );
}
