import type { NextConfig } from "next";

// Tipe kustom agar linter TypeScript tidak memunculkan error 'Unexpected any'
type WebpackRule = {
  test?: { test?: (str: string) => boolean };
  issuer?: unknown;
  resourceQuery?: { not?: unknown[] };
  exclude?: unknown;
};

const nextConfig: NextConfig = {
  turbopack: {},
  webpack(config) {
    // 1. Cari aturan bawaan Next.js untuk file SVG
    const fileLoaderRule = config.module.rules.find((rule: WebpackRule) =>
      rule.test?.test?.(".svg")
    );

    // 2. Tambahkan aturan resmi dari SVGR untuk Next.js
    config.module.rules.push(
      // Aturan A: Jika suatu saat kamu butuh SVG sebagai URL (contoh: import icon from './icon.svg?url')
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      // Aturan B: Jadikan semua import .svg default sebagai React Component
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule?.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule?.resourceQuery?.not || []), /url/],
        },
        use: ["@svgr/webpack"],
      }
    );

    // 3. Matikan aturan bawaan agar tidak memproses file .svg dan bentrok dengan Aturan B
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;