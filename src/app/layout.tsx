import type { Metadata, Viewport } from "next";
import { Fraunces, Cormorant_Garamond, Tiro_Devanagari_Hindi, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/motion/MotionProvider";
import { POEMS } from "@/lib/poems";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const tiroHindi = Tiro_Devanagari_Hindi({
  variable: "--font-deva",
  subsets: ["devanagari"],
  style: ["normal", "italic"],
  weight: ["400"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = "https://sparshita.com";
const SITE_NAME = "पत्रिका · Patrika";
const DESCRIPTION =
  "A bilingual journal of poems by Neelu Shori. Three poems on silence, suffering, and the floods a woman is never allowed to spill.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "पत्रिका · Patrika, poems by Neelu Shori",
    template: "%s · पत्रिका",
  },
  description: DESCRIPTION,
  applicationName: "Patrika",
  authors: [{ name: "Neelu Shori" }],
  creator: "Neelu Shori",
  publisher: "Neelu Shori",
  keywords: [
    "Neelu Shori",
    "नीलू शोरी",
    "पत्रिका",
    "Patrika",
    "Hindi poetry",
    "Devanagari poetry",
    "bilingual poems",
    "मौन वेदना",
    "दफ़्न सैलाब",
    "अनकहा दर्द",
  ],
  category: "literature",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "पत्रिका · Patrika, poems by Neelu Shori",
    description: "A bilingual journal of poems by Neelu Shori.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "पत्रिका · Patrika",
    description: "A bilingual journal of poems by Neelu Shori.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f5f4",
  colorScheme: "light",
};

// Structured data. Only true facts: the real journal, the real poet, and her three
// real poems (titles + language). No invented dates, bios, ratings, or reviews.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: "Patrika, poems by Neelu Shori",
      description: DESCRIPTION,
      inLanguage: ["hi", "en"],
      author: { "@id": `${SITE_URL}/#poet` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#poet`,
      name: "Neelu Shori",
      alternateName: "नीलू शोरी",
      jobTitle: "Poet",
      url: SITE_URL,
    },
    ...POEMS.map((p) => ({
      "@type": "CreativeWork",
      name: p.titleDeva,
      alternateName: p.titleRoman,
      genre: "Poetry",
      inLanguage: "hi",
      author: { "@id": `${SITE_URL}/#poet` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      url: SITE_URL,
    })),
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${cormorant.variable} ${tiroHindi.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col surface theme-forest">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
