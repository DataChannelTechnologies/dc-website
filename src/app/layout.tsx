import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { homeContent } from "@/lib/content";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.datachannel.co"),
  title: homeContent.seo.title,
  description: homeContent.seo.description,
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: homeContent.seo.title,
    description: homeContent.seo.description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
