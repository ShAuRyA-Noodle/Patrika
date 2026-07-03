import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "पत्रिका · Patrika",
    short_name: "Patrika",
    description: "A bilingual journal of poems by Neelu Shori.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f4",
    theme_color: "#f5f5f4",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
