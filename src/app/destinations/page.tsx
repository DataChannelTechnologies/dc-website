import { CtaCards } from "@/components/sections/cta-cards";
import { PageHero } from "@/components/cms/page-hero";
import { Directory } from "@/components/cms/directory";
import { getDestinations, getDestinationTags } from "@/lib/cms";
import { homeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/destinations",
  title: "Reverse ETL Destinations - DataChannel - Reliable Automated ETL & Reverse ETL platform",
  description:
    "List of Reverse ETL destinations supported by DataChannel. Activate your data by syncing from any Data Warehouse to various SaaS applications and platforms across marketing, sales and product analytics.",
});

export default function DestinationsPage() {
  const items = getDestinations().map((d) => ({
    href: `/destinations/${d.slug}`,
    name: d.name,
    icon: d.icon,
    description: d.shortInfo,
    category: d.category,
  }));
  return (
    <>
      <PageHero
        crumbs={[{ label: "Destinations" }]}
        title="Effortlessly sync data from your data warehouse to any destination"
        subtitle="Choose from our growing library of pre-built Reverse ETL destinations."
      />
      <section className="pb-20">
        <div className="container-page">
          <Directory items={items} tags={getDestinationTags()} searchLabel="Search for a destination" />
        </div>
      </section>
      <CtaCards ctaCards={homeContent.ctaCards} />
    </>
  );
}
