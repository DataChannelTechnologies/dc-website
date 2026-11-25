// Section-based pages (migrated Webflow static pages) stored in /content/pages/*.json.
// Each entry declares its own public `path` (e.g. "/compare/datachannel-vs-hevo"),
// which must stay identical to the Webflow URL. Schema is mirrored in
// public/admin/config.yml (Decap) and checked by scripts/validate-pages.mjs.
import "server-only";
import fs from "node:fs";
import path from "node:path";

export type CtaLink = { label: string; href: string; variant?: "primary" | "outline" };
export type Embed = { kind: "hubspot-meeting" | "iframe" | "video"; url: string; height?: number };

export type HeroBlock = {
  type: "hero";
  eyebrow?: string;
  title: string;
  subtitle?: string; // markdown
  ctas?: CtaLink[];
  perks?: string[];
  image?: string;
  embed?: Embed;
  align?: "left" | "center";
};
export type RichTextBlock = { type: "richText"; heading?: string; body: string; width?: "narrow" | "wide"; muted?: boolean };
export type SplitBlock = {
  type: "split";
  eyebrow?: string;
  heading: string;
  body?: string; // markdown
  bullets?: string[];
  image?: string;
  imagePosition?: "left" | "right";
  ctas?: CtaLink[];
  muted?: boolean;
};
export type FeatureItem = { title: string; body?: string; image?: string; icon?: string; link?: CtaLink };
export type FeatureGridBlock = {
  type: "featureGrid";
  eyebrow?: string;
  heading?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  style?: "cards" | "plain" | "dark";
  imageStyle?: "icon" | "photo" | "cover"; // icon = small logo/icon, photo = round portrait, cover = full-width image
  items: FeatureItem[];
};
export type StatsBlock = { type: "stats"; heading?: string; items: { value: string; label: string }[] };
export type ComparisonTableBlock = {
  type: "comparisonTable";
  heading?: string;
  subtitle?: string;
  columns: string[]; // first = row label header, rest = products
  highlightColumn?: number; // index into columns of the highlighted product column (default 1)
  rows: { feature: string; values: string[] }[]; // "yes" | "no" | "partial" | free text
  note?: string; // markdown
};
export type TestimonialItem = {
  headline?: string; // short pull quote shown in bold above the quote
  quote: string;
  name: string;
  role?: string;
  image?: string;
  stats?: { value: string; label: string }[];
  link?: CtaLink; // e.g. "Read case study"
};
export type TestimonialsBlock = { type: "testimonials"; heading?: string; subtitle?: string; items: TestimonialItem[] };
export type LogosBlock = { type: "logos"; title?: string; showReviews?: boolean }; // showReviews adds the G2 / Capterra badges
export type FaqBlock = { type: "faq"; heading?: string; subtitle?: string; items: { question: string; answer: string }[] };
export type PricingPlan = {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: CtaLink;
  highlighted?: boolean;
};
export type PricingBlock = { type: "pricing"; heading?: string; subtitle?: string; plans: PricingPlan[]; note?: string };
export type StepsBlock = { type: "steps"; heading?: string; subtitle?: string; items: { title: string; body: string }[] };
export type CtaBlock = { type: "cta"; heading: string; body?: string; ctas: CtaLink[] };
export type CtaCardsBlock = { type: "ctaCards" };
export type EmbedBlock = { type: "embed"; heading?: string; subtitle?: string } & Embed;
export type FormField = { name: string; label: string; type?: "text" | "email" | "tel" | "textarea"; required?: boolean; placeholder?: string };
export type FormBlock = {
  type: "form";
  heading?: string;
  body?: string; // markdown, shown beside the form
  form: "contact" | "lead";
  fields: FormField[];
  offer?: string; // hidden value sent with lead forms, e.g. the dashboard name
  submitLabel?: string;
  successMessage?: string;
  redirectTo?: string;
};

export type Block =
  | HeroBlock
  | RichTextBlock
  | SplitBlock
  | FeatureGridBlock
  | StatsBlock
  | ComparisonTableBlock
  | TestimonialsBlock
  | LogosBlock
  | FaqBlock
  | PricingBlock
  | StepsBlock
  | CtaBlock
  | CtaCardsBlock
  | EmbedBlock
  | FormBlock;

export type Page = {
  title: string; // internal name shown in the CMS
  path: string; // public URL path, e.g. "/pricing"
  seoTitle: string;
  seoDescription: string;
  noindex?: boolean;
  blocks: Block[];
};

const DIR = path.join(process.cwd(), "content", "pages");
let cache: Page[] | null = null;

export function getPages(): Page[] {
  if (cache) return cache;
  const pages = fs.existsSync(DIR)
    ? fs
        .readdirSync(DIR)
        .filter((f) => f.endsWith(".json"))
        .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as Page)
    : [];
  const seen = new Set<string>();
  for (const p of pages) {
    if (!/^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(p.path)) throw new Error(`[pages] invalid path "${p.path}" (${p.title})`);
    if (seen.has(p.path)) throw new Error(`[pages] duplicate path "${p.path}"`);
    seen.add(p.path);
  }
  cache = pages.sort((a, b) => a.path.localeCompare(b.path));
  return cache;
}

export const getPageByPath = (p: string) => getPages().find((x) => x.path === p);
