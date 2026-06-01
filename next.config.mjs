import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "ghchart.rshah.org" },
    ],
  },
  experimental: {
    // react-icons is optimized by default in Next 16; framer-motion is not.
    optimizePackageImports: ["framer-motion"],
  },
};

export default withNextIntl(nextConfig);
