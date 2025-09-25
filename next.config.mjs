/** @type {import('next').NextConfig} */
const nextConfig = {
  // Qualidade de build/runtime
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Mantém seu suporte a MDX (seu blog usa .mdx)
  experimental: {
    mdxRs: true,
  },

  // Mantém as tolerâncias que você já definiu
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Ativa otimização de imagens na Vercel (sem desabilitar como antes)
  // PNGs com transparência continuam ok; Next gera webp/avif quando der.
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Cabeçalhos úteis: cache longo para /public/brand e /public/team
  // + cabeçalhos de segurança que não quebram nada do app.
  async headers() {
    return [
      {
        // Imagens estáticas do /public/brand e /public/team
        source: '/(brand|team)/:all*(png|jpg|jpeg|webp|svg)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cabeçalhos gerais seguros
        source: '/:path*',
        headers: [
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },

  // Se quiser forçar www aqui (já está 307 pela Vercel, então é opcional):
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path*',
  //       has: [{ type: 'host', value: 'straggia.com' }],
  //       destination: 'https://www.straggia.com/:path*',
  //       permanent: true,
  //     },
  //   ]
  // },
}

export default nextConfig