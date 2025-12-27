import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    quality: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dbdnibcfezptsdzymafb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
