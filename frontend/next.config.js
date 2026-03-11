/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone', // Required for Next.js 14 SSR on Amplify
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
