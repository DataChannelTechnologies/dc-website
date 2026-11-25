import { ShieldCheck } from "lucide-react";

import { SmartLink } from "@/components/smart-link";
import type { HomeContent } from "@/lib/content";

export function Trust({ trust }: { trust: HomeContent["trust"] }) {
  return (
    <section className="border-y py-14">
      <div className="container-page flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
        <p className="flex items-center gap-2 text-center text-base font-semibold text-ink lg:max-w-xs lg:text-left">
          <ShieldCheck className="size-5 shrink-0 text-primary" /> {trust.title}
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {trust.badges.map((b) => {
            // eslint-disable-next-line @next/next/no-img-element
            const img = <img src={b.image} alt={b.name} loading="lazy" className="h-12 w-auto object-contain" />;
            return (
              <li key={b.name} className="opacity-80 transition hover:opacity-100">
                {b.href ? <SmartLink href={b.href}>{img}</SmartLink> : img}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
