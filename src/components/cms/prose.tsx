import { renderMarkdown } from "@/lib/cms";
import { cn } from "@/lib/utils";

/** Renders CMS Markdown with consistent typography. */
export function Prose({ markdown, className }: { markdown: string; className?: string }) {
  if (!markdown) return null;
  return (
    <div
      className={cn(
        "prose prose-slate max-w-none prose-headings:text-ink prose-a:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-img:rounded-xl",
        className
      )}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
    />
  );
}
