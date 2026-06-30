import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['deck.gl', '@deck.gl/core', '@deck.gl/layers', '@deck.gl/mesh-layers', '@deck.gl/mapbox'],
};

export default nextConfig;
