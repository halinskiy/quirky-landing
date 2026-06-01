import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/quirky-landing",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
