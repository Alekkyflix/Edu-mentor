const { withAmplifyHosting } = require('@aws-amplify/adapter-nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
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

// Temporarily bypassing Sentry to confirm Amplify works
module.exports = withAmplifyHosting(nextConfig);