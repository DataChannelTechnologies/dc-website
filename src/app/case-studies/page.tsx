import { CtaCards } from "@/components/sections/cta-cards";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { PageHero } from "@/components/cms/page-hero";
import { CaseStudyGrid } from "@/components/cms/case-study-grid";
import { getCaseStudies } from "@/lib/cms";
import { homeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/case-studies",
  title: "Case Studies-  DataChannel- Reliable automated ETL & Reverse ETL platform",
  description:
    "Learn how leading companies are using DataChannel's automated ETL & Reverse ETL platform to leverage their data and get a competitive advantage while saving both time and money.",
});

const stats = [
  { value: ">10B", label: "Rows of data moved per month" },
  { value: "100+", label: "Supported data sources" },
  { value: "25+", label: "Supported destinations" },
];

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Case Studies" }]}
        title="DataChannel redefines your relationship with data"
        subtitle="“Our team simply loves DataChannel, it enables them to make data-driven marketing decisions and that too in real-time.” — Tom Murray, Managing Director, Jump 450 Media"
      />
      <div className="container-page">
        <dl className="grid overflow-hidden rounded-2xl border bg-white shadow-sm sm:grid-cols-3 sm:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1 p-6 text-center">
              <dt className="order-2 text-sm text-muted-foreground">{s.label}</dt>
              <dd className="order-1 text-3xl font-bold text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <LogoCloud logos={homeContent.logos} />
      <section className="bg-muted/60 py-16 lg:py-20">
        <div className="container-page">
          <h2 className="mb-8 text-2xl font-bold text-ink sm:text-3xl">Customer stories</h2>
          <CaseStudyGrid items={getCaseStudies()} />
        </div>
      </section>
      <CtaCards ctaCards={homeContent.ctaCards} />
    </>
  );
}
