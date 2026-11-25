import { notFound } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SmartLink } from "@/components/smart-link";
import { CtaCards } from "@/components/sections/cta-cards";
import { PageHero } from "@/components/cms/page-hero";
import { Section } from "@/components/cms/section";
import { Prose } from "@/components/cms/prose";
import { LinkGrid } from "@/components/cms/link-grid";
import { LogoTile } from "@/components/cms/logo-tile";
import { Steps } from "@/components/cms/steps";
import { TagBadge } from "@/components/cms/tag-badge";
import { ETL_STEPS, SIGNUP_URL } from "@/components/cms/constants";
import { getEtlSources, getIntegration, getIntegrations, getIntegrationTag, getWarehouse } from "@/lib/cms";
import { homeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getIntegrations().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = getIntegration(slug);
  if (!i) return {};
  return pageMetadata({
    path: `/integration/${i.slug}`,
    title: i.seoTitle || `Load ${i.name} data to Data Warehouse | DataChannel | Reliable ETL & Reverse ETL`,
    description:
      i.seoDescription ||
      `Easily integrate and load data from ${i.name} to any data warehouse like Amazon Redshift, Google Bigquery or Snowflake in minutes with DataChannel`,
    image: i.image || i.icon,
  });
}

export default async function IntegrationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const integration = getIntegration(slug);
  if (!integration) notFound();
  const tag = getIntegrationTag(integration.category);

  const etlPages = getEtlSources()
    .filter((e) => e.source === integration.slug)
    .map((e) => ({ e, w: getWarehouse(e.warehouse) }))
    .filter((x) => x.w);

  const related = getIntegrations()
    .filter((i) => i.slug !== integration.slug && i.category === integration.category)
    .slice(0, 6);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Integrations", href: "/integrations" }, { label: integration.name }]}
        eyebrow={
          <div className="flex items-center gap-3">
            <LogoTile src={integration.icon} alt={integration.name} />
            <TagBadge tag={tag} />
          </div>
        }
        title={`Load data from ${integration.name} to any data warehouse in minutes`}
        subtitle={`ETL data from ${integration.name} to any data warehouse. ${integration.shortInfo}`}
        actions={
          <>
            <Button asChild size="lg">
              <SmartLink href={SIGNUP_URL}>
                Get started now <ArrowRight />
              </SmartLink>
            </Button>
            {integration.docsUrl && (
              <Button asChild size="lg" variant="outline">
                <SmartLink href={integration.docsUrl}>
                  <BookOpen /> Read documentation
                </SmartLink>
              </Button>
            )}
          </>
        }
        visual={
          integration.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={integration.image} alt={integration.name} className="mx-auto w-full max-w-lg rounded-2xl" />
          ) : undefined
        }
      />

      {etlPages.length > 0 && (
        <Section
          muted
          title={`Choose the destination you wish to load ${integration.name} data into`}
          subtitle="Select from the growing list of destination data warehouses & databases supported by DataChannel."
        >
          <LinkGrid
            columns={4}
            items={etlPages.map(({ e, w }) => ({
              href: `/etl-sources/${e.slug}`,
              name: w!.name,
              icon: w!.icon || w!.logo,
              description: "Data Warehouse",
            }))}
          />
        </Section>
      )}

      {(integration.showAbout && integration.about) || integration.brief ? (
        <Section title={`About ${integration.name}`}>
          <Prose markdown={integration.showAbout && integration.about ? integration.about : integration.brief} className="max-w-3xl" />
        </Section>
      ) : null}

      {integration.availableData && (
        <Section muted title={`Choose what data you would like to move from ${integration.name}`}>
          <Prose markdown={integration.availableData} className="max-w-3xl" />
        </Section>
      )}

      <Section title="Start leveraging your data in four easy steps">
        <Steps steps={ETL_STEPS} />
      </Section>

      {related.length > 0 && (
        <Section muted title="Related integrations">
          <LinkGrid
            items={related.map((i) => ({ href: `/integration/${i.slug}`, name: i.name, icon: i.icon, description: i.shortInfo }))}
          />
        </Section>
      )}

      <CtaCards ctaCards={homeContent.ctaCards} />
    </>
  );
}
