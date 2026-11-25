import { cn } from "@/lib/utils";

/** Square tile showing a logo/icon, falling back to the item's initials. */
export function LogoTile({ src, alt, size = "md", className }: { src?: string; alt: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const box = { sm: "size-10 rounded-lg p-1.5", md: "size-14 rounded-xl p-2.5", lg: "size-20 rounded-2xl p-3.5" }[size];
  return (
    <span className={cn("grid shrink-0 place-items-center border bg-white shadow-xs", box, className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" className="size-full object-contain" />
      ) : (
        <span className="text-sm font-bold text-primary">{alt.slice(0, 2).toUpperCase()}</span>
      )}
    </span>
  );
}
