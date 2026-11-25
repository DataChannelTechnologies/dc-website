"use client";

import { useEffect } from "react";

// Same tags as the Webflow site. They only load on the production domain so the
// netlify.app staging site and local dev don't pollute analytics.
const PRODUCTION_HOSTS = ["www.datachannel.co", "datachannel.co"];
const GTM_ID = "GTM-WT93KQS";
const GA4_ID = "G-FV8161Y9M6";
const HUBSPOT_ID = "242851951";
const LINKEDIN_PARTNER_ID = "6750924";
const CLARITY_ID = "ev3kia4gtr";
const META_PIXEL_ID = "713146112803670";

function addScript(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    _linkedin_partner_id: string;
    _linkedin_data_partner_ids: string[];
    clarity: { (...args: unknown[]): void; q?: unknown[] };
    fbq: { (...args: unknown[]): void; callMethod?: (...a: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: unknown };
    _fbq: unknown;
    __dcAnalyticsLoaded?: boolean;
  }
}

export function Analytics() {
  useEffect(() => {
    if (!PRODUCTION_HOSTS.includes(window.location.hostname) || window.__dcAnalyticsLoaded) return;
    window.__dcAnalyticsLoaded = true;

    // Google Tag Manager + GA4
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    addScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID);
    addScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);

    // HubSpot
    addScript(`https://js-na2.hs-scripts.com/${HUBSPOT_ID}.js`, { id: "hs-script-loader", defer: "" });

    // LinkedIn Insight
    window._linkedin_partner_id = LINKEDIN_PARTNER_ID;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(LINKEDIN_PARTNER_ID);
    addScript("https://snap.licdn.com/li.lms-analytics/insight.min.js");

    // Microsoft Clarity
    window.clarity =
      window.clarity ||
      function clarity(...args: unknown[]) {
        (window.clarity.q = window.clarity.q || []).push(args);
      };
    addScript(`https://www.clarity.ms/tag/${CLARITY_ID}`);

    // Meta pixel
    if (!window.fbq) {
      const fbq = function (...args: unknown[]) {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue.push(args);
      } as Window["fbq"];
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      window.fbq = fbq;
      window._fbq = fbq;
      addScript("https://connect.facebook.net/en_US/fbevents.js");
    }
    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
  }, []);
  return null;
}
