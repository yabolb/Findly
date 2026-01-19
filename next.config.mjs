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
            {
                protocol: 'https',
                hostname: 'm.media-amazon.com',
            },
            {
                protocol: 'https',
                hostname: 'images-na.ssl-images-amazon.com',
            },
            {
                protocol: 'https',
                hostname: '**.media-amazon.com',
            },
            {
                protocol: 'https',
                hostname: '**.amazon.es',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png|webp|avif|ico|woff|woff2)',
                locale: false,
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
