import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SmartLink } from "@/components/smart-link";
import { CtaCards } from "@/components/sections/cta-cards";
import { PageHero } from "@/components/cms/page-hero";
import { Section } from "@/components/cms/section";
import { Prose } from "@/components/cms/prose";
import { LinkGrid } from "@/components/cms/link-grid";
import { ConnectorVisual } from "@/components/cms/connector-visual";
import { VideoEmbed } from "@/components/cms/video-embed";
import { WhyChoose } from "@/components/cms/why-choose";
import { PERKS, SIGNUP_URL } from "@/components/cms/constants";
import {
  getDestination,
  getDestinationTag,
  getReverseEtlDestination,
  getReverseEtlDestinations,
  getWarehouse,
} from "@/lib/cms";
import { homeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getReverseEtlDestinations().map((r) => ({ slug: r.slug }));
}

function resolve(slug: string) {
  const page = getReverseEtlDestination(slug);
  if (!page) return null;
  const warehouse = getWarehouse(page.warehouse);
  const destination = getDestination(page.destination);
  return {
    page,
    warehouse,
    destination,
    warehouseName: warehouse?.name ?? "your data warehouse",
    destinationName: destination?.name ?? page.name,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) return {};
  return pageMetadata({
    path: `/reverse-etl-destinations/${r.page.slug}`,
    title: r.page.seoTitle || `Sync Data from ${r.warehouseName} to ${r.destinationName} | DataChannel`,
    description:
      r.page.seoDescription ||
      `Connect your data from ${r.warehouseName} to ${r.destinationName} with DataChannel. No APIs, no months-long implementations, and no CSV files. Just your data synced forever.`,
    image: r.destination?.image || r.destination?.icon,
  });
}

export default async function ReverseEtlPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) notFound();
  const { page, warehouse, destination, warehouseName, destinationName } = r;
  const tag = getDestinationTag(page.category || destination?.category || "");
  const all = getReverseEtlDestinations();

  const otherWarehouses = all
    .filter((x) => x.destination === page.destination && x.slug !== page.slug)
    .map((x) => ({ x, w: getWarehouse(x.warehouse) }))
    .filter((y) => y.w);

  // Other destinations in the same category, preferring the page for this same warehouse.
  const sameCategory = all
    .filter((x) => x.warehouse === page.warehouse && x.destination !== page.destination && x.category && x.category === page.category)
    .map((x) => ({ x, d: getDestination(x.destination) }))
    .filter((y) => y.d)
    .slice(0, 8);

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Destinations", href: "/destinations" },
          ...(destination ? [{ label: destination.name, href: `/destinations/${destination.slug}` }] : []),
          { label: `from ${warehouseName}` },
        ]}
        title={`Sync data from ${warehouseName} to ${destinationName}`}
        subtitle={`Sync your data from ${warehouseName} to ${destinationName} with DataChannel in minutes without writing any code or scripts. Select and map the fields you want to load and retain complete control over the data you are moving.`}
        actions={
          <Button asChild size="lg">
            <SmartLink href={SIGNUP_URL}>
              Get started for free <ArrowRight />
            </SmartLink>
          </Button>
        }
        perks={PERKS}
        visual={
          <ConnectorVisual
            from={{ name: warehouseName, icon: warehouse?.icon || warehouse?.logo }}
            to={{ name: destinationName, icon: destination?.icon }}
          />
        }
      />

      {destination && ((destination.showAbout && destination.about) || destination.brief) && (
        <Section muted title={`About ${destinationName}`}>
          <Prose markdown={destination.showAbout && destination.about ? destination.about : destination.brief} className="max-w-3xl" />
        </Section>
      )}

      {destination?.availableSync && (
        <Section title={`See where you can sync data to in ${destinationName}`}>
          <Prose markdown={destination.availableSync} className="max-w-3xl" />
        </Section>
      )}

      {(page.showSteps && page.steps) || (page.showVideo && page.videoUrl) ? (
        <Section muted title={`Steps to sync data to ${destinationName} from ${warehouseName} using DataChannel`}>
          <div className={`grid gap-10 ${page.showVideo && page.videoUrl ? "lg:grid-cols-2" : ""}`}>
            {page.showSteps && page.steps && <Prose markdown={page.steps} className="max-w-3xl" />}
            {page.showVideo && page.videoUrl && <VideoEmbed url={page.videoUrl} title={`${warehouseName} to ${destinationName} demo`} />}
          </div>
        </Section>
      ) : null}

      <WhyChoose title={`Why choose DataChannel to sync data from ${warehouseName} to ${destinationName}`} />

      {sameCategory.length > 0 && (
        <Section title={`Explore all destinations in ${tag?.name ?? "this category"}`}>
          <LinkGrid
            columns={4}
            items={sameCategory.map(({ x, d }) => ({ href: `/reverse-etl-destinations/${x.slug}`, name: d!.name, icon: d!.icon }))}
          />
        </Section>
      )}

      {otherWarehouses.length > 0 && (
        <Section muted title={`View other warehouses you can sync data into ${destinationName} from`}>
          <LinkGrid
            columns={4}
            items={otherWarehouses.map(({ x, w }) => ({ href: `/reverse-etl-destinations/${x.slug}`, name: w!.name, icon: w!.icon || w!.logo }))}
          />
        </Section>
      )}

      <CtaCards ctaCards={homeContent.ctaCards} />
    </>
  );
}
