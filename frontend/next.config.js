/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone', // ✅ Required for optimized container & Amplify SSR deployment
    images: {
        domains: [],
    },
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        return [
            {
                source: '/api/:path*',
                destination: `${apiUrl}/:path*`, // Proxy to FastAPI backend
            },
        ];
    },
};

module.exports = nextConfig;
