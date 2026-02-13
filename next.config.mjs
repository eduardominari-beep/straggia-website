/** @type {import('next').NextConfig} */
const isProd = process.env.VERCEL_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  experimental: {
    mdxRs: true,
    optimizePackageImports: ["lucide-react"],
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async headers() {
    return [
      {
        // assets estáticos com cache longo
        source: "/:dir(brand|team)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // ícones expostos pelo app dir — regras simples (sem regex)
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
        source: "/icon.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
        source: "/apple-icon.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
        // cabeçalhos de segurança e (em preview) noindex
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          ...(isProd ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" }]),
        ],
      },
    ];
  },

  async redirects() {
    return [
      // força www
      {
        source: "/:path*",
        has: [{ type: "host", value: "straggia.com" }],
        destination: "https://www.straggia.com/:path*",
        permanent: true,
      },
      // correções de slugs
      {
        source: "/blog/basico-estraordinario",
        destination: "/blog/0998basico-extraordinario",
        permanent: true,
      },
      {
        source: "/blog/okrs-bussola",
        destination: "/blog/1000okr-bussola",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
    { source: "/lp/atracta", destination: "/lp/atracta/index.html" },
    { source: "/lp/atracta/", destination: "/lp/atracta/index.html" },

    { source: "/lp/valuation", destination: "/lp/valuation/index.html" },
    { source: "/lp/valuation/", destination: "/lp/valuation/index.html" },
    ];
  },
};

export default nextConfig;