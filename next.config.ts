import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://warmhearted-goose-69.convex.cloud/api/storage/**"),
    ],
  },
  experimental: {
    ppr: "incremental",
  },
};

export default nextConfig;
