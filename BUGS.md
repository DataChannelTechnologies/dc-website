# Open bugs

Known issues after the Webflow → Netlify migration. Each item says where to fix it:
**CMS** means the Netlify CMS at `/admin/` (or the JSON file under `content/`), **code** means a code change.

Status as of 2026-11-25. Netlify builds are **stopped** (deploy budget). Commits pushed to `main` are not live until builds are turned back on and a deploy is triggered.

---

## Blockers before switching www.datachannel.co to Netlify

| # | Issue | Fix |
| --- | --- | --- |
| B1 | ~~Webflow 301 redirects not migrated.~~ **Fixed locally, not deployed:** all 6 Webflow redirects (`/blog`, `/features`, `/request-demo`, `/career`, `/pricing-old`, `/old-home-3`, from `datachannel-2026-11-25.csv`) are in `netlify.toml`. | Verify after the next deploy |
| B2 | **Form submissions aren't delivered anywhere yet.** The Slack notifier (`netlify/functions/submission-created.mjs`) is written and tested locally but not deployed. `SLACK_WEBHOOK_URL` is set in Netlify; form detection still needs enabling (Netlify → Forms). No end-to-end submission has been tested. | Enable form detection, deploy, submit each form once and check the Slack channel |
| B3 | **Analytics untested.** GTM, GA4, HubSpot, LinkedIn, Clarity and the Meta pixel only load on `www.datachannel.co` / `datachannel.co` (`src/components/analytics.tsx`), so they can't be verified before cut-over. | Check GA4 Realtime / Tag Assistant right after cut-over |
| B4 | **Every CMS save triggers a production deploy** once builds are active, because each save commits to `main`. With deploy billing, a busy editing day can burn the budget. Builds are currently **stopped** in Netlify (2026-11-25). | Before turning builds back on, consider Decap `publish_mode: editorial_workflow` (batches edits), or keep deploying deliberately |

## Content errors copied from Webflow (fix in CMS)

| # | Page | Issue |
| --- | --- | --- |
| C1 | `/pricing` | The Professional plan card says **30M rows, $15 per million** after; the comparison table says **20 Million, $10 / million**. Confirm which is right. |
| C2 | `/landing-pages/datachannel-vs-airbyte` | The whole page talks about **Fivetran** (eyebrow, bullets, tables, migration section). |
| C3 | `/landing-pages/datachannelvsfunnel` | The Funnel price card contains **Hevo's** details. |
| C4 | `/landing-pages/datachannel-vs-fivetran`, `/landing-pages/datachannel-vs-fivetran-new` | The last two DataChannel cells are swapped in the comparison table ("Support Turn Around Time" = Yes; "ISO, HIPAA, GDPR compliance" = "Priority Support in all Plans"). |
| C5 | `/landing-pages/datachannel-vs-airbyte` | The pricing section says "21 day free trial"; the rest of the site says 14 days. |
| C6 | `/compare/datachannel-vs-funnel` | The meta description says "instead of Fivetran". |
| C7 | `/compare/datachannel-vs-fivetran` | The "Request your migration" button links to `#` (dead). The other compare pages use the HubSpot meeting link. |
| C8 | `/landing-pages/thank-you` | "Read some Customer Case Studies ↗" links to `#`. Suggest `/case-studies`. |
| C9 | `/overview` | The "Intuitive & simple self-serve interface" card repeats the "Truly cost effective solution" text. |
| C10 | `/landing-pages/datachannel-vs-fivetran-new` | All 5 feature tabs use the same body sentence. |
| C11 | Several | **Placeholder SEO titles:** "DataChannelVsAirbyte", "DataChannelVsFunnel", "DataChannelVsSupermetrics", "DataChannelVsFivetran-New". **Duplicate descriptions:** `/landing-pages/thank-you` reuses the book-demo description; `/landing-pages/general` and `/landing-pages/main` share one. |
| C12 | Several | **Typos:** "rigousuly", "reachout", "Save upto 70%" (`/landing-pages/e-commerce-etl`); "Marekting Data Analyst", "Reverse ET" (`/landing-pages/datachannel-vs-fivetran-new`); "Acquistion" in three dashboard H1s and "Products & Category Breakdown" (`/landing-pages/dashboards/*`); "host your the data" (`/pricing` FAQ); "do not let other's fail" (`/about`). |
| C13 | ETL source pages | Some "steps to configure" texts were copy-pasted from other connectors in Webflow, e.g. `/etl-sources/etl-active-campaign-to-bigquery` describes **Google Ads** setup. A full audit of the 534 entries is needed. |
| C14 | Blog posts | Links to deleted posts (also 404 on Webflow): `/blogs/trending-etl-tools-2022` (8 links), `/blogs/how-to-prepare-for-amazon-prime-day-2023` (3), `/blogs/unlock-the-true-potential-of-your-campaigns-with-amazon-dsp` (1). |
| C15 | Blog posts | **Malformed links:** `…/integration/flipkart-sellers://www.datachannel.co/book-a-demo` in `better-your-flipkart-sales-business-with-datachannel`; trailing `'` on links to `/solutions/digital-marketing` and `/blogs/amazon-seller-central-vs-amazon-vendor-central` in `measuring-and-improving-your-amazon-ads-campaigns`, and to `/etl` in `beyond-open-source-why-reliable-data-integration-matters`. |
| C16 | `/schedule-demo` | Uses a Calendly embed (`calendly.com/mitali-narula`); every other demo page uses HubSpot Meetings. Check it's still the right scheduler. |
| C17 | Pages without an H1 on Webflow | `/pricing`, the 9 `/compare/*` pages, `/landing-pages/e-commerce-etl`, `/landing-pages/etl-tools` and the four Hevo-style landing pages had no H1, so their first H2 became the H1. Review the wording. |

## Renderer limitations (code)

Things the section builder (`src/components/blocks/blocks.tsx`, schema in `src/lib/pages.ts`) can't yet show the way Webflow did:

| # | Issue | Affected pages |
| --- | --- | --- |
| R1 | Hero titles and headings are plain text, so **links inside headings were lost** (e.g. "ETL" → `/etl`, "Reverse ETL" → `/reverse-etl`). | `/overview`, `/landing-pages/general`, `/landing-pages/main` |
| R2 | **No anchors or modals:** the "Get this Free Template" hero button (which opened a modal) was dropped. The form now sits directly below the hero. | 8 `/landing-pages/dashboards/*` pages |
| R3 | **Tabbed sections are flattened** into stacked text + image sections. | `/orchestration`, `/landing-pages/etl-tools`, comparison landing pages |
| R4 | **No eyebrow** on pricing / comparison table blocks ("Pricing", "DataChannel Vs Other ETL Tools" labels dropped). | Several landing pages |
| R5 | **Image galleries aren't supported:** `/about` "What we do" shows 1 of 6 office photos. | `/about` |
| R6 | **Comparison table headers are text only:** the Fivetran logo column header became plain text. | Fivetran landing pages |
| R7 | **G2/Capterra badges inside the hero aren't supported** (only below the logo strip). | `/landing-pages/datachannel-vs-fivetran-new` |
| R8 | **Tableau Public embeds** use Webflow's fixed desktop heights (1527–4527px) and fixed widths, so they may scroll sideways inside the frame on smaller screens. | 8 dashboard pages |

## Technical debt (code)

| # | Issue |
| --- | --- |
| T1 | **Images are unoptimized:** `public/images` is about 161 MB, served as-is (`images.unoptimized` for static export). Large PNG/WebP files will hurt Core Web Vitals. Add a build-time resize/compress step, or use Netlify Image CDN. |
| T2 | **Home page blog teaser is hard-coded** in `content/home.json` and goes stale when new posts are published. Drive it from blog posts flagged "Feature on home page". |
| T3 | **Blog dates use Webflow's item creation date** (`createdOn`). Webflow didn't show a date on posts, so check that these are the dates you want shown. |
| T4 | **Large CMS collections:** ETL source pages (534 entries) may load slowly in Decap's list view and relation dropdowns. |
| T5 | **Slug renames:** for collections the file name is the URL. Editing the "slug" field of an existing entry doesn't rename the file or move the page. The build logs a warning, but editors can be confused. |
| T6 | **Mobile QA:** the home page and the integration/ETL templates were checked on mobile. The 43 section-built pages written by migration agents were only spot-checked on desktop. |
| T7 | **Webflow re-sync overwrites CMS edits:** `docker compose --profile tools run --rm webflow-import` overwrites migrated collection entries. Stop using it once editors work in the new CMS. |
