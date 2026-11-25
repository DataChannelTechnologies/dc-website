import { notFound } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SmartLink } from "@/components/smart-link";
import { CtaCards } from "@/components/sections/cta-cards";
import { PageHero } from "@/components/cms/page-hero";
import { Section } from "@/components/cms/section";
import { LinkGrid } from "@/components/cms/link-grid";
import { CONTACT_SALES_URL, PERKS, SIGNUP_URL } from "@/components/cms/constants";
import { getDestination, getEtlSources, getIntegration, getReverseEtlDestinations, getWarehouse, getWarehouses } from "@/lib/cms";
import { homeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getWarehouses().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = getWarehouse(slug);
  if (!w) return {};
  return pageMetadata({
    path: `/warehouses/${w.slug}`,
    title: w.seoTitle || `ETL Data to ${w.name} in minutes with DataChannel`,
    description:
      w.seoDescription ||
      `Learn how you can move data into a ${w.name} data warehouse with DataChannel without writing any code or scripts. Create reliable data pipelines to ${w.name} for free.`,
    image: w.logo,
  });
}

export default async function WarehousePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const warehouse = getWarehouse(slug);
  if (!warehouse) notFound();

  const sources = getEtlSources()
    .filter((e) => e.warehouse === warehouse.slug)
    .map((e) => ({ e, s: getIntegration(e.source) }))
    .filter((x) => x.s);
  const syncs = getReverseEtlDestinations()
    .filter((r) => r.warehouse === warehouse.slug)
    .map((r) => ({ r, d: getDestination(r.destination) }))
    .filter((x) => x.d);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Data Warehouses", href: "/data-warehouses" }, { label: warehouse.name }]}
        eyebrow={
          warehouse.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={warehouse.logo} alt={warehouse.logoAlt} className="h-12 w-auto max-w-[220px] object-contain" />
          ) : undefined
        }
        title={`Load data from 100+ data sources into ${warehouse.name} in minutes`}
        subtitle={`Connect any SaaS platform, database or load data from cloud storages, files or webhooks into ${warehouse.name} without writing any code or scripts.`}
        actions={
          <Button asChild size="lg">
            <SmartLink href={SIGNUP_URL}>
              Start your free trial <ArrowRight />
            </SmartLink>
          </Button>
        }
        perks={PERKS}
      />

      {warehouse.managedWarehouseAvailable && (
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-gradient-to-br from-primary to-brand-blue p-8 text-white sm:flex-row sm:items-center">
            <div className="flex gap-4">
              <ShieldCheck className="mt-1 size-7 shrink-0" />
              <div>
                <p className="text-xl font-bold">Start your data journey with {warehouse.name} fully managed by DataChannel</p>
                <p className="mt-1 text-white/80">You do not need to worry about the administration and management of the data warehouse ever again.</p>
              </div>
            </div>
            <Button asChild variant="white">
              <SmartLink href={CONTACT_SALES_URL}>Speak to our experts</SmartLink>
            </Button>
          </div>
        </div>
      )}

      {sources.length > 0 && (
        <Section title={`Choose from the growing list of supported data sources to start loading data to ${warehouse.name}`}>
          <LinkGrid
            columns={4}
            items={sources.map(({ e, s }) => ({ href: `/etl-sources/${e.slug}`, name: s!.name, icon: s!.icon }))}
          />
        </Section>
      )}

      {syncs.length > 0 && (
        <Section muted title={`Sync data from ${warehouse.name} to your business tools`} subtitle="Activate your warehouse data with Reverse ETL.">
          <LinkGrid
            columns={4}
            items={syncs.map(({ r, d }) => ({ href: `/reverse-etl-destinations/${r.slug}`, name: d!.name, icon: d!.icon }))}
          />
        </Section>
      )}

      <CtaCards ctaCards={homeContent.ctaCards} />
    </>
  );
}
