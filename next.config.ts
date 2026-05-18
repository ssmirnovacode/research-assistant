import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["langchain", "@langchain/anthropic", "@langchain/core"],
};

export default nextConfig;
