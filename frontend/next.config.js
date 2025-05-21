/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.shopify.com',
      'k2y7fj-cj.myshopify.com'
    ],
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    // Si la URL del backend no está definida, no configuramos redirecciones
    if (!backendUrl) {
      console.warn('NEXT_PUBLIC_BACKEND_URL no está definida, las redirecciones de API no funcionarán');
      return [];
    }
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
