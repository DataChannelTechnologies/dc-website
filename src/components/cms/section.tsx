import { cn } from "@/lib/utils";

export function Section({
  title,
  subtitle,
  children,
  muted,
  id,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  muted?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-14 lg:py-20", muted && "bg-muted/60", className)}>
      <div className="container-page">
        {(title || subtitle) && (
          <div className="mb-10 flex max-w-3xl flex-col gap-3">
            {title && <h2 className="text-2xl font-bold tracking-tight text-balance text-ink sm:text-3xl">{title}</h2>}
            {subtitle && <p className="text-muted-foreground sm:text-lg">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
