import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ── Required for Docker/Cloud Run standalone deployment ──────────────────
  output: "standalone",

  // ── Suppress multiple-lockfiles workspace warning ─────────────────────────
  turbopack: {
    root: path.resolve(__dirname),
  },

  // ── TypeScript & ESLint ───────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },

  // ── External image domains used in the app ────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile photos
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // ── Security headers ──────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",     value: "nosniff" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection",           value: "1; mode=block" },
          { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
