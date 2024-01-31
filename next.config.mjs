/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'healthy-tiger-56.convex.cloud',
      },
    ],
  },
};

export default nextConfig;
