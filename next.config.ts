import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Les tests de bout en bout construisent dans un dossier à part.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
