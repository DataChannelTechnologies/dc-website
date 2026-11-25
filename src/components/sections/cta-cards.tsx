import { ArrowRight, MessageCircle, Plug, Rocket } from "lucide-react";

import { SmartLink } from "@/components/smart-link";
import type { HomeContent } from "@/lib/content";

const icons = { rocket: Rocket, message: MessageCircle, plug: Plug } as const;

export function CtaCards({ ctaCards }: { ctaCards: HomeContent["ctaCards"] }) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-navy via-primary to-brand-blue py-20 text-white lg:py-24">
      <div className="absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="container-page">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {ctaCards.title}
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {ctaCards.items.map((item) => {
            const Icon = icons[item.icon as keyof typeof icons] ?? Rocket;
            return (
              <SmartLink
                key={item.title}
                href={item.cta.href}
                className="group flex flex-col gap-4 rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-white text-primary">
                  <Icon className="size-6" />
                </span>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/75">{item.body}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold">
                  {item.cta.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </SmartLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
