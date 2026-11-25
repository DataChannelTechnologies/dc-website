import { notFound } from "next/navigation";
import { ArrowRight, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SmartLink } from "@/components/smart-link";
import { CtaCards } from "@/components/sections/cta-cards";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { PageHero } from "@/components/cms/page-hero";
import { Section } from "@/components/cms/section";
import { Prose } from "@/components/cms/prose";
import { LinkGrid } from "@/components/cms/link-grid";
import { ConnectorVisual } from "@/components/cms/connector-visual";
import { Steps } from "@/components/cms/steps";
import { VideoEmbed } from "@/components/cms/video-embed";
import { WhyChoose } from "@/components/cms/why-choose";
import { CONTACT_SALES_URL, ETL_TESTIMONIALS, PERKS, SIGNUP_URL } from "@/components/cms/constants";
import { getEtlSource, getEtlSources, getIntegration, getWarehouse } from "@/lib/cms";
import { homeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getEtlSources().map((e) => ({ slug: e.slug }));
}

function resolve(slug: string) {
  const page = getEtlSource(slug);
  if (!page) return null;
  const source = getIntegration(page.source);
  const warehouse = getWarehouse(page.warehouse);
  const sourceName = source?.name ?? page.name;
  const warehouseName = warehouse?.name ?? "your data warehouse";
  return { page, source, warehouse, sourceName, warehouseName };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) return {};
  return pageMetadata({
    path: `/etl-sources/${r.page.slug}`,
    title: r.page.seoTitle || `ETL ${r.sourceName} data to ${r.warehouseName} | DataChannel`,
    description:
      r.page.seoDescription ||
      `Extract transform & load data from ${r.sourceName} to ${r.warehouseName} in minutes without writing any code or scripts using DataChannel. Integrate data from ${r.sourceName} your preferred data warehouse.`,
    image: r.source?.image || r.source?.icon,
  });
}

export default async function EtlSourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) notFound();
  const { page, source, warehouse, sourceName, warehouseName } = r;

  const otherWarehouses = getEtlSources()
    .filter((e) => e.source === page.source && e.slug !== page.slug)
    .map((e) => ({ e, w: getWarehouse(e.warehouse) }))
    .filter((x) => x.w);

  const bullets = [
    `Extract, Transform & Load ${sourceName} data, in minutes, for free, with our reliable & scalable pre-built integrations.`,
    "Transform your data to an analytics ready format with post load transformations.",
    ...(warehouse?.managedWarehouseAvailable
      ? [`Use a DataChannel managed ${warehouseName} data warehouse and reduce your administrative overheads.`]
      : []),
  ];

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Integrations", href: "/integrations" },
          ...(source ? [{ label: source.name, href: `/integration/${source.slug}` }] : []),
          { label: `to ${warehouseName}` },
        ]}
        title={`Extract, Transform & Load ${sourceName} data to ${warehouseName} without code`}
        bullets={bullets}
        actions={
          <>
            <Button asChild size="lg">
              <SmartLink href={SIGNUP_URL}>
                Get started for free <ArrowRight />
              </SmartLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <SmartLink href={CONTACT_SALES_URL}>Talk to an expert</SmartLink>
            </Button>
          </>
        }
        perks={PERKS}
        visual={
          <div className="flex flex-col items-center gap-4">
            <ConnectorVisual
              from={{ name: sourceName, icon: source?.icon }}
              to={{ name: warehouseName, icon: warehouse?.icon || warehouse?.logo }}
            />
            {source?.docsUrl && (
              <SmartLink href={source.docsUrl} className="text-sm font-semibold text-primary hover:underline">
                Read the {sourceName} documentation →
              </SmartLink>
            )}
          </div>
        }
      />

      <Section muted title={`Integrate ${sourceName} with ${warehouseName} in minutes`}>
        <Steps
          steps={[
            { title: "Connect", body: `Enter your ${sourceName} credentials.` },
            { title: "Select", body: "Select a predefined report or specific data to extract from." },
            { title: "Load", body: `Select ${warehouseName} as your target and start loading your data.` },
            { title: "Analyze", body: "Schedule syncs, transform your data and start drawing insights." },
          ]}
        />
      </Section>

      {(page.showSteps && page.steps) || (page.showVideo && page.videoUrl) ? (
        <Section title={`Steps to load data from ${sourceName} to ${warehouseName}`}>
          <div className={`grid gap-10 ${page.showVideo && page.videoUrl ? "lg:grid-cols-2" : ""}`}>
            {page.showSteps && page.steps && <Prose markdown={page.steps} className="max-w-3xl" />}
            {page.showVideo && page.videoUrl && <VideoEmbed url={page.videoUrl} title={`${sourceName} to ${warehouseName} demo`} />}
          </div>
        </Section>
      ) : null}

      <LogoCloud logos={homeContent.logos} />

      <Section muted title="What our clients say" subtitle="Leading e-commerce companies leverage data to grow their business without spending valuable hours writing ETL scripts.">
        <ul className="grid gap-5 md:grid-cols-3">
          {ETL_TESTIMONIALS.map((t) => (
            <li key={t.name} className="flex flex-col gap-4 rounded-2xl border bg-white p-6">
              <Quote className="size-6 text-primary/40" />
              <p className="text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
              <div className="mt-auto">
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <WhyChoose title={`Why choose DataChannel for your ${sourceName} and ${warehouseName} data integration`} />

      {source && ((source.showAbout && source.about) || source.brief) && (
        <Section title={`About ${sourceName}`}>
          <Prose markdown={source.showAbout && source.about ? source.about : source.brief} className="max-w-3xl" />
        </Section>
      )}

      {otherWarehouses.length > 0 && (
        <Section muted title={`Load ${sourceName} data into other warehouses`}>
          <LinkGrid
            columns={4}
            items={otherWarehouses.map(({ e, w }) => ({ href: `/etl-sources/${e.slug}`, name: w!.name, icon: w!.icon || w!.logo }))}
          />
        </Section>
      )}

      <CtaCards ctaCards={homeContent.ctaCards} />
    </>
  );
}
