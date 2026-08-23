import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      ...(process.env.R2_PUBLIC_BASE_URL ? [{ protocol: "https" as const, hostname: new URL(process.env.R2_PUBLIC_BASE_URL).hostname }] : [])
    ]
  }
};

export default nextConfig;
