import { Category, CATEGORY_LABELS } from "@/types";

/**
 * SEO & AISO Utilities
 * PRD Section 8: SEO & AISO (AI Search Optimization)
 */

interface PageMetadata {
    title: string;
    description: string;
    keywords: string[];
    ogTitle?: string;
    ogDescription?: string;
}

/**
 * Generate dynamic page title based on search context
 * PRD Section 8: AISO Requirements
 */
export function generatePageTitle(params: {
    query?: string;
    category?: Category;
    location?: string;
}): string {
    const { query, category, location } = params;

    // Searching with query
    if (query) {
        let title = `Find ${query} second-hand`;
        if (location) {
            title += ` in ${location}`;
        }
        title += " on Wallapop, Vinted & more | Findly";
        return title;
    }

    // Browsing category
    if (category) {
        const categoryName = CATEGORY_LABELS[category];
        let title = `${categoryName} Deals & Second-hand products`;
        if (location) {
            title += ` in ${location}`;
        }
        title += " | Findly";
        return title;
    }

    // Default homepage
    return "Findly – Find Amazing Deals on Second-Hand Products | Wallapop, Vinted & More";
}

/**
 * Generate meta description for SEO
 */
export function generateMetaDescription(params: {
    query?: string;
    category?: Category;
    location?: string;
    productCount?: number;
}): string {
    const { query, category, location, productCount } = params;

    const countText = productCount ? `${productCount.toLocaleString()}+ ` : "";

    if (query) {
        let desc = `Discover ${countText}second-hand ${query}`;
        if (location) {
            desc += ` in ${location}`;
        }
        desc += ". Compare prices from Wallapop, Vinted, eBay & Milanuncios. Find the best deals on Findly.";
        return desc;
    }

    if (category) {
        const categoryName = CATEGORY_LABELS[category].toLowerCase();
        let desc = `Browse ${countText}${categoryName} deals`;
        if (location) {
            desc += ` in ${location}`;
        }
        desc += ". Second-hand products from top marketplaces. Save money and find bargains on Findly.";
        return desc;
    }

    return "The smartest way to find second-hand deals. Search across Wallapop, Vinted, eBay & Milanuncios. Compare prices, discover bargains, and buy smarter.";
}

/**
 * Generate meta keywords for SEO
 */
export function generateMetaKeywords(params: {
    query?: string;
    category?: Category;
}): string[] {
    const baseKeywords = [
        "second-hand",
        "segunda mano",
        "marketplace",
        "deals",
        "bargains",
        "wallapop",
        "vinted",
        "ebay",
        "milanuncios",
    ];

    if (params.query) {
        return [
            ...baseKeywords,
            params.query.toLowerCase(),
            `${params.query} second-hand`,
            `buy ${params.query}`,
        ];
    }

    if (params.category) {
        const categoryName = CATEGORY_LABELS[params.category].toLowerCase();
        return [...baseKeywords, categoryName, `${categoryName} deals`, `second-hand ${categoryName}`];
    }

    return baseKeywords;
}

/**
 * Generate complete page metadata
 */
export function generatePageMetadata(params: {
    query?: string;
    category?: Category;
    location?: string;
    productCount?: number;
}): PageMetadata {
    const title = generatePageTitle(params);
    const description = generateMetaDescription(params);
    const keywords = generateMetaKeywords(params);

    return {
        title,
        description,
        keywords,
        ogTitle: title,
        ogDescription: description,
    };
}

/**
 * Generate JSON-LD structured data for products
 * PRD Section 8: AISO with Product schema
 */
export function generateProductJsonLd(product: {
    title: string;
    description: string;
    price: number;
    currency: string;
    image_url: string;
    source_url: string;
    condition: string;
}) {
    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.title,
        description: product.description,
        image: product.image_url,
        url: product.source_url,
        offers: {
            "@type": "Offer",
            price: product.price.toString(),
            priceCurrency: product.currency,
            availability: "https://schema.org/InStock",
            itemCondition: `https://schema.org/${product.condition === "new" ? "NewCondition" : "UsedCondition"
                }`,
        },
    };
}

/**
 * Generate JSON-LD for search results page
 */
export function generateSearchResultsJsonLd(params: {
    query?: string;
    category?: Category;
    products: Array<{
        title: string;
        price: number;
        currency: string;
        image_url: string;
        source_url: string;
    }>;
}) {
    const { query, category, products } = params;

    if (products.length === 0) return null;

    const lowPrice = Math.min(...products.map((p) => p.price));
    const highPrice = Math.max(...products.map((p) => p.price));

    return {
        "@context": "https://schema.org/",
        "@type": "ItemList",
        name: query || (category ? CATEGORY_LABELS[category] : "Products"),
        numberOfItems: products.length,
        itemListElement: products.slice(0, 10).map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "Product",
                name: product.title,
                image: product.image_url,
                url: product.source_url,
                offers: {
                    "@type": "AggregateOffer",
                    lowPrice: lowPrice.toString(),
                    highPrice: highPrice.toString(),
                    priceCurrency: product.currency,
                },
            },
        })),
    };
}

/**
 * Generate canonical URL for SEO
 */
export function generateCanonicalUrl(params: {
    baseUrl: string;
    path: string;
    query?: string;
    category?: Category;
}): string {
    const { baseUrl, path, query, category } = params;

    let url = `${baseUrl}${path}`;

    const queryParams: string[] = [];
    if (query) queryParams.push(`q=${encodeURIComponent(query)}`);
    if (category) queryParams.push(`category=${category}`);

    if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
    }

    return url;
}
