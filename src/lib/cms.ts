// Build-time loader for the CMS collections in /content/<collection>/<slug>.json.
// These files are created/edited by Decap CMS (see public/admin/config.yml) and
// were originally migrated from the Webflow CMS. The FILE NAME is the URL slug,
// so renaming a file changes a public URL — avoid that for existing pages (SEO).
import "server-only";
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Tag = { slug: string; name: string; color: string; background: string };

type Seo = { seoTitle: string; seoDescription: string };

export type Integration = Seo & {
  slug: string;
  name: string;
  category: string;
  shortInfo: string;
  icon: string;
  image: string;
  brief: string;
  showAbout: boolean;
  about: string;
  availableData: string;
  sourceDocsUrl: string;
  docsUrl: string;
  releaseDate: string;
};

export type Destination = Seo & {
  slug: string;
  name: string;
  category: string;
  shortInfo: string;
  icon: string;
  image: string;
  brief: string;
  showAbout: boolean;
  about: string;
  availableSync: string;
  sourceDocsUrl: string;
  docsUrl: string;
  releaseDate: string;
};

export type Warehouse = Seo & {
  slug: string;
  name: string;
  logo: string;
  logoAlt: string;
  icon: string;
  iconAlt: string;
  informationLink: string;
  managedWarehouseAvailable: boolean;
};

export type EtlSource = Seo & {
  slug: string;
  name: string;
  source: string; // integration slug
  warehouse: string; // warehouse slug
  category: string;
  showSteps: boolean;
  steps: string;
  showVideo: boolean;
  videoUrl: string;
};

export type ReverseEtlDestination = Seo & {
  slug: string;
  name: string;
  warehouse: string; // warehouse slug
  destination: string; // destination slug
  category: string;
  showSteps: boolean;
  steps: string;
  showVideo: boolean;
  videoUrl: string;
};

const cache = new Map<string, unknown[]>();

function readCollection<T extends { slug: string; name: string }>(folder: string): T[] {
  if (cache.has(folder)) return cache.get(folder) as T[];
  const dir = path.join(CONTENT_DIR, folder);
  const items = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".json"))
        .map((file) => {
          const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
          const slug = file.replace(/\.json$/, "");
          if (data.slug && data.slug !== slug) {
            console.warn(`[cms] ${folder}/${file}: slug field "${data.slug}" differs from file name; using file name.`);
          }
          return { ...data, slug } as T;
        })
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];
  cache.set(folder, items);
  return items;
}

export const getIntegrationTags = () => readCollection<Tag>("integration-tags");
export const getDestinationTags = () => readCollection<Tag>("destination-tags");
export const getIntegrations = () => readCollection<Integration>("integrations");
export const getDestinations = () => readCollection<Destination>("destinations");
export const getWarehouses = () => readCollection<Warehouse>("warehouses");
export const getEtlSources = () => readCollection<EtlSource>("etl-sources");
export const getReverseEtlDestinations = () => readCollection<ReverseEtlDestination>("reverse-etl-destinations");

const find = <T extends { slug: string }>(items: T[], slug: string) => items.find((i) => i.slug === slug);
export const getIntegration = (slug: string) => find(getIntegrations(), slug);
export const getDestination = (slug: string) => find(getDestinations(), slug);
export const getWarehouse = (slug: string) => find(getWarehouses(), slug);
export const getEtlSource = (slug: string) => find(getEtlSources(), slug);
export const getReverseEtlDestination = (slug: string) => find(getReverseEtlDestinations(), slug);
export const getIntegrationTag = (slug: string) => find(getIntegrationTags(), slug);
export const getDestinationTag = (slug: string) => find(getDestinationTags(), slug);

/** CMS rich text is stored as Markdown (raw HTML allowed). Content is authored by trusted editors. */
export function renderMarkdown(md: string): string {
  if (!md) return "";
  return marked.parse(md, { gfm: true, async: false }) as string;
}

/** Converts a YouTube/Vimeo watch URL into an embeddable URL, or returns null. */
export function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
