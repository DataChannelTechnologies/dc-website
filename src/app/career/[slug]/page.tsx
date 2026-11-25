import { notFound } from "next/navigation";
import { Briefcase, Clock, MapPin } from "lucide-react";

import { Breadcrumbs } from "@/components/cms/breadcrumbs";
import { Prose } from "@/components/cms/prose";
import { NetlifyForm } from "@/components/forms/netlify-form";
import { getCareer, getCareers } from "@/lib/cms";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCareers().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCareer(slug);
  if (!c) return {};
  return pageMetadata({
    path: `/career/${c.slug}`,
    title: c.seoTitle || `Job Opening - ${c.name} | DataChannel`,
    description:
      c.seoDescription ||
      "DataChannel is a cloud based data integration and reverse ETL platform to automate the data collection, preparation and management process of all your marketing data.",
  });
}

export default async function CareerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getCareer(slug);
  if (!job) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.name,
    description: job.description,
    hiringOrganization: { "@type": "Organization", name: "DataChannel", sameAs: SITE_URL },
    employmentType: job.workingTime.toUpperCase().replace(" ", "_"),
    ...(job.location === "Remote"
      ? { jobLocationType: "TELECOMMUTE" }
      : { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location.split(",")[0], addressCountry: "IN" } } }),
  };
  return (
    <>
      <section className="relative isolate -mt-16 overflow-hidden pt-16 lg:-mt-[4.5rem] lg:pt-[4.5rem]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary to-white" />
        <div className="container-page max-w-4xl pt-8 pb-10 lg:pt-12">
          <Breadcrumbs items={[{ label: "Careers", href: "/careers" }, { label: job.name }]} />
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">{job.name}</h1>
          <ul className="mt-6 flex flex-wrap gap-3 text-sm">
            {[
              { icon: Briefcase, v: job.department },
              { icon: MapPin, v: job.location },
              { icon: Clock, v: job.workingTime },
            ]
              .filter((x) => x.v)
              .map(({ icon: Icon, v }) => (
                <li key={v} className="flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 font-medium text-ink">
                  <Icon className="size-4 text-primary" /> {v}
                </li>
              ))}
          </ul>
        </div>
      </section>
      <div className="container-page grid max-w-6xl gap-12 pb-20 lg:grid-cols-[1fr_380px]">
        <Prose markdown={job.description} />
        <aside>
          <div className="sticky top-28 rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-ink">Apply for this role</h2>
            <NetlifyForm
              name="career-application"
              hidden={{ position: job.name }}
              submitLabel="Submit application"
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "resume", label: "Attach resume (PDF, max 10MB)", type: "file", accept: "application/pdf", required: true },
              ]}
            />
          </div>
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
