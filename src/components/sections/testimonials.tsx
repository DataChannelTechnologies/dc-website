import { Quote, Star } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import type { HomeContent } from "@/lib/content";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ name, image }: { name: string; image: string }) {
  return image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt={name} loading="lazy" className="size-11 rounded-full object-cover ring-2 ring-white" />
  ) : (
    <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-primary to-brand-blue text-sm font-bold text-white">
      {initials(name)}
    </span>
  );
}

export function Testimonials({ testimonials }: { testimonials: HomeContent["testimonials"] }) {
  const { featured } = testimonials;
  return (
    <section id="customers" className="scroll-mt-24 bg-muted/60 py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading eyebrow={testimonials.eyebrow} title={testimonials.title} />

        <figure className="relative mx-auto mt-14 max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-brand-blue p-8 text-white shadow-xl shadow-primary/20 sm:p-12">
          <Quote className="absolute -top-2 -right-2 size-40 text-white/10" aria-hidden />
          <div className="flex gap-1" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-brand-orange text-brand-orange" />
            ))}
          </div>
          <blockquote className="relative mt-5">
            <p className="text-2xl font-bold sm:text-3xl">&ldquo;{featured.headline}&rdquo;</p>
            <p className="mt-4 leading-relaxed text-white/85 sm:text-lg">{featured.quote}</p>
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-3">
            <Avatar name={featured.name} image={featured.image} />
            <div>
              <p className="font-semibold">{featured.name}</p>
              <p className="text-sm text-white/70">{featured.role}</p>
            </div>
          </figcaption>
        </figure>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {testimonials.items.map((t) => (
            <Card key={t.name} className="justify-between gap-6 transition hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="flex flex-col gap-3">
                <p className="text-lg font-bold text-ink">&ldquo;{t.headline}&rdquo;</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-5">
                <dl className="grid grid-cols-2 gap-3">
                  {t.stats.map((s) => (
                    <div key={s.label} className="rounded-xl bg-secondary p-3">
                      <dd className="text-2xl font-bold text-primary">{s.value}</dd>
                      <dt className="text-xs text-muted-foreground">{s.label}</dt>
                    </div>
                  ))}
                </dl>
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} image={t.image} />
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
