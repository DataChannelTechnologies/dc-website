import { toEmbedUrl } from "@/lib/cms";

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const src = toEmbedUrl(url);
  if (!src) return null;
  return (
    <div className="aspect-video overflow-hidden rounded-2xl border shadow-lg">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="size-full"
      />
    </div>
  );
}
