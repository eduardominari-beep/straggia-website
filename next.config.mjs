/** @type {import('next').NextConfig} */
const nextConfig = {
  // Qualidade de build/runtime
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // MDX (mantém seu blog funcionando)
  experimental: {
    mdxRs: true,
  },

  // Tolerâncias que você já vinha usando
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Otimização de imagens (mantém PNGs com transparência e gera AVIF/WebP quando possível)
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Cache longo para imagens estáticas e cabeçalhos de segurança simples
  async headers() {
    return [
      {
        // /public/brand/* e /public/team/*  → cache longo, imutável
        source: "/:dir(brand|team)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cabeçalhos gerais seguros
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Se quiser, depois adicionamos CSP/Permissions-Policy com calma
        ],
      },
    ];
  },

  // Força www (308 permanente) – bom para SEO e caching
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "straggia.com" }],
        destination: "https://www.straggia.com/:path*",
        permanent: true, // 308
      },
    ];
  },
};

export default nextConfig;