import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { homeContent, siteContent } from "@/lib/content";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.datachannel.co"),
  title: { default: homeContent.seo.title, template: "%s" },
  description: homeContent.seo.description,
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: { default: homeContent.seo.title, template: "%s" },
    description: homeContent.seo.description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans">
        <SiteHeader site={siteContent} />
        <main>{children}</main>
        <SiteFooter site={siteContent} />
        <Analytics />
      </body>
    </html>
  );
}
