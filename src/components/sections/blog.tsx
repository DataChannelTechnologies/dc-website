import { ArrowRight, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { SmartLink } from "@/components/smart-link";
import { formatDate, type HomeContent } from "@/lib/content";

export function Blog({ blog }: { blog: HomeContent["blog"] }) {
  return (
    <section id="blog" className="scroll-mt-24 pb-20 lg:pb-28">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading align="left" eyebrow={blog.eyebrow} title={blog.title} />
          <Button asChild variant="outline">
            <SmartLink href={blog.cta.href}>
              {blog.cta.label} <ArrowRight />
            </SmartLink>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blog.posts.map((p) => (
            <SmartLink key={p.href} href={p.href} className="group">
              <Card className="h-full gap-0 overflow-hidden py-0 transition group-hover:-translate-y-1 group-hover:shadow-lg">
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="flex flex-col gap-3 p-6">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    <time dateTime={p.date}>{formatDate(p.date)}</time>
                  </p>
                  <h3 className="text-lg font-bold text-ink group-hover:text-primary">{p.title}</h3>
                </CardContent>
              </Card>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}
