import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/v1/:path*",
        destination: `${process.env.SUPABASE_URL || "http://auth:9999"}/:path*`,
      },
      {
        source: "/api/auth/:path*",
        destination: `${process.env.SUPABASE_URL || "http://auth:9999"}/:path*`,
      },
    ];
  },
  headers: async () => [
    {
      source: "/api/(.*)",
      headers: [
        {
          key: "Access-Control-Allow-Origin",
          value: "*",
        },
        {
          key: "Access-Control-Allow-Methods",
          value: "GET, POST, PUT, DELETE, OPTIONS",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: "Content-Type, Authorization",
        },
        {
          key: "Content-Range",
          value: "bytes : 0-9/*",
        },
      ],
    },
  ],
};

export default nextConfig;
