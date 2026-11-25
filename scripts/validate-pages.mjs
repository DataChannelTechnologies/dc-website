// Validates content/pages/*.json against the section schema (src/lib/pages.ts).
// Usage: node scripts/validate-pages.mjs [file ...]   (defaults to all pages)
// Exit code 1 on any error. Also checks that local image paths exist in public/.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "content/pages");
const ICONS = ["check","zap","shield","database","chart","clock","users","globe","layers","workflow","sparkles","rocket","plug","refresh","lock","settings","dollar","support","trending","filter","bell","code","cloud","file"];
const FORM_FIELDS = { contact: ["name","email","subject","message"], lead: ["name","email","company","phone","message"] };
const RESERVED = /^\/(integration|integrations|destinations|warehouses|data-warehouses|etl-sources|reverse-etl-destinations|blogs|author|blog-tag|case-study|case-studies|career|careers|admin|images)(\/|$)/;

const errors = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const str = (v) => typeof v === "string" && v.trim().length > 0;
const optStr = (v) => v === undefined || typeof v === "string";
const arr = (v) => Array.isArray(v);
function img(f, where, v) {
  if (!v) return;
  if (typeof v !== "string") return err(f, `${where}: image must be a string`);
  if (/^https?:\/\//.test(v)) return err(f, `${where}: image must be a local /images/... path (download it), got ${v.slice(0, 80)}`);
  if (!fs.existsSync(path.join(ROOT, "public", decodeURIComponent(v)))) err(f, `${where}: image file not found in public/: ${v}`);
}
function link(f, where, l) {
  if (!l || !str(l.label) || !str(l.href)) err(f, `${where}: link needs label and href`);
  else if (l.variant && !["primary","outline"].includes(l.variant)) err(f, `${where}: bad variant ${l.variant}`);
}
const links = (f, where, ls) => { if (ls === undefined) return; if (!arr(ls)) return err(f, `${where}: ctas must be an array`); ls.forEach((l, i) => link(f, `${where}.ctas[${i}]`, l)); };
function embed(f, where, e) {
  if (!["hubspot-meeting","iframe","video"].includes(e.kind)) err(f, `${where}: embed kind must be hubspot-meeting|iframe|video`);
  if (!str(e.url) || !/^https:\/\//.test(e.url)) err(f, `${where}: embed url must be https`);
  if (e.height !== undefined && typeof e.height !== "number") err(f, `${where}: height must be a number`);
}

const checks = {
  hero: (f, w, b) => { if (!str(b.title)) err(f, `${w}: title required`); links(f, w, b.ctas); img(f, w, b.image); if (b.embed) embed(f, `${w}.embed`, b.embed); if (b.perks && !arr(b.perks)) err(f, `${w}: perks must be array`); if (b.align && !["left","center"].includes(b.align)) err(f, `${w}: bad align`); },
  richText: (f, w, b) => { if (!str(b.body)) err(f, `${w}: body required`); if (b.width && !["narrow","wide"].includes(b.width)) err(f, `${w}: bad width`); },
  split: (f, w, b) => { if (!str(b.heading)) err(f, `${w}: heading required`); img(f, w, b.image); links(f, w, b.ctas); if (b.imagePosition && !["left","right"].includes(b.imagePosition)) err(f, `${w}: bad imagePosition`); if (b.bullets && !arr(b.bullets)) err(f, `${w}: bullets must be array`); },
  featureGrid: (f, w, b) => { if (!arr(b.items) || !b.items.length) err(f, `${w}: items required`); if (b.columns && ![2,3,4].includes(b.columns)) err(f, `${w}: columns must be 2|3|4`); if (b.style && !["cards","plain","dark"].includes(b.style)) err(f, `${w}: bad style`); if (b.imageStyle && !["icon","photo","cover"].includes(b.imageStyle)) err(f, `${w}: imageStyle must be icon|photo|cover`); (b.items || []).forEach((it, i) => { if (!str(it.title)) err(f, `${w}.items[${i}]: title required`); img(f, `${w}.items[${i}]`, it.image); if (it.icon && !ICONS.includes(it.icon)) err(f, `${w}.items[${i}]: unknown icon "${it.icon}" (allowed: ${ICONS.join(", ")})`); if (it.link) link(f, `${w}.items[${i}].link`, it.link); }); },
  stats: (f, w, b) => { if (!arr(b.items) || !b.items.length) err(f, `${w}: items required`); (b.items || []).forEach((s, i) => { if (!str(s.value) || !str(s.label)) err(f, `${w}.items[${i}]: value and label required`); }); },
  comparisonTable: (f, w, b) => { if (!arr(b.columns) || b.columns.length < 2) err(f, `${w}: columns needs >= 2 entries`); if (b.highlightColumn !== undefined && (!Number.isInteger(b.highlightColumn) || b.highlightColumn < 1 || b.highlightColumn >= (b.columns || []).length)) err(f, `${w}: highlightColumn must be an integer between 1 and ${(b.columns || []).length - 1}`); if (!arr(b.rows) || !b.rows.length) err(f, `${w}: rows required`); (b.rows || []).forEach((r, i) => { if (!str(r.feature)) err(f, `${w}.rows[${i}]: feature required`); if (!arr(r.values) || r.values.length !== (b.columns || []).length - 1) err(f, `${w}.rows[${i}]: values must have ${(b.columns || []).length - 1} entries`); }); },
  testimonials: (f, w, b) => { if (!arr(b.items) || !b.items.length) err(f, `${w}: items required`); (b.items || []).forEach((t, i) => { if (!str(t.quote) || !str(t.name)) err(f, `${w}.items[${i}]: quote and name required`); img(f, `${w}.items[${i}]`, t.image); if (t.stats !== undefined && (!arr(t.stats) || t.stats.some((x) => !str(x.value) || !str(x.label)))) err(f, `${w}.items[${i}]: stats must be [{value,label}]`); if (t.link) link(f, `${w}.items[${i}].link`, t.link); }); },
  logos: (f, w, b) => { if (b.showReviews !== undefined && typeof b.showReviews !== "boolean") err(f, `${w}: showReviews must be boolean`); },
  faq: (f, w, b) => { if (!arr(b.items) || !b.items.length) err(f, `${w}: items required`); (b.items || []).forEach((q, i) => { if (!str(q.question) || !str(q.answer)) err(f, `${w}.items[${i}]: question and answer required`); }); },
  pricing: (f, w, b) => { if (!arr(b.plans) || !b.plans.length) err(f, `${w}: plans required`); (b.plans || []).forEach((p, i) => { if (!str(p.name) || !str(p.price)) err(f, `${w}.plans[${i}]: name and price required`); if (!arr(p.features)) err(f, `${w}.plans[${i}]: features must be array`); link(f, `${w}.plans[${i}].cta`, p.cta); }); },
  steps: (f, w, b) => { if (!arr(b.items) || !b.items.length) err(f, `${w}: items required`); (b.items || []).forEach((s, i) => { if (!str(s.title) || !str(s.body)) err(f, `${w}.items[${i}]: title and body required`); }); },
  cta: (f, w, b) => { if (!str(b.heading)) err(f, `${w}: heading required`); if (!arr(b.ctas) || !b.ctas.length) err(f, `${w}: ctas required`); links(f, w, b.ctas); },
  ctaCards: () => {},
  embed: (f, w, b) => embed(f, w, b),
  form: (f, w, b) => { if (!FORM_FIELDS[b.form]) return err(f, `${w}: form must be contact|lead`); if (!arr(b.fields) || !b.fields.length) err(f, `${w}: fields required`); (b.fields || []).forEach((fd, i) => { if (!FORM_FIELDS[b.form].includes(fd.name)) err(f, `${w}.fields[${i}]: "${fd.name}" not allowed for ${b.form} form (allowed: ${FORM_FIELDS[b.form].join(", ")})`); if (!str(fd.label)) err(f, `${w}.fields[${i}]: label required`); if (fd.type && !["text","email","tel","textarea"].includes(fd.type)) err(f, `${w}.fields[${i}]: bad type`); }); if (b.offer !== undefined && b.form !== "lead") err(f, `${w}: offer only allowed on lead forms`); },
};

const files = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(DIR).filter((x) => x.endsWith(".json")).map((x) => path.join(DIR, x));
const paths = new Map();
for (const file of files) {
  const f = path.relative(ROOT, path.resolve(file));
  let p;
  try { p = JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) { err(f, `invalid JSON: ${e.message}`); continue; }
  if (!str(p.title)) err(f, "title required");
  if (!str(p.path) || !/^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(p.path)) err(f, `path must look like /foo/bar-baz, got ${p.path}`);
  else if (RESERVED.test(p.path)) err(f, `path ${p.path} is served by a dedicated template; don't create a page for it`);
  else if (paths.has(p.path)) err(f, `duplicate path ${p.path} (also in ${paths.get(p.path)})`);
  else paths.set(p.path, f);
  const expected = p.path ? p.path.slice(1).replace(/\//g, "--") + ".json" : "";
  // File names are cosmetic (Decap names CMS-created files after the path); only `path` decides the URL.
  void expected;
  if (!optStr(p.seoTitle) || !optStr(p.seoDescription)) err(f, "seoTitle/seoDescription must be strings");
  if (!arr(p.blocks) || !p.blocks.length) { err(f, "blocks must be a non-empty array"); continue; }
  if (p.blocks[0].type !== "hero") err(f, "first block must be a hero (it renders the page H1)");
  p.blocks.forEach((b, i) => { const c = checks[b?.type]; if (!c) err(f, `blocks[${i}]: unknown type "${b?.type}"`); else c(f, `blocks[${i}](${b.type})`, b); });
}
if (errors.length) { console.error(errors.join("\n")); console.error(`\n${errors.length} error(s)`); process.exit(1); }
console.log(`OK: ${files.length} page file(s) valid`);
