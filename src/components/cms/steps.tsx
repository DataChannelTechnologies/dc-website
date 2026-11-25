/** Numbered step cards (static marketing copy shared by templates). */
export function Steps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex flex-col gap-3 rounded-2xl border bg-white p-6">
          <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary to-brand-blue text-sm font-bold text-white">
            {i + 1}
          </span>
          <h3 className="font-bold text-ink">{s.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
