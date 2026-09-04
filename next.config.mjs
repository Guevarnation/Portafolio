import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * Canonical host. The apex domain 308-redirects here on Vercel; any other
 * host (preview deployments, *.vercel.app, localhost) is told not to index.
 */
const CANONICAL_HOST = "www.eugenioguevara.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stable in Next 16; auto-memoizes components so the animation-heavy client
  // islands re-render less. Requires babel-plugin-react-compiler (devDep).
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        // `missing` (not a negative-lookahead `has`) is correct under both
        // Next's own anchored host matching and Vercel's routing layer, which
        // applies this rule from routes-manifest.json: the header is added
        // whenever the Host header is NOT the canonical host.
        missing: [
          {
            type: "host",
            value: CANONICAL_HOST.replace(/\./g, "\\."),
          },
        ],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
