import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && <Badge variant={dark ? "dark" : "secondary"}>{eyebrow}</Badge>}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          dark ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-base text-pretty sm:text-lg", dark ? "text-white/70" : "text-muted-foreground")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
