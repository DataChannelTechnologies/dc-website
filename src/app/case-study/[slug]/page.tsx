import { notFound } from "next/navigation";
import { ArrowRight, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/cms/breadcrumbs";
import { Prose } from "@/components/cms/prose";
import { CtaCards } from "@/components/sections/cta-cards";
import { SmartLink } from "@/components/smart-link";
import { SIGNUP_URL } from "@/components/cms/constants";
import { CaseStudyGrid } from "@/components/cms/case-study-grid";
import { getCaseStudies, getCaseStudy } from "@/lib/cms";
import { homeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return {};
  const title = c.seoTitle || `${c.companyName} case study | DataChannel`;
  return pageMetadata({
    path: `/case-study/${c.slug}`,
    title,
    description: c.seoDescription || `${title}. Most reliable ETL & Reverse ETL platform.`,
    image: c.personImage,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const more = getCaseStudies().filter((c) => c.slug !== study.slug).slice(0, 3);
  return (
    <>
      <section className="relative isolate -mt-16 overflow-hidden pt-16 lg:-mt-[4.5rem] lg:pt-[4.5rem]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary via-secondary/60 to-white" />
        <div className="container-page pt-8 pb-16 lg:pt-12 lg:pb-20">
          <Breadcrumbs items={[{ label: "Case Studies", href: "/case-studies" }, { label: study.companyName || study.slug }]} />
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Quote className="size-10 text-primary" />
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                &ldquo;{study.name}&rdquo;
              </h1>
              <div className="mt-8 flex items-center gap-4">
                <div>
                  <p className="font-semibold text-ink">{study.personName}</p>
                  <p className="text-sm text-muted-foreground">{study.personRole}</p>
                </div>
              </div>
            </div>
            {study.personImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={study.personImage} alt={`${study.personName}, ${study.companyName}`} className="mx-auto w-full max-w-sm rounded-3xl border shadow-2xl shadow-primary/10" />
            )}
          </div>
        </div>
      </section>

      <article className="container-page max-w-3xl py-14 lg:py-20">
        <Prose markdown={study.content} className="prose-lg" />
        <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl bg-gradient-to-br from-primary to-brand-blue p-8 text-white">
          <p className="text-xl font-bold">Want results like {study.companyName}?</p>
          <p className="text-white/80">Start your 14-day free trial today. No credit card required.</p>
          <Button asChild variant="white">
            <SmartLink href={SIGNUP_URL}>
              Start free trial <ArrowRight />
            </SmartLink>
          </Button>
        </div>
      </article>

      {more.length > 0 && (
        <section className="bg-muted/60 py-16">
          <div className="container-page">
            <h2 className="mb-8 text-2xl font-bold text-ink">More case studies</h2>
            <CaseStudyGrid items={more} />
          </div>
        </section>
      )}
      <CtaCards ctaCards={homeContent.ctaCards} />
    </>
  );
}
