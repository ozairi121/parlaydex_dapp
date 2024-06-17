/** @type {import('next').NextConfig} */
const { createProxyMiddleware } = require('http-proxy-middleware');

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*', // Proxy to Backend
      },
    ];
  },
  async middleware() {
    return createProxyMiddleware('/api', {
      target: 'http://localhost:8000',
      changeOrigin: true,
    });
  },
};

module.exports = nextConfig;
