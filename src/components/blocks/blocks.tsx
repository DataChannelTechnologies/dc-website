import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cloud,
  Code2,
  Database,
  DollarSign,
  FileText,
  Filter,
  Globe,
  Headphones,
  Layers,
  Lock,
  Minus,
  Plug,
  Quote,
  RefreshCw,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmartLink } from "@/components/smart-link";
import { Prose } from "@/components/cms/prose";
import { CtaCards } from "@/components/sections/cta-cards";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { NetlifyForm } from "@/components/forms/netlify-form";
import { renderMarkdown, toEmbedUrl } from "@/lib/cms";
import { homeContent } from "@/lib/content";
import type * as B from "@/lib/pages";
import { cn } from "@/lib/utils";

/** Icon names usable from the CMS (featureGrid items). */
export const ICONS: Record<string, LucideIcon> = {
  check: Check,
  zap: Zap,
  shield: ShieldCheck,
  database: Database,
  chart: BarChart3,
  clock: Clock,
  users: Users,
  globe: Globe,
  layers: Layers,
  workflow: Workflow,
  sparkles: Sparkles,
  rocket: Rocket,
  plug: Plug,
  refresh: RefreshCw,
  lock: Lock,
  settings: Settings,
  dollar: DollarSign,
  support: Headphones,
  trending: TrendingUp,
  filter: Filter,
  bell: Bell,
  code: Code2,
  cloud: Cloud,
  file: FileText,
};

function Ctas({ ctas, dark }: { ctas?: B.CtaLink[]; dark?: boolean }) {
  if (!ctas?.length) return null;
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {ctas.map((c, i) => {
        const primary = (c.variant ?? (i === 0 ? "primary" : "outline")) === "primary";
        return (
          <Button key={c.label + c.href} asChild size="lg" variant={primary ? (dark ? "white" : "default") : "outline"} className={!primary && dark ? "border-white/30 bg-transparent text-white hover:bg-white/10" : undefined}>
            <SmartLink href={c.href}>
              {c.label} {primary && <ArrowRight />}
            </SmartLink>
          </Button>
        );
      })}
    </div>
  );
}

function Heading({ eyebrow, heading, subtitle, center, dark }: { eyebrow?: string; heading?: string; subtitle?: string; center?: boolean; dark?: boolean }) {
  if (!heading && !subtitle && !eyebrow) return null;
  return (
    <div className={cn("mb-10 flex max-w-3xl flex-col gap-3", center && "mx-auto items-center text-center")}>
      {eyebrow && <Badge variant={dark ? "dark" : "secondary"}>{eyebrow}</Badge>}
      {heading && <h2 className={cn("text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl", dark ? "text-white" : "text-ink")}>{heading}</h2>}
      {subtitle && <p className={cn("sm:text-lg", dark ? "text-white/70" : "text-muted-foreground")}>{subtitle}</p>}
    </div>
  );
}

function Shell({ children, muted, dark, className }: { children: React.ReactNode; muted?: boolean; dark?: boolean; className?: string }) {
  return (
    <section className={cn("py-14 lg:py-20", muted && "bg-muted/60", dark && "bg-ink text-white", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

function EmbedFrame({ embed, title }: { embed: B.Embed; title: string }) {
  let src: string | null = embed.url;
  if (embed.kind === "video") src = toEmbedUrl(embed.url);
  if (embed.kind === "hubspot-meeting" && !/[?&]embed=true/.test(embed.url)) src = `${embed.url}${embed.url.includes("?") ? "&" : "?"}embed=true`;
  if (!src) return null;
  const isVideo = embed.kind === "video";
  return (
    <div className={cn("overflow-hidden rounded-2xl border bg-white shadow-lg", isVideo && "aspect-video")}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        className="w-full"
        style={isVideo ? { height: "100%" } : { height: embed.height ?? (embed.kind === "hubspot-meeting" ? 700 : 600) }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function Hero({ b, isFirst }: { b: B.HeroBlock; isFirst: boolean }) {
  const center = b.align === "center" && !b.image && !b.embed;
  const side = b.image || b.embed;
  return (
    <section className={cn("relative isolate overflow-hidden", isFirst && "-mt-16 pt-16 lg:-mt-[4.5rem] lg:pt-[4.5rem]")}>
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-brand-blue/10 to-transparent blur-3xl" />
      <div className={cn("container-page grid grid-cols-1 items-center gap-12 pt-12 pb-16 lg:pt-20 lg:pb-20", side && "lg:grid-cols-[1.05fr_1fr]")}>
        <div className={cn("flex min-w-0 flex-col gap-5", center ? "mx-auto max-w-3xl items-center text-center" : "items-start")}>
          {b.eyebrow && <Badge>{b.eyebrow}</Badge>}
          {/* Every page has exactly one H1: the hero title. */}
          {isFirst ? (
            <h1 className="text-3xl font-extrabold tracking-tight text-balance text-ink sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">{b.title}</h1>
          ) : (
            <h2 className="text-3xl font-extrabold tracking-tight text-balance text-ink sm:text-4xl">{b.title}</h2>
          )}
          {b.subtitle && (
            <div
              className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg [&_a]:text-primary [&_p+p]:mt-3"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(b.subtitle) }}
            />
          )}
          <Ctas ctas={b.ctas} />
          {b.perks && b.perks.length > 0 && (
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {b.perks.map((p) => (
                <li key={p} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-primary" /> {p}
                </li>
              ))}
            </ul>
          )}
        </div>
        {b.embed ? (
          <div className="min-w-0"><EmbedFrame embed={b.embed} title={b.title} /></div>
        ) : b.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.image} alt="" className="mx-auto w-full max-w-xl" />
        ) : null}
      </div>
    </section>
  );
}

function Split({ b }: { b: B.SplitBlock }) {
  return (
    <Shell muted={b.muted}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={cn("flex flex-col gap-5", b.imagePosition === "left" && "lg:order-2")}>
          {b.eyebrow && <Badge>{b.eyebrow}</Badge>}
          <h2 className="text-2xl font-bold tracking-tight text-balance text-ink sm:text-3xl">{b.heading}</h2>
          {b.body && <Prose markdown={b.body} />}
          {b.bullets && b.bullets.length > 0 && (
            <ul className="flex flex-col gap-2.5">
              {b.bullets.map((x) => (
                <li key={x} className="flex gap-2.5 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /> {x}
                </li>
              ))}
            </ul>
          )}
          <Ctas ctas={b.ctas} />
        </div>
        {b.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.image} alt={b.heading} loading="lazy" className="mx-auto w-full max-w-xl" />
        ) : (
          <div className="hidden lg:block" />
        )}
      </div>
    </Shell>
  );
}

function FeatureGrid({ b }: { b: B.FeatureGridBlock }) {
  const dark = b.style === "dark";
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[b.columns ?? 3];
  return (
    <Shell dark={dark}>
      <Heading eyebrow={b.eyebrow} heading={b.heading} subtitle={b.subtitle} center dark={dark} />
      <ul className={cn("grid gap-5", cols)}>
        {b.items.map((it) => {
          const Icon = it.icon ? ICONS[it.icon] : undefined;
          return (
            <li
              key={it.title}
              className={cn(
                "flex flex-col gap-3",
                b.style !== "plain" && "rounded-2xl border p-6",
                dark ? "border-white/10 bg-white/[0.04]" : b.style !== "plain" && "bg-white"
              )}
            >
              {it.image ? (
                b.imageStyle === "photo" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt={it.title} loading="lazy" className="size-28 self-start rounded-full object-cover shadow-md" />
                ) : b.imageStyle === "cover" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt="" loading="lazy" className={cn("aspect-[16/9] w-full rounded-xl object-cover", b.style !== "plain" && "-mt-1")} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt="" loading="lazy" className="h-12 w-auto self-start object-contain" />
                )
              ) : Icon ? (
                <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-brand-blue text-white">
                  <Icon className="size-5" />
                </span>
              ) : null}
              <h3 className={cn("text-lg font-bold", dark ? "text-white" : "text-ink")}>{it.title}</h3>
              {it.body && (
                <div
                  className={cn("text-sm leading-relaxed [&_a]:text-primary [&_p+p]:mt-2", dark ? "text-white/70" : "text-muted-foreground")}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(it.body) }}
                />
              )}
              {it.link && (
                <SmartLink href={it.link.href} className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-primary">
                  {it.link.label} <ArrowRight className="size-4" />
                </SmartLink>
              )}
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}

function Cell({ v, highlight }: { v: string; highlight?: boolean }) {
  const s = v.trim().toLowerCase();
  if (s === "yes" || s === "✓" || s === "true")
    return <Check className={cn("mx-auto size-5", highlight ? "text-primary" : "text-emerald-600")} aria-label="Yes" />;
  if (s === "no" || s === "✗" || s === "false" || s === "x") return <X className="mx-auto size-5 text-rose-500" aria-label="No" />;
  if (s === "partial" || s === "limited") return <Minus className="mx-auto size-5 text-amber-500" aria-label="Partial" />;
  return <span className="text-sm">{v}</span>;
}

function ComparisonTable({ b }: { b: B.ComparisonTableBlock }) {
  const hl = b.highlightColumn ?? 1;
  return (
    <Shell>
      <Heading heading={b.heading} subtitle={b.subtitle} center />
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-muted/60">
              {b.columns.map((c, i) => (
                <th key={c + i} scope="col" className={cn("px-5 py-4 text-sm font-semibold text-ink", i > 0 && "text-center", i === hl && "bg-primary/10 text-primary")}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r) => (
              <tr key={r.feature} className="border-b last:border-0">
                <th scope="row" className="px-5 py-3.5 text-sm font-medium text-ink">{r.feature}</th>
                {r.values.map((v, i) => (
                  <td key={i} className={cn("px-5 py-3.5 text-center text-muted-foreground", i + 1 === hl && "bg-primary/5")}>
                    <Cell v={v} highlight={i + 1 === hl} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {b.note && <Prose markdown={b.note} className="mt-6 text-sm" />}
    </Shell>
  );
}

function Pricing({ b }: { b: B.PricingBlock }) {
  return (
    <Shell>
      <Heading heading={b.heading} subtitle={b.subtitle} center />
      <ul className={cn("grid gap-6", b.plans.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-3")}>
        {b.plans.map((p) => (
          <li
            key={p.name}
            className={cn(
              "relative flex flex-col gap-5 rounded-3xl border bg-white p-7",
              p.highlighted && "border-primary shadow-xl shadow-primary/15 ring-1 ring-primary"
            )}
          >
            {p.highlighted && <Badge variant="default" className="absolute -top-3 left-7">Most popular</Badge>}
            <div>
              <h3 className="text-lg font-bold text-ink">{p.name}</h3>
              {p.description && <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>}
            </div>
            <p className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-ink">{p.price}</span>
              {p.period && <span className="text-sm text-muted-foreground">{p.period}</span>}
            </p>
            <Button asChild variant={p.highlighted ? "default" : "outline"} className="w-full">
              <SmartLink href={p.cta.href}>{p.cta.label}</SmartLink>
            </Button>
            <ul className="flex flex-col gap-2.5 border-t pt-5">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {b.note && <Prose markdown={b.note} className="mx-auto mt-8 max-w-3xl text-center text-sm" />}
    </Shell>
  );
}

function Testimonials({ b }: { b: B.TestimonialsBlock }) {
  return (
    <Shell muted>
      <Heading heading={b.heading} subtitle={b.subtitle} center />
      <ul className={cn("grid gap-5", b.items.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
        {b.items.map((t) => (
          <li key={t.name + t.quote.slice(0, 20)} className="flex flex-col gap-4 rounded-2xl border bg-white p-6">
            <Quote className="size-6 text-primary/40" />
            {t.headline && <p className="text-lg font-bold text-ink">&ldquo;{t.headline.replace(/^["“]|["”]$/g, "")}&rdquo;</p>}
            <p className="leading-relaxed text-muted-foreground">{t.quote}</p>
            {t.stats && t.stats.length > 0 && (
              <dl className="grid grid-cols-2 gap-3">
                {t.stats.map((st) => (
                  <div key={st.label} className="rounded-xl bg-secondary p-3">
                    <dd className="text-2xl font-bold text-primary">{st.value}</dd>
                    <dt className="text-xs text-muted-foreground">{st.label}</dt>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-auto flex items-center gap-3">
              {t.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.image} alt="" loading="lazy" className="size-10 rounded-full object-cover" />
              )}
              <div>
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
              </div>
            </div>
            {t.link && (
              <SmartLink href={t.link.href} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                {t.link.label} <ArrowRight className="size-4" />
              </SmartLink>
            )}
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function Faq({ b }: { b: B.FaqBlock }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: b.items.map((i) => ({ "@type": "Question", name: i.question, acceptedAnswer: { "@type": "Answer", text: i.answer } })),
  };
  return (
    <Shell>
      <Heading heading={b.heading ?? "Frequently asked questions"} subtitle={b.subtitle} center />
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {b.items.map((i) => (
          <details key={i.question} className="group rounded-2xl border bg-white px-6 py-4 open:shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {i.question}
              <ChevronDown className="size-5 shrink-0 text-muted-foreground transition group-open:rotate-180" />
            </summary>
            <Prose markdown={i.answer} className="mt-3 text-sm" />
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Shell>
  );
}

function Steps({ b }: { b: B.StepsBlock }) {
  return (
    <Shell muted>
      <Heading heading={b.heading} subtitle={b.subtitle} center />
      <ol className={cn("grid gap-5 sm:grid-cols-2", b.items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
        {b.items.map((s, i) => (
          <li key={s.title} className="flex flex-col gap-3 rounded-2xl border bg-white p-6">
            <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary to-brand-blue text-sm font-bold text-white">{i + 1}</span>
            <h3 className="font-bold text-ink">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>
    </Shell>
  );
}

function Stats({ b }: { b: B.StatsBlock }) {
  return (
    <Shell>
      <Heading heading={b.heading} center />
      <dl className={cn("grid overflow-hidden rounded-2xl border bg-white shadow-sm sm:divide-x", b.items.length >= 4 ? "grid-cols-2 md:grid-cols-4" : "sm:grid-cols-3")}>
        {b.items.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 p-6 text-center">
            <dt className="order-2 text-sm text-muted-foreground">{s.label}</dt>
            <dd className="order-1 text-3xl font-bold tracking-tight text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>
    </Shell>
  );
}

function CtaBanner({ b }: { b: B.CtaBlock }) {
  return (
    <section className="py-14 lg:py-20">
      <div className="container-page">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-gradient-to-br from-navy via-primary to-brand-blue p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">{b.heading}</h2>
            {b.body && <p className="mt-3 text-white/80">{b.body}</p>}
          </div>
          <Ctas ctas={b.ctas} dark />
        </div>
      </div>
    </section>
  );
}

function FormSection({ b }: { b: B.FormBlock }) {
  return (
    <Shell muted>
      <div className={cn("grid gap-10", b.body || b.heading ? "lg:grid-cols-2 lg:gap-16" : "mx-auto max-w-xl")}>
        {(b.heading || b.body) && (
          <div className="flex flex-col gap-4">
            {b.heading && <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{b.heading}</h2>}
            {b.body && <Prose markdown={b.body} />}
          </div>
        )}
        <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
          <NetlifyForm
            name={b.form}
            fields={b.fields}
            hidden={b.offer ? { offer: b.offer } : undefined}
            submitLabel={b.submitLabel}
            successMessage={b.successMessage}
            redirectTo={b.redirectTo}
          />
        </div>
      </div>
    </Shell>
  );
}

export function Blocks({ blocks }: { blocks: B.Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        const key = `${b.type}-${i}`;
        switch (b.type) {
          case "hero":
            return <Hero key={key} b={b} isFirst={i === 0} />;
          case "richText":
            return (
              <Shell key={key} muted={b.muted}>
                <div className={cn(b.width === "wide" ? "max-w-5xl" : "mx-auto max-w-3xl")}>
                  {b.heading && <h2 className="mb-6 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{b.heading}</h2>}
                  <Prose markdown={b.body} />
                </div>
              </Shell>
            );
          case "split":
            return <Split key={key} b={b} />;
          case "featureGrid":
            return <FeatureGrid key={key} b={b} />;
          case "stats":
            return <Stats key={key} b={b} />;
          case "comparisonTable":
            return <ComparisonTable key={key} b={b} />;
          case "testimonials":
            return <Testimonials key={key} b={b} />;
          case "logos":
            return (
              <div key={key}>
                <LogoCloud logos={{ ...homeContent.logos, title: b.title || homeContent.logos.title }} />
                {b.showReviews && (
                  <div className="container-page -mt-6 flex flex-col items-center gap-4 pb-12">
                    <p className="text-sm font-medium text-muted-foreground">{homeContent.reviews.title}</p>
                    <div className="flex items-center gap-6">
                      {homeContent.reviews.items.map((r) => (
                        <SmartLink key={r.name} href={r.href} className="opacity-80 transition hover:opacity-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={r.image} alt={`${r.name} reviews`} className="h-12 w-auto" />
                        </SmartLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          case "faq":
            return <Faq key={key} b={b} />;
          case "pricing":
            return <Pricing key={key} b={b} />;
          case "steps":
            return <Steps key={key} b={b} />;
          case "cta":
            return <CtaBanner key={key} b={b} />;
          case "ctaCards":
            return <CtaCards key={key} ctaCards={homeContent.ctaCards} />;
          case "embed":
            return (
              <Shell key={key}>
                <Heading heading={b.heading} subtitle={b.subtitle} center />
                <div className="mx-auto max-w-5xl">
                  <EmbedFrame embed={b} title={b.heading ?? "Embedded content"} />
                </div>
              </Shell>
            );
          case "form":
            return <FormSection key={key} b={b} />;
          default:
            return null;
        }
      })}
    </>
  );
}
