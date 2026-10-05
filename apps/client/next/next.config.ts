import type { NextConfig } from 'next';

const backendApiEndpoint = process.env.NEXT_PUBLIC_BASE_SERVER_API_ENDPOINT?.replace(/\/$/, '');

const nextConfig: NextConfig = {
  async rewrites() {
    if (!backendApiEndpoint) return [];

    return [
      {
        source: '/api/:path*',
        destination: `${backendApiEndpoint}/:path*`,
      },
    ];
  },
};

export default nextConfig;
