import { Briefcase, Clock, MapPin } from "lucide-react";

import { PageHero } from "@/components/cms/page-hero";
import { SmartLink } from "@/components/smart-link";
import { getCareers } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/careers",
  title: "Careers- DataChannel - Reliable Automated ETL & Reverse ETL platform",
  description: "Would You like to shape the future of Modern Data Stack? Join us at DataChannel.",
});

export default function CareersPage() {
  const jobs = getCareers();
  return (
    <>
      <PageHero
        crumbs={[{ label: "Careers" }]}
        title="We plan to change the way data works."
        subtitle="Would you like to shape the future of the modern data stack? Join us."
      />
      <section className="pb-20">
        <div className="container-page max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold text-ink">Open positions</h2>
          {jobs.length === 0 ? (
            <p className="text-muted-foreground">No open positions right now. Check back soon!</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {jobs.map((j) => (
                <li key={j.slug}>
                  <SmartLink
                    href={`/career/${j.slug}`}
                    className="group flex flex-col justify-between gap-3 rounded-2xl border bg-white p-6 transition hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-center"
                  >
                    <span className="text-lg font-semibold text-ink group-hover:text-primary">{j.name}</span>
                    <span className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Briefcase className="size-4" /> {j.department}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="size-4" /> {j.location}</span>
                      <span className="flex items-center gap-1.5"><Clock className="size-4" /> {j.workingTime}</span>
                    </span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
