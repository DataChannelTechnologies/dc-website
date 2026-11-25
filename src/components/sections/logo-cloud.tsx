import type { HomeContent } from "@/lib/content";

export function LogoCloud({ logos }: { logos: HomeContent["logos"] }) {
  const row = [...logos.items, ...logos.items]; // duplicated for a seamless marquee loop
  return (
    <section className="py-14 lg:py-16">
      <div className="container-page">
        <p className="mx-auto max-w-2xl text-center text-sm font-medium text-muted-foreground">{logos.title}</p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <ul className="flex w-max animate-marquee items-center gap-14 hover:[animation-play-state:paused]">
            {row.map((logo, i) => (
              <li key={`${logo.name}-${i}`} className="shrink-0" aria-hidden={i >= logos.items.length}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.image}
                  alt={logo.name}
                  loading="lazy"
                  className="h-9 w-auto max-w-[140px] object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
