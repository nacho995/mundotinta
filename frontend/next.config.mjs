/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Configuración de imágenes para hosts externos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'proassetspdlcom.cdnstatics2.com',
        port: '',
        pathname: '/usuaris/**',
      },
      {
        protocol: 'https',
        hostname: 'imagessl0.casadellibro.com',
        port: '',
        pathname: '/a/l/**',
      },
    ],
  },
  // Permitir coexistencia entre App Router y Pages Router
  experimental: {
    esmExternals: true,
  },
  // Asegurarse que el sistema maneje correctamente ambos routers
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Opción para ignorar errores de tipo en la compilación
  typescript: {
    ignoreBuildErrors: true,
  },
  // Opción para ignorar errores de ESLint en la compilación
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
