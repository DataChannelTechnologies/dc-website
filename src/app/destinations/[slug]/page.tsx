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
import { ACTIVATION_STEPS, SIGNUP_URL } from "@/components/cms/constants";
import { getDestination, getDestinations, getDestinationTag, getReverseEtlDestinations, getWarehouse } from "@/lib/cms";
import { homeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getDestinations().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) return {};
  return pageMetadata({
    path: `/destinations/${d.slug}`,
    title: d.seoTitle || `Sync data from Data Warehouse to ${d.name} | DataChannel | Reverse ETL`,
    description:
      d.seoDescription ||
      `Use DataChannel Reverse ETL to sync data from your data warehouses like Amazon Redshift, Google Bigquery or Snowflake to ${d.name} in minutes`,
    image: d.image || d.icon,
  });
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();
  const tag = getDestinationTag(destination.category);

  const syncPages = getReverseEtlDestinations()
    .filter((r) => r.destination === destination.slug)
    .map((r) => ({ r, w: getWarehouse(r.warehouse) }))
    .filter((x) => x.w);

  const related = getDestinations()
    .filter((d) => d.slug !== destination.slug && d.category === destination.category)
    .slice(0, 6);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Destinations", href: "/destinations" }, { label: destination.name }]}
        eyebrow={
          <div className="flex items-center gap-3">
            <LogoTile src={destination.icon} alt={destination.name} />
            <TagBadge tag={tag} />
          </div>
        }
        title={`Load data from any data warehouse to ${destination.name} in minutes`}
        subtitle={`Sync data from any data warehouse to ${destination.name}. ${destination.shortInfo}`}
        actions={
          <>
            <Button asChild size="lg">
              <SmartLink href={SIGNUP_URL}>
                Get started now <ArrowRight />
              </SmartLink>
            </Button>
            {destination.docsUrl && (
              <Button asChild size="lg" variant="outline">
                <SmartLink href={destination.docsUrl}>
                  <BookOpen /> Read documentation
                </SmartLink>
              </Button>
            )}
          </>
        }
        visual={
          destination.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={destination.image} alt={destination.name} className="mx-auto w-full max-w-lg rounded-2xl" />
          ) : undefined
        }
      />

      {syncPages.length > 0 && (
        <Section
          muted
          title={`See which data warehouses can be connected to sync data into ${destination.name}`}
          subtitle="Select from the growing list of data warehouses & databases supported by DataChannel."
        >
          <LinkGrid
            columns={4}
            items={syncPages.map(({ r, w }) => ({
              href: `/reverse-etl-destinations/${r.slug}`,
              name: w!.name,
              icon: w!.icon || w!.logo,
              description: "Data Warehouse",
            }))}
          />
        </Section>
      )}

      {(destination.showAbout && destination.about) || destination.brief ? (
        <Section title={`About ${destination.name}`}>
          <Prose markdown={destination.showAbout && destination.about ? destination.about : destination.brief} className="max-w-3xl" />
        </Section>
      ) : null}

      {destination.availableSync && (
        <Section muted title={`See where you can sync data to in ${destination.name}`}>
          <Prose markdown={destination.availableSync} className="max-w-3xl" />
        </Section>
      )}

      <Section title="Start activating your data in four easy steps">
        <Steps steps={ACTIVATION_STEPS} />
      </Section>

      {related.length > 0 && (
        <Section muted title="Related destinations">
          <LinkGrid
            items={related.map((d) => ({ href: `/destinations/${d.slug}`, name: d.name, icon: d.icon, description: d.shortInfo }))}
          />
        </Section>
      )}

      <CtaCards ctaCards={homeContent.ctaCards} />
    </>
  );
}
