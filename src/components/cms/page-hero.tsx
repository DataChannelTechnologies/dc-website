import { CheckCircle2 } from "lucide-react";

import { Breadcrumbs, type Crumb } from "./breadcrumbs";

/** Hero used by every CMS template: breadcrumbs, title, copy, actions and an optional visual. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  subtitle,
  bullets,
  actions,
  perks,
  visual,
}: {
  crumbs: Crumb[];
  eyebrow?: React.ReactNode;
  title: string;
  subtitle?: string;
  bullets?: string[];
  actions?: React.ReactNode;
  perks?: string[];
  visual?: React.ReactNode;
}) {
  return (
    <section className="relative isolate -mt-16 overflow-hidden pt-16 lg:-mt-[4.5rem] lg:pt-[4.5rem]">
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-brand-blue/10 to-transparent blur-3xl" />
      <div className="container-page pt-8 pb-16 lg:pt-12 lg:pb-20">
        <Breadcrumbs items={crumbs} />
        <div className={`mt-8 grid grid-cols-1 items-center gap-12 ${visual ? "lg:grid-cols-[1.15fr_1fr]" : ""}`}>
          <div className="flex min-w-0 flex-col items-start gap-5">
            {eyebrow}
            <h1 className="text-3xl font-extrabold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl lg:leading-[1.08]">
              {title}
            </h1>
            {subtitle && <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{subtitle}</p>}
            {bullets && bullets.length > 0 && (
              <ul className="flex flex-col gap-2.5">
                {bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /> <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {actions && <div className="flex flex-col gap-3 pt-1 sm:flex-row">{actions}</div>}
            {perks && (
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-primary" /> {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {visual && <div className="min-w-0">{visual}</div>}
        </div>
      </div>
    </section>
  );
}
