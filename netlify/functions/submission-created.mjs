// Netlify event-triggered function: runs automatically for every verified
// (non-spam) Netlify Forms submission and posts it to Slack.
//
// Setup (Netlify UI): Project configuration -> Environment variables ->
//   SLACK_WEBHOOK_URL = https://hooks.slack.com/services/... (scope: Functions)
// Requires Netlify Forms "form detection" to be enabled for the project.

const FORM_TITLES = {
  contact: "New contact form message",
  lead: "New lead",
  "career-application": "New job application",
};
const HIDDEN = new Set(["form-name", "bot-field", "ip", "user_agent", "referrer"]);

const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const label = (k) => k.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function formatValue(v) {
  if (v && typeof v === "object") {
    // File uploads arrive as { url, filename, ... }
    if (v.url) return `<${v.url}|${esc(v.filename || "Download file")}>`;
    return esc(JSON.stringify(v));
  }
  const s = String(v ?? "").trim();
  return s ? esc(s).slice(0, 2900) : "_(empty)_";
}

export function buildSlackMessage(payload) {
  const form = payload.form_name || payload.data?.["form-name"] || "form";
  const data = payload.data || {};
  const fields = Object.entries(data).filter(([k, v]) => !HIDDEN.has(k) && v !== "" && v != null);
  const page = data.page || data.referrer || "";
  const title = FORM_TITLES[form] || `New "${form}" submission`;
  return {
    text: `${title}${data.name ? ` from ${esc(data.name)}` : ""}`, // notification fallback
    blocks: [
      { type: "header", text: { type: "plain_text", text: title.slice(0, 150) } },
      {
        type: "section",
        fields: fields.slice(0, 10).map(([k, v]) => ({ type: "mrkdwn", text: `*${esc(label(k))}*\n${formatValue(v)}` })),
      },
      ...(fields.length > 10
        ? [{ type: "section", text: { type: "mrkdwn", text: fields.slice(10).map(([k, v]) => `*${esc(label(k))}:* ${formatValue(v)}`).join("\n") } }]
        : []),
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: `Form: \`${esc(form)}\`${page ? ` · Page: ${esc(page)}` : ""} · ${esc(payload.created_at || new Date().toISOString())}` },
        ],
      },
    ],
  };
}

export const handler = async (event) => {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.error("SLACK_WEBHOOK_URL is not set; skipping Slack notification");
    return { statusCode: 200, body: "skipped" };
  }
  let payload;
  try {
    payload = JSON.parse(event.body || "{}").payload || {};
  } catch {
    console.error("Could not parse submission body");
    return { statusCode: 200, body: "bad body" };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildSlackMessage(payload)),
    });
    if (!res.ok) console.error("Slack webhook failed", res.status, await res.text());
  } catch (e) {
    console.error("Slack webhook error", e);
  }
  // Always 200: a failed notification must not affect the stored submission.
  return { statusCode: 200, body: "ok" };
};
