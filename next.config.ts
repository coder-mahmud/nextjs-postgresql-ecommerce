import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // your image host
        pathname: "/**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // add more if needed
        pathname: "/**",
      },
    ],
  },



};

export default nextConfig;
