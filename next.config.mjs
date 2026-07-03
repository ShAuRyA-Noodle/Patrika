import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this project so Next does not pick up an
  // unrelated lockfile found higher up the filesystem.
  turbopack: {
    root: __dirname,
  },
  images: {
    // serve modern formats for the manuscript scans + ink art
    formats: ["image/avif", "image/webp"],
    // Next 16 requires an explicit qualities allowlist to serve any quality other than 75
    qualities: [50, 62, 75, 82],
  },
};

export default nextConfig;
