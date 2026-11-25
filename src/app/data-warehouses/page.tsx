import { ArrowUpRight, ShieldCheck } from "lucide-react";

import { SmartLink } from "@/components/smart-link";
import { CtaCards } from "@/components/sections/cta-cards";
import { PageHero } from "@/components/cms/page-hero";
import { getEtlSources, getWarehouses } from "@/lib/cms";
import { homeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/data-warehouses",
  title: "Data Warehouses",
  description:
    "List of data warehouses supported by DataChannel. Start integrating all your data sources into a data warehouse of your choice with 100+ pre-built integrations.",
});

export default function DataWarehousesPage() {
  const etl = getEtlSources();
  return (
    <>
      <PageHero
        crumbs={[{ label: "Data Warehouses" }]}
        title="Effortlessly sync data from any source into a data warehouse of your choice"
        subtitle="Do not have a data warehouse or administrators to manage one? We have you covered. With a DataChannel managed data warehouse, never bother about maintaining your data warehouse."
      />
      <section className="pb-20">
        <div className="container-page">
          <h2 className="mb-8 text-2xl font-bold text-ink">Supported data warehouses</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {getWarehouses().map((w) => {
              const count = etl.filter((e) => e.warehouse === w.slug).length;
              return (
                <li key={w.slug}>
                  <SmartLink
                    href={`/warehouses/${w.slug}`}
                    className="group flex h-full flex-col gap-5 rounded-2xl border bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={w.logo || w.icon} alt={w.logoAlt} loading="lazy" className="h-10 w-auto max-w-[200px] object-contain" />
                      <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <span className="text-lg font-semibold text-ink group-hover:text-primary">{w.name}</span>
                      <span className="text-sm text-muted-foreground">{count} data sources available</span>
                      {w.managedWarehouseAvailable && (
                        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">
                          <ShieldCheck className="size-3.5" /> Managed option available
                        </span>
                      )}
                    </div>
                  </SmartLink>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <CtaCards ctaCards={homeContent.ctaCards} />
    </>
  );
}
