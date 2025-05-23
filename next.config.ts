import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "image.buoncf.jp",
        port: "",
        pathname: "/**"
      },
    ],
  },
  env: {
    api_url: "http://localhost:4001/",
    ftp_url: "https://image.buoncf.jp/myjapanese/",
  }
};

export default nextConfig;
