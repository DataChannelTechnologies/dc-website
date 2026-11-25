import type { Tag } from "@/lib/cms";

export function TagBadge({ tag }: { tag?: Tag }) {
  if (!tag) return null;
  return (
    <span
      className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ color: tag.color || "var(--primary)", backgroundColor: tag.background || "var(--secondary)" }}
    >
      {tag.name}
    </span>
  );
}
