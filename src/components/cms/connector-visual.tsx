import { ArrowRight } from "lucide-react";

import { LogoTile } from "./logo-tile";

/** "Source → DataChannel → Destination" illustration built from the two logos. */
export function ConnectorVisual({
  from,
  to,
}: {
  from: { name: string; icon?: string };
  to: { name: string; icon?: string };
}) {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden>
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 to-brand-blue/10 blur-2xl" />
      <div className="flex items-center justify-between gap-3 rounded-3xl border bg-white/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur sm:p-8">
        <Node {...from} />
        <div className="flex flex-1 items-center">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-primary to-brand-blue text-white shadow-lg shadow-primary/30">
            <ArrowRight className="size-5" />
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
        </div>
        <Node {...to} />
      </div>
    </div>
  );
}

function Node({ name, icon }: { name: string; icon?: string }) {
  return (
    <div className="flex w-24 flex-col items-center gap-2 text-center">
      <LogoTile src={icon} alt={name} size="lg" />
      <span className="line-clamp-2 text-xs font-semibold text-ink">{name}</span>
    </div>
  );
}
