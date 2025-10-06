/** @type {import('next').NextConfig} */
const isProd = process.env.VERCEL_ENV === "production";

const nextConfig = {
  // Qualidade de build/runtime
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // MDX do blog
  experimental: {
    mdxRs: true,
    // melhora bundle dos ícones (importes mais leves)
    optimizePackageImports: ["lucide-react"],
  },

  // Tolerâncias já usadas
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Otimização de imagens
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Cabeçalhos e cache
  async headers() {
    return [
      // /public/brand/* e /public/team/* → cache longo e imutável
      {
        source: "/:dir(brand|team)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Ícones padrão expostos pelo app dir (/icon.png, /apple-icon.png, /favicon.ico)
      {
        source: "/(icon|apple-icon|favicon.ico)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }], // 7 dias
      },
      // Cabeçalhos gerais
      {
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Evita indexação de previews (Vercel Preview / Dev)
          ...(isProd ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" }]),
        ],
      },
    ];
  },

  // Redirecionamentos
  async redirects() {
    return [
      // Força www (apenas quando host é o apex)
      {
        source: "/:path*",
        has: [{ type: "host", value: "straggia.com" }],
        destination: "https://www.straggia.com/:path*",
        permanent: true, // 308
      },

      // ⬇️ Exemplos para mapear slugs antigos → novos (SEO / correções)
      // {
      //   source: "/blog/okr-bussola",
      //   destination: "/blog/okrs-bussola",
      //   permanent: true,
      // },
      // { source: "/artigo-antigo", destination: "/blog/artigo-novo", permanent: true },
    ];
  },
};

export default nextConfig;