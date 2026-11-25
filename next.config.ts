import type { NextConfig } from "next";

// Static export: Netlify serves the generated `out/` folder as plain files,
// and Decap CMS (public/admin) commits content changes that trigger a rebuild.
// trailingSlash: false -> /integration/foo is exported as integration/foo.html,
// which Netlify serves at exactly /integration/foo (the original Webflow URL).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
};

export default nextConfig;
