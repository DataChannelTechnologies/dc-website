import {
  Activity,
  Bell,
  BookOpen,
  CalendarClock,
  Eye,
  History,
  KeyRound,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

const features = [
  { icon: SlidersHorizontal, label: "Granular control over pipeline configuration" },
  { icon: CalendarClock, label: "Advanced scheduling options" },
  { icon: RefreshCw, label: "Automated handling of source schema changes" },
  { icon: KeyRound, label: "Secure credential management with OAuth2" },
  { icon: History, label: "Activity & change history tracking" },
  { icon: Bell, label: "Real time alerts & failure notifications" },
  { icon: Eye, label: "Preview data without ever leaving the platform" },
  { icon: BookOpen, label: "Extensive documentation & on-screen help" },
  { icon: Activity, label: "Extensive logs & complete visibility of pipeline health" },
];

export function WhyChoose({ title }: { title: string }) {
  return (
    <section className="bg-ink py-16 text-white lg:py-20">
      <div className="container-page">
        <h2 className="max-w-3xl text-2xl font-bold tracking-tight text-balance sm:text-3xl">{title}</h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-brand-blue">
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-medium text-white/85">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
