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
        source: "/:dir(brand|team)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/(icon|apple-icon|favicon\\.ico)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
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
      // 1) Canonical: força www (308) quando host é o apex
      {
        source: "/:path*",
        has: [{ type: "host", value: "straggia.com" }],
        destination: "https://www.straggia.com/:path*",
        permanent: true,
      },

      // 2) Rotas antigas → novas (SEO / evitar 404)
      { source: "/pre-diagnostico", destination: "/agenda", permanent: true },

      // Slugs corrigidos: use as rotas públicas (sem prefixos numéricos de arquivo)
      { source: "/blog/basico-estraordinario", destination: "/blog/basico-extraordinario", permanent: true },
      { source: "/blog/okrs-bussola",           destination: "/blog/okr-bussola",           permanent: true },
    ];
  },
};

export default nextConfig;