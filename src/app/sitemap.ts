import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { CATEGORY_LABELS, Category } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Dynamic Sitemap Generation
 * 
 * PRD Section 8: SEO & AISO
 * Generates sitemap with:
 * - Homepage
 * - All 13 category pages
 * - Top 100 most popular product searches for pSEO
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://findly.com';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const currentDate = new Date();
    const urls: MetadataRoute.Sitemap = [];

    // 1. Homepage - Highest priority
    urls.push({
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'hourly',
        priority: 1.0,
    });

    // 2. All Category Pages - High priority
    Object.keys(CATEGORY_LABELS).forEach((category) => {
        urls.push({
            url: `${baseUrl}/search?category=${category}`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.9,
        });
    });

    // 3. Top 100 Most Popular Products (pSEO Routes)
    try {
        // Get top 100 products by title popularity (group by similar titles)
        const { data: popularProducts } = await supabase
            .from('products')
            .select('title, category, created_at')
            .order('created_at', { ascending: false })
            .limit(100);

        if (popularProducts) {
            // Create search pages for popular product queries
            const uniqueQueries = new Set<string>();

            popularProducts.forEach((product) => {
                // Extract key search terms from product titles
                const query = product.title
                    .toLowerCase()
                    .split(' ')
                    .slice(0, 3) // Take first 3 words as query
                    .join('+');

                if (query && !uniqueQueries.has(query)) {
                    uniqueQueries.add(query);

                    urls.push({
                        url: `${baseUrl}/search?q=${encodeURIComponent(query)}`,
                        lastModified: new Date(product.created_at),
                        changeFrequency: 'weekly',
                        priority: 0.7,
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error fetching popular products for sitemap:', error);
    }

    // 4. El Radar del Regalo Perfecto - Content Marketing
    try {
        // Radar index page
        urls.push({
            url: `${baseUrl}/radar`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.8,
        });

        // All published articles
        const { data: articles } = await supabase
            .from('articles')
            .select('slug, updated_at')
            .eq('is_published', true)
            .order('published_at', { ascending: false });

        if (articles) {
            articles.forEach((article) => {
                urls.push({
                    url: `${baseUrl}/radar/${article.slug}`,
                    lastModified: new Date(article.updated_at),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                });
            });
        }
    } catch (error) {
        console.error('Error fetching articles for sitemap:', error);
    }

    // 5. Static Legal Pages (when implemented)
    const staticPages = [
        { path: '/takedown', priority: 0.3, changeFrequency: 'monthly' as const },
        { path: '/about', priority: 0.4, changeFrequency: 'monthly' as const },
        { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' as const },
        { path: '/terms', priority: 0.3, changeFrequency: 'monthly' as const },
    ];

    staticPages.forEach(({ path, priority, changeFrequency }) => {
        urls.push({
            url: `${baseUrl}${path}`,
            lastModified: currentDate,
            changeFrequency,
            priority,
        });
    });

    return urls;
}
