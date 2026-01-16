/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: '**.wallapop.com',
            },
            {
                protocol: 'https',
                hostname: '**.vinted.com',
            },
            {
                protocol: 'https',
                hostname: '**.ebay.com',
            },
        ],
    },
};

export default nextConfig;
