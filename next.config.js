/** @type {import('next').NextConfig} */
const nextConfig = {
  // to collocate files used only in a single page
  // ref: https://nextjs.org/docs/pages/api-reference/next-config-js/pageExtensions#including-non-page-files-in-the-pages-directory
  pageExtensions: ["page.tsx"],
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_SOURCE: process.env.NEXT_PUBLIC_API_SOURCE,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_SOURCE}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: `/home`,
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "smart-school-1.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
