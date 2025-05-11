/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
};

export default nextConfig;
