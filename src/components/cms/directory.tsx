"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { SmartLink } from "@/components/smart-link";
import { cn } from "@/lib/utils";
import { LogoTile } from "./logo-tile";

export type DirectoryItem = { href: string; name: string; icon: string; description: string; category: string };
export type DirectoryTag = { slug: string; name: string; color: string; background: string };

/** Searchable, filterable grid of CMS items (integrations / destinations). */
export function Directory({ items, tags, searchLabel }: { items: DirectoryItem[]; tags: DirectoryTag[]; searchLabel: string }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const tagMap = React.useMemo(() => Object.fromEntries(tags.map((t) => [t.slug, t])), [tags]);
  // Only show filters that actually have items.
  const usedTags = tags.filter((t) => items.some((i) => i.category === t.slug));

  const q = query.trim().toLowerCase();
  const visible = items.filter(
    (i) =>
      (category === "all" || i.category === category) &&
      (!q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <label className="relative max-w-md">
          <span className="sr-only">{searchLabel}</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchLabel}
            className="h-12 w-full rounded-full border bg-white pr-4 pl-11 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {[{ slug: "all", name: "All" }, ...usedTags].map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setCategory(t.slug)}
              aria-pressed={category === t.slug}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                category === t.slug ? "border-primary bg-primary text-white" : "bg-white text-muted-foreground hover:text-foreground"
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing {visible.length} of {items.length}
      </p>

      {/* All items stay in the HTML (hidden when filtered) so crawlers can follow every link. */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => {
          const tag = tagMap[i.category];
          const shown = visible.includes(i);
          return (
            <li key={i.href} className={shown ? undefined : "hidden"}>
              <SmartLink
                href={i.href}
                className="group flex h-full gap-4 rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <LogoTile src={i.icon} alt={i.name} />
                <span className="flex min-w-0 flex-col gap-1.5">
                  {tag && (
                    <span
                      className="w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ color: tag.color || "var(--primary)", backgroundColor: tag.background || "var(--secondary)" }}
                    >
                      {tag.name}
                    </span>
                  )}
                  <span className="font-semibold text-ink group-hover:text-primary">{i.name}</span>
                  <span className="line-clamp-2 text-sm text-muted-foreground">{i.description}</span>
                </span>
              </SmartLink>
            </li>
          );
        })}
      </ul>
      {visible.length === 0 && <p className="py-10 text-center text-muted-foreground">No matches for “{query}”.</p>}
    </div>
  );
}
