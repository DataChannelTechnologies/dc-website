import { Lock, MessageSquareText, SlidersHorizontal } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import type { HomeContent } from "@/lib/content";

const icons = [MessageSquareText, SlidersHorizontal, Lock];

export function Neo({ neo }: { neo: HomeContent["neo"] }) {
  const [lead, ...rest] = neo.features;
  return (
    <section id="neo" className="relative isolate scroll-mt-24 overflow-hidden bg-ink py-20 text-white lg:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(74,58,255,0.35),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="container-page">
        <SectionHeading dark eyebrow={neo.eyebrow} title={neo.title} subtitle={neo.subtitle} />

        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
          {/* Lead feature: large bento tile */}
          <article className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] lg:col-span-2 lg:row-span-2">
            <div className="flex flex-col gap-3 p-7 sm:p-9">
              <FeatureIcon index={0} />
              <h3 className="text-2xl font-bold">{lead.title}</h3>
              <p className="max-w-xl text-white/70">{lead.body}</p>
            </div>
            {lead.image && (
              <div className="mt-auto max-h-[460px] overflow-hidden px-7 sm:px-9 [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lead.image}
                  alt={lead.title}
                  loading="lazy"
                  className="w-full rounded-t-2xl border border-b-0 border-white/10 bg-white shadow-2xl"
                />
              </div>
            )}
          </article>

          {rest.map((f, i) => (
            <article
              key={f.title}
              className="flex flex-col gap-3 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7"
            >
              <FeatureIcon index={i + 1} />
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{f.body}</p>
              {f.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.image} alt={f.title} loading="lazy" className="mt-3 w-full rounded-xl bg-white" />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ index }: { index: number }) {
  const Icon = icons[index % icons.length];
  return (
    <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-brand-blue text-white">
      <Icon className="size-5" />
    </span>
  );
}
