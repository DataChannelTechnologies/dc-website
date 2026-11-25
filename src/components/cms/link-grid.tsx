import { ArrowUpRight } from "lucide-react";

import { SmartLink } from "@/components/smart-link";
import { LogoTile } from "./logo-tile";

export type LinkGridItem = { href: string; name: string; icon?: string; description?: string; meta?: React.ReactNode };

/** Grid of linked cards (logo + name + optional description). Used for related/available items. */
export function LinkGrid({ items, columns = 3 }: { items: LinkGridItem[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <ul className={`grid gap-4 ${cols}`}>
      {items.map((i) => (
        <li key={i.href}>
          <SmartLink
            href={i.href}
            className="group flex h-full items-start gap-4 rounded-2xl border bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            <LogoTile src={i.icon} alt={i.name} size="sm" />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate font-semibold text-ink group-hover:text-primary">{i.name}</span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
              </span>
              {i.meta}
              {i.description && <span className="line-clamp-2 text-sm text-muted-foreground">{i.description}</span>}
            </span>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}
