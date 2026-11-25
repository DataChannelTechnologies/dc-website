import { Mail } from "lucide-react";

import { SmartLink } from "@/components/smart-link";
import { Separator } from "@/components/ui/separator";
import type { SiteContent } from "@/lib/content";

const socialIcons: Record<string, React.ReactNode> = {
  linkedin: (
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  ),
  x: (
    <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z" />
  ),
  facebook: (
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z" />
  ),
};

export function SiteFooter({ site }: { site: SiteContent }) {
  const { footer } = site;
  return (
    <footer className="bg-ink text-white">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="flex max-w-sm flex-col gap-5">
            <SmartLink href="/" className="w-fit rounded-xl bg-white px-4 py-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={site.logo} alt={site.name} className="h-7 w-auto" />
            </SmartLink>
            <p className="text-sm leading-relaxed text-white/60">{footer.tagline}</p>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
            >
              <Mail className="size-4" /> {site.email}
            </a>
            <div className="flex gap-3">
              {footer.social.map((s) => (
                <SmartLink
                  key={s.platform}
                  href={s.href}
                  aria-label={s.platform}
                  className="grid size-9 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-primary hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                    {socialIcons[s.platform]}
                  </svg>
                </SmartLink>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {footer.columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <p className="text-sm font-semibold">{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <SmartLink href={l.href} className="text-sm text-white/60 transition hover:text-white">
                        {l.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col-reverse gap-4 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <li key={l.label}>
                <SmartLink href={l.href} className="hover:text-white">
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
