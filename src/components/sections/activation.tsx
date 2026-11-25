"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeading } from "@/components/section-heading";
import { SmartLink } from "@/components/smart-link";
import type { HomeContent } from "@/lib/content";

export function Activation({ activation }: { activation: HomeContent["activation"] }) {
  const first = activation.features[0]?.tab;
  return (
    <section id="activation" className="scroll-mt-24 py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading eyebrow={activation.eyebrow} title={activation.title} subtitle={activation.subtitle} />

        <Tabs defaultValue={first} className="mt-12 items-center gap-10">
          <TabsList className="h-auto max-w-full flex-wrap">
            {activation.features.map((f) => (
              <TabsTrigger key={f.tab} value={f.tab}>
                {f.tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {activation.features.map((f) => (
            <TabsContent key={f.tab} value={f.tab} className="w-full">
              <div className="grid items-center gap-10 rounded-3xl border bg-gradient-to-br from-secondary via-white to-white p-6 shadow-sm sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
                <div className="flex flex-col gap-5">
                  <h3 className="text-2xl font-bold tracking-tight text-balance text-ink sm:text-3xl">{f.title}</h3>
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{f.body}</p>
                  <Button asChild variant="outline" className="w-fit">
                    <SmartLink href={f.cta.href}>
                      {f.cta.label} <ArrowRight />
                    </SmartLink>
                  </Button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.image} alt={f.title} loading="lazy" className="mx-auto w-full max-w-2xl" />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
