import { ArrowRight, Quote } from "lucide-react";

import { SmartLink } from "@/components/smart-link";
import type { CaseStudy } from "@/lib/cms";

export function CaseStudyGrid({ items }: { items: CaseStudy[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <li key={c.slug}>
          <SmartLink
            href={`/case-study/${c.slug}`}
            className="group flex h-full flex-col gap-5 rounded-2xl border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Quote className="size-7 text-primary/40" />
            <p className="font-semibold text-ink">&ldquo;{c.name}&rdquo;</p>
            <div className="mt-auto flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">{c.personName}</p>
                <p className="text-xs text-muted-foreground">{c.personRole}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
                Read case study <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}
