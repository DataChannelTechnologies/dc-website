import { ArrowRight, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmartLink } from "@/components/smart-link";
import type { HomeContent } from "@/lib/content";

export function Webinar({ webinar }: { webinar: HomeContent["webinar"] }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl border bg-gradient-to-br from-secondary to-white p-6 sm:p-10 lg:grid-cols-2 lg:gap-14">
          <div className="group relative overflow-hidden rounded-2xl shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={webinar.image}
              alt={webinar.title}
              loading="lazy"
              className="w-full transition duration-500 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 grid place-items-center bg-ink/20 transition group-hover:bg-ink/30">
              <PlayCircle className="size-16 text-white drop-shadow-lg" strokeWidth={1.5} />
            </span>
          </div>
          <div className="flex flex-col items-start gap-5">
            <Badge>{webinar.eyebrow}</Badge>
            <h2 className="text-2xl font-bold tracking-tight text-balance text-ink sm:text-3xl">{webinar.title}</h2>
            <p className="leading-relaxed text-muted-foreground">{webinar.body}</p>
            <Button asChild size="lg">
              <SmartLink href={webinar.cta.href}>
                {webinar.cta.label} <ArrowRight />
              </SmartLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
