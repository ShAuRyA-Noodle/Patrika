import type { Metadata } from "next";
import { Fraunces, Cormorant_Garamond, Tiro_Devanagari_Hindi, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/motion/MotionProvider";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

const tiroHindi = Tiro_Devanagari_Hindi({
  variable: "--font-deva",
  subsets: ["devanagari"],
  style: ["normal", "italic"],
  weight: ["400"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "पत्रिका · Patrika, poems by Neelu Shori",
  description: "A bilingual journal of poems by Neelu Shori. Three poems on silence, suffering, and the floods a woman is never allowed to spill.",
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
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
