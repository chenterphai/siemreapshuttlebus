import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://enchanted-shepherd-899.convex.cloud/api/storage/**"),
    ],
  },
  // experimental: {
  //   ppr: "incremental",
  // },
};

export default nextConfig;
