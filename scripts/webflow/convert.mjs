// Converts the Webflow API dump (.webflow-cache/*.json) into Decap CMS content
// files (content/<collection>/<slug>.json) and downloads every Webflow-hosted
// image into public/images/cms/<collection>/.
// WARNING: overwrites content files of the same slug, i.e. CMS edits made on
// Netlify to migrated entries. Only re-run before cut-over, then review the git diff.
import fs from "node:fs";
import path from "node:path";
import TurndownService from "turndown";

const OUT = process.env.WEBFLOW_CACHE_DIR || ".webflow-cache", SITE = process.cwd();
const load = (c) => JSON.parse(fs.readFileSync(`${OUT}/${c}.json`, "utf8")).items;
const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced", emDelimiter: "*" });

const imageJobs = new Map(); // remote url -> local public path
function localImage(url, collection) {
  if (!url) return "";
  if (imageJobs.has(url)) return imageJobs.get(url);
  let base = decodeURIComponent(url.split("/").pop().split("?")[0]);
  base = base.replace(/^[0-9a-f]{24}_/, "").toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-");
  const id = (url.match(/\/([0-9a-f]{24})_/) || [, ""])[1].slice(-6);
  const ext = path.extname(base) || ".png";
  const name = `${path.basename(base, ext).slice(0, 60)}${id ? "-" + id : ""}${ext}`;
  const p = `/images/cms/${collection}/${name}`;
  imageJobs.set(url, p);
  return p;
}
function md(html, collection) {
  if (!html) return "";
  let h = html
    .replace(/ id="[^"]*"/g, "")
    .replace(/<p>(\s|\u200d|&zwj;|&nbsp;)*<\/p>/g, "")      // Webflow spacer paragraphs
    .replace(/<img([^>]*?)src="([^"]+)"/g, (m, pre, src) => `<img${pre}src="${/webflow|website-files/.test(src) ? localImage(src, collection) : src}"`);
  return td.turndown(h).replace(/\u200d/g, "").replace(/\n{3,}/g, "\n\n").trim();
}
const img = (v, c) => (v && v.url ? localImage(v.url, c) : "");
const date = (v) => (v ? v.slice(0, 10) : "");
function write(collection, slug, data) {
  const dir = `${SITE}/content/${collection}`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/${slug}.json`, JSON.stringify(data, null, 2) + "\n");
}
const byId = (items) => Object.fromEntries(items.map((i) => [i.id, i.fieldData.slug]));
const ref = (map, id, ctx) => { if (!id) return ""; if (!map[id]) { console.warn("dangling ref", ctx, id); return ""; } return map[id]; };

const iTags = load("integration-tags"), dTags = load("destination-tags");
const integrations = load("integration"), destinations = load("destinations"), warehouses = load("warehouses");
const iTagMap = byId(iTags), dTagMap = byId(dTags), intMap = byId(integrations), destMap = byId(destinations), whMap = byId(warehouses);

for (const [col, items] of [["integration-tags", iTags], ["destination-tags", dTags]])
  for (const { fieldData: f } of items)
    write(col, f.slug, { name: f.name, slug: f.slug, color: f["tag-color"] || "", background: f["background-color"] || "" });

for (const { fieldData: f } of warehouses)
  write("warehouses", f.slug, {
    name: f.name, slug: f.slug,
    logo: img(f.logo, "warehouses"), logoAlt: f["logo-alt-text"] || f.name,
    icon: img(f.icon, "warehouses"), iconAlt: f["icon-alt-text"] || f.name,
    informationLink: f["information-link"] || "", managedWarehouseAvailable: !!f["managed-warehouse-available"],
    seoTitle: "", seoDescription: "",
  });

for (const { fieldData: f } of integrations)
  write("integrations", f.slug, {
    name: f.name, slug: f.slug, category: ref(iTagMap, f.category, f.slug),
    shortInfo: f["integration-short-info"] || "",
    icon: img(f["integration-icon"], "integrations"), image: img(f["integration-image"], "integrations"),
    brief: md(f["integration-brief"], "integrations"),
    showAbout: !!f["show-about-section"], about: md(f["about-integration-text"], "integrations"),
    availableData: md(f["available-data-text"], "integrations"),
    sourceDocsUrl: f["source-documentation-url"] || "", docsUrl: f["dc-documentation-url"] || "",
    releaseDate: date(f.releasedate), seoTitle: "", seoDescription: "",
  });

for (const { fieldData: f } of destinations)
  write("destinations", f.slug, {
    name: f.name, slug: f.slug, category: ref(dTagMap, f.category, f.slug),
    shortInfo: f["destination-short-info"] || "",
    icon: img(f["destination-icon"], "destinations"), image: img(f["destination-image"], "destinations"),
    brief: md(f["destination-brief"], "destinations"),
    showAbout: !!f["show-about-section-3"], about: md(f["about-destination-text"], "destinations"),
    availableSync: md(f["available-sync-text"], "destinations"),
    sourceDocsUrl: f["source-documentation-url"] || "", docsUrl: f["dc-documentation-url"] || "",
    releaseDate: date(f.releasedate), seoTitle: "", seoDescription: "",
  });

for (const { fieldData: f } of load("etl-sources"))
  write("etl-sources", f.slug, {
    name: f.name, slug: f.slug,
    source: ref(intMap, f["data-source"], f.slug), warehouse: ref(whMap, f["data-warehouse"], f.slug),
    category: ref(iTagMap, f["category-2"], f.slug),
    showSteps: !!f["show-steps"], steps: md(f["steps-to-configure"], "etl-sources"),
    showVideo: !!f["show-video"], videoUrl: f["demo-video-link"]?.url || "",
    seoTitle: "", seoDescription: "",
  });

for (const { fieldData: f } of load("reverse-etl-destinations"))
  write("reverse-etl-destinations", f.slug, {
    name: f.name, slug: f.slug,
    warehouse: ref(whMap, f["data-warehouse"], f.slug), destination: ref(destMap, f.destination, f.slug),
    category: ref(dTagMap, f.category, f.slug),
    showSteps: !!f["show-steps"], steps: md(f["steps-to-configure"], "reverse-etl-destinations"),
    showVideo: !!f["show-video"], videoUrl: f["demo-video-link"]?.url || "",
    seoTitle: "", seoDescription: "",
  });

// Download images (8 at a time)
const jobs = [...imageJobs.entries()];
let ok = 0, fail = 0;
for (let i = 0; i < jobs.length; i += 8) {
  await Promise.all(jobs.slice(i, i + 8).map(async ([url, p]) => {
    const dest = SITE + "/public" + p;
    if (fs.existsSync(dest)) { ok++; return; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    for (let t = 0; t < 3; t++) {
      try { const r = await fetch(url); if (!r.ok) throw new Error(r.status); fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer())); ok++; return; }
      catch (e) { if (t === 2) { fail++; console.warn("image failed", url, e.message); } }
    }
  }));
}
console.log("images ok", ok, "failed", fail);
for (const c of fs.readdirSync(`${SITE}/content`)) { const d = `${SITE}/content/${c}`; if (fs.statSync(d).isDirectory()) console.log(c, fs.readdirSync(d).length); }
