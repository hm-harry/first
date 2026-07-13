import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Next.js 16 配置 */
  reactStrictMode: true,

  /* API 代理到后端 Spring Boot */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },

  /* TypeScript 严格模式 */
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
