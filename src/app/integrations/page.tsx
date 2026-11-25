import { CtaCards } from "@/components/sections/cta-cards";
import { PageHero } from "@/components/cms/page-hero";
import { Directory } from "@/components/cms/directory";
import { getIntegrations, getIntegrationTags } from "@/lib/cms";
import { homeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/integrations",
  title: "Integration- DataChannel - Reliable Automated ETL & Reverse ETL platform",
  description:
    "List of various data sources available with DataChannel. Connect 100+ SaaS applications across marketing, sales, finance to any cloud data warehouse like Redshift, Bigquery or Snowflake",
});

export default function IntegrationsPage() {
  const items = getIntegrations().map((i) => ({
    href: `/integration/${i.slug}`,
    name: i.name,
    icon: i.icon,
    description: i.shortInfo,
    category: i.category,
  }));
  return (
    <>
      <PageHero
        crumbs={[{ label: "Integrations" }]}
        title="Effortlessly integrate data from any source"
        subtitle={`Choose from our growing library of ${items.length}+ pre-built integrations.`}
      />
      <section className="pb-20">
        <div className="container-page">
          <Directory items={items} tags={getIntegrationTags()} searchLabel="Search for an integration" />
        </div>
      </section>
      <CtaCards ctaCards={homeContent.ctaCards} />
    </>
  );
}
