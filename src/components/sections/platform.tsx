import { ArrowRight, Check } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { SmartLink } from "@/components/smart-link";
import type { HomeContent } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Platform({ platform }: { platform: HomeContent["platform"] }) {
  return (
    <section id="platform" className="scroll-mt-24 bg-muted/60 py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading eyebrow={platform.eyebrow} title={platform.title} subtitle={platform.subtitle} />

        <div className="mt-16 flex flex-col gap-20 lg:mt-20 lg:gap-28">
          {platform.features.map((f, i) => (
            <div key={f.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={cn("flex flex-col gap-5", i % 2 === 1 && "lg:order-2")}>
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Check className="size-5" />
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-balance text-ink sm:text-3xl">{f.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{f.body}</p>
                <SmartLink
                  href={f.cta.href}
                  className="group inline-flex w-fit items-center gap-1.5 font-semibold text-primary"
                >
                  {f.cta.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </SmartLink>
              </div>
              <div className="relative">
                <div className="absolute inset-8 -z-0 rounded-full bg-primary/15 blur-3xl" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.image} alt={f.title} loading="lazy" className="relative mx-auto w-full max-w-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
