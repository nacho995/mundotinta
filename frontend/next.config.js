/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'm.media-amazon.com',
      'images-na.ssl-images-amazon.com',
      'i.gr-assets.com',
      'covers.openlibrary.org',
      'images-eu.ssl-images-amazon.com',
      'upload.wikimedia.org',
      'media.amazonwebservices.com',
      'cdn.pixabay.com',
      'libros.hipercor.es'
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
