import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  Mail,
  Megaphone,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  Warehouse,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmartLink } from "@/components/smart-link";
import type { HomeContent } from "@/lib/content";

type Props = { hero: HomeContent["hero"]; stats: HomeContent["stats"]; reviews: HomeContent["reviews"] };

export function Hero({ hero, stats, reviews }: Props) {
  return (
    <section className="relative isolate -mt-16 overflow-hidden pt-16 lg:-mt-[4.5rem] lg:pt-[4.5rem]">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/25 via-brand-blue/15 to-transparent blur-3xl" />
      <div className="absolute top-40 -right-40 -z-10 h-[400px] w-[400px] rounded-full bg-brand-orange/10 blur-3xl" />

      <div className="container-page grid grid-cols-1 items-center gap-14 pt-12 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-20 lg:pb-24">
        <div className="flex min-w-0 flex-col items-start gap-6">
          <Badge>
            <Sparkles /> {hero.eyebrow}
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            {hero.title} <span className="text-gradient">{hero.highlight}</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {hero.subtitle}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <SmartLink href={hero.primaryCta.href}>
                {hero.primaryCta.label} <ArrowRight />
              </SmartLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <SmartLink href={hero.secondaryCta.href}>{hero.secondaryCta.label}</SmartLink>
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {hero.perks.map((p) => (
              <li key={p} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" /> {p}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4 pt-2">
            {reviews.items.map((r) => (
              <SmartLink key={r.name} href={r.href} className="opacity-80 transition hover:opacity-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image} alt={`${r.name} reviews`} className="h-12 w-auto" />
              </SmartLink>
            ))}
          </div>
        </div>

        <PipelineVisual />
      </div>

      <div className="container-page pb-6">
        <dl className="grid grid-cols-2 divide-border overflow-hidden rounded-2xl border bg-white/70 shadow-sm backdrop-blur md:grid-cols-4 md:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1 p-6 text-center">
              <dt className="order-2 text-sm text-muted-foreground">{s.label}</dt>
              <dd className="order-1 text-3xl font-bold tracking-tight text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Illustrative product visual (sources → warehouse → destinations + Neo). Pure JSX, no assets needed. */
function PipelineVisual() {
  const sources = [
    { icon: Megaphone, label: "Google Ads", color: "bg-amber-100 text-amber-700" },
    { icon: ShoppingBag, label: "Shopify", color: "bg-emerald-100 text-emerald-700" },
    { icon: Database, label: "PostgreSQL", color: "bg-sky-100 text-sky-700" },
  ];
  const destinations = [
    { icon: Mail, label: "Email & CRM", color: "bg-rose-100 text-rose-700" },
    { icon: Megaphone, label: "Ad platforms", color: "bg-violet-100 text-violet-700" },
    { icon: BarChart3, label: "BI dashboards", color: "bg-indigo-100 text-indigo-700" },
  ];

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-xl" aria-hidden>
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 to-brand-blue/10 blur-2xl" />
      <div className="rounded-3xl border bg-white/90 p-5 shadow-2xl shadow-primary/10 backdrop-blur sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px] shadow-emerald-500/20" />
            <span className="text-sm font-semibold text-ink">Pipelines healthy</span>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            Synced 2 min ago
          </span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-5">
          <ul className="flex flex-col gap-3">
            {sources.map(({ icon: Icon, label, color }) => (
              <li key={label} className="flex items-center gap-2.5 rounded-xl border bg-white p-2.5 shadow-xs">
                <span className={`hidden size-8 shrink-0 place-items-center rounded-lg sm:grid ${color}`}>
                  <Icon className="size-4" />
                </span>
                <span className="truncate text-xs font-semibold text-ink sm:text-sm">{label}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-px bg-gradient-to-b from-transparent to-primary/60" />
            <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-brand-blue text-white shadow-lg shadow-primary/30 sm:size-20">
              <Warehouse className="size-7 sm:size-8" />
            </div>
            <span className="text-[11px] font-semibold tracking-wide text-primary uppercase">Warehouse</span>
            <div className="h-10 w-px bg-gradient-to-b from-primary/60 to-transparent" />
          </div>

          <ul className="flex flex-col gap-3">
            {destinations.map(({ icon: Icon, label, color }) => (
              <li key={label} className="flex items-center gap-2.5 rounded-xl border bg-white p-2.5 shadow-xs">
                <span className={`hidden size-8 shrink-0 place-items-center rounded-lg sm:grid ${color}`}>
                  <Icon className="size-4" />
                </span>
                <span className="truncate text-xs font-semibold text-ink sm:text-sm">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-2xl bg-ink p-4 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <MessageSquare className="size-3.5" /> Ask Neo
          </div>
          <p className="mt-2 text-sm">Which campaigns drove the most repeat purchases last month?</p>
          <div className="mt-3 flex items-end gap-1.5">
            {[40, 65, 35, 85, 55, 70, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-brand-blue"
                style={{ height: `${h * 0.6}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
