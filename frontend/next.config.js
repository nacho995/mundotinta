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
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_BACKEND_URL + '/api/:path*',
      },
    ]
  },
};

module.exports = nextConfig;
