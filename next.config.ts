import type { NextConfig } from "next";

// Static export: Netlify serves the generated `out/` folder as plain files,
// and Decap CMS (public/admin) commits content changes that trigger a rebuild.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
