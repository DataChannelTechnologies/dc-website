// Downloads the live items of the migrated Webflow collections into
// .webflow-cache/. Credentials come from .env (WEBFLOW_SITE_API_ID = API token).
// Run via: docker compose --profile tools run --rm webflow-import
import fs from "node:fs";
const OUT = process.env.WEBFLOW_CACHE_DIR || ".webflow-cache";
fs.mkdirSync(OUT, { recursive: true });
const clean = (v) => (v || "").trim().replace(/^['"]|['"]$/g, "");
const tok = clean(process.env.WEBFLOW_SITE_API_ID);
const H = { Authorization: `Bearer ${tok}` };
const cols = {
  integration: "634fa785d369cb26170b6dd7", "integration-tags": "6358cfcbf1579ccf67229c91",
  destinations: "636b5bf35192965aae40cba3", "destination-tags": "636b58d4d0fed9749222e73e",
  warehouses: "6385cfc174a733b291549130", "etl-sources": "6385d299cdea47221ef558ef",
  "reverse-etl-destinations": "639ae7c95d394f7c2ee0af4c", category: "634fa785d369cb34fd0b6dda",
  blogs: "634fa785d369cb844a0b6dd3", author: "634fa785d369cbbd0e0b6dd4", "blog-tag": "634fa785d369cbce160b6dd2",
  "case-study": "634fa785d369cb7b440b6dd6", career: "634fa785d369cb9bef0b6dd5",
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url) {
  for (let i = 0; i < 5; i++) {
    const r = await fetch(url, { headers: H });
    if (r.status === 429) { await sleep(2000 * (i + 1)); continue; }
    if (!r.ok) throw new Error(url.replace(/\?.*/, "") + " " + r.status);
    return r.json();
  }
}
for (const [slug, id] of Object.entries(cols)) {
  const schema = await get(`https://api.webflow.com/v2/collections/${id}`);
  let items = [], offset = 0;
  while (true) {
    const j = await get(`https://api.webflow.com/v2/collections/${id}/items/live?limit=100&offset=${offset}`);
    items.push(...j.items); offset += j.items.length;
    if (offset >= j.pagination.total || j.items.length === 0) break;
  }
  fs.writeFileSync(`${OUT}/${slug}.json`, JSON.stringify({ schema, items }, null, 2));
  console.log(slug, items.length, "items;", schema.fields.map((f) => `${f.slug}:${f.type}`).join(", "));
}
