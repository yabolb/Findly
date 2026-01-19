import { MetadataRoute } from 'next';

/**
 * Robots.txt Configuration
 * 
 * PRD Section 8: SEO & AISO
 * - Allow all search engines to crawl public pages
 * - Block admin and API routes
 * - Reference sitemap for efficient crawling
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://findly.com').trim().replace(/\/$/, '');

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/*',
                    '/api/*',
                ],
            },
            // Special rules for AI crawlers (AISO - AI Search Optimization)
            {
                userAgent: 'GPTBot', // OpenAI
                allow: '/',
                disallow: ['/admin/*', '/api/*'],
            },
            {
                userAgent: 'ChatGPT-User', // ChatGPT Browse
                allow: '/',
                disallow: ['/admin/*', '/api/*'],
            },
            {
                userAgent: 'Google-Extended', // Google Bard/Gemini
                allow: '/',
                disallow: ['/admin/*', '/api/*'],
            },
            {
                userAgent: 'anthropic-ai', // Claude
                allow: '/',
                disallow: ['/admin/*', '/api/*'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
