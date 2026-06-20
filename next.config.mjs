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
};

export default nextConfig;
