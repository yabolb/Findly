/**
 * AMAZON PRODUCT ADVERTISING API SERVICE
 * 
 * This service handles all interactions with Amazon's PA-API 5.0.
 * It will remain dormant until credentials are added to .env.local.
 * 
 * NOTE: The official 'paapi5-nodejs-sdk' causes build issues in Next.js/Webpack
 * due to dynamic requires. This file currently contains the structure but
 * avoids importing the broken SDK.
 * 
 * Required Environment Variables:
 * - AMAZON_ACCESS_KEY
 * - AMAZON_SECRET_KEY
 * - AMAZON_ASSOCIATE_TAG
 * - AMAZON_REGION (default: 'es' for Spain)
 * - AMAZON_MARKETPLACE (default: 'www.amazon.es')
 */

// Check if credentials are configured
export const isAmazonAPIConfigured = (): boolean => {
    return !!(
        process.env.AMAZON_ACCESS_KEY &&
        process.env.AMAZON_SECRET_KEY &&
        process.env.AMAZON_ASSOCIATE_TAG
    );
};

// Map Amazon category to Findly category
const mapAmazonCategoryToFindly = (browseNode?: string): string => {
    // This is a simple mapping - you can expand based on Amazon's BrowseNode IDs
    const categoryMap: Record<string, string> = {
        'Electronics': 'tech-electronics',
        'Fashion': 'fashion',
        'Sports': 'sports-outdoors',
        'Home': 'home-garden',
        'Books': 'books',
        'Movies': 'movies',
        'Music': 'music',
        'Outdoors': 'travel-experiences',
    };

    return categoryMap[browseNode || ''] || 'tech-electronics'; // Default fallback
};

export interface AmazonProduct {
    asin: string;
    title: string;
    price: number;
    currency: string;
    imageUrl: string;
    affiliateUrl: string;
    category: string;
    description?: string;
}

/**
 * Search for products on Amazon by keyword
 */
export const searchAmazonProducts = async (
    keywords: string,
    maxResults: number = 10
): Promise<AmazonProduct[]> => {
    if (!isAmazonAPIConfigured()) {
        console.warn('Amazon PA-API credentials not configured. Skipping API calls.');
        return [];
    }

    try {
        console.log(`Searching Amazon for: ${keywords} (Limit: ${maxResults})`);

        // TODO: Implement direct HTTP request to Amazon PA-API here
        // The 'paapi5-nodejs-sdk' is not compatible with Next.js edge/serverless builds
        // We will implement a raw fetch() implementation when credentials are proactively available.

        return [];

    } catch (error: any) {
        console.error('Amazon PA-API Error:', error.message);
        throw new Error(`Failed to search Amazon products: ${error.message}`);
    }
};

/**
 * Get specific products by ASIN
 */
export const getAmazonProductsByASIN = async (
    asins: string[]
): Promise<AmazonProduct[]> => {
    if (!isAmazonAPIConfigured()) {
        console.warn('Amazon PA-API credentials not configured. Skipping API calls.');
        return [];
    }

    try {
        console.log(`Fetching Amazon ASINs: ${asins.join(', ')}`);

        // TODO: Implement direct HTTP request to Amazon PA-API here

        return [];
    } catch (error: any) {
        console.error('Amazon PA-API Error:', error.message);
        throw new Error(`Failed to get Amazon products: ${error.message}`);
    }
};
