/**
 * AMAZON PRODUCT ADVERTISING API SERVICE
 * 
 * This service handles all interactions with Amazon's PA-API 5.0.
 * It will remain dormant until credentials are added to .env.local.
 * 
 * Required Environment Variables:
 * - AMAZON_ACCESS_KEY
 * - AMAZON_SECRET_KEY
 * - AMAZON_ASSOCIATE_TAG
 * - AMAZON_REGION (default: 'es' for Spain)
 * - AMAZON_MARKETPLACE (default: 'www.amazon.es')
 */

import { DefaultApi, SearchItemsRequest, GetItemsRequest, PartnerType, SearchItemsResource, GetItemsResource } from 'paapi5-nodejs-sdk';

// Check if credentials are configured
export const isAmazonAPIConfigured = (): boolean => {
    return !!(
        process.env.AMAZON_ACCESS_KEY &&
        process.env.AMAZON_SECRET_KEY &&
        process.env.AMAZON_ASSOCIATE_TAG
    );
};

// Initialize the PA-API client
const getAmazonAPIClient = (): DefaultApi | null => {
    if (!isAmazonAPIConfigured()) {
        console.warn('Amazon PA-API credentials not configured. Skipping API calls.');
        return null;
    }

    return new DefaultApi();
};

// Map Amazon category to Findly category
const mapAmazonCategoryToFindly = (browseNode?: string): string => {
    // This is a simple mapping - you can expand based on Amazon's BrowseNode IDs
    const categoryMap: Record<string, string> = {
        'Electronics': 'tech-electronics',
        'Fashion': 'fashion',
        'Sports': 'sports-leisure',
        'Home': 'home-garden',
        'Books': 'movies-books-music',
        'Outdoors': 'travel-experiences',
    };

    return categoryMap[browseNode || ''] || 'tech-electronics'; // Default fallback
};

interface AmazonProduct {
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
    const client = getAmazonAPIClient();
    if (!client) {
        throw new Error('Amazon PA-API not configured. Add credentials to .env.local');
    }

    try {
        const searchItemsRequest = new SearchItemsRequest();
        searchItemsRequest['PartnerTag'] = process.env.AMAZON_ASSOCIATE_TAG!;
        searchItemsRequest['PartnerType'] = PartnerType.ASSOCIATES;
        searchItemsRequest['Keywords'] = keywords;
        searchItemsRequest['ItemCount'] = maxResults;
        searchItemsRequest['Marketplace'] = process.env.AMAZON_MARKETPLACE || 'www.amazon.es';
        searchItemsRequest['Resources'] = [
            SearchItemsResource.ITEMINFOTITLE,
            SearchItemsResource.OFFERSLISTINGSPRICE,
            SearchItemsResource.IMAGESPRIMARYLARGE,
            SearchItemsResource.BROWSENODEINFOBROWSENODES,
        ];

        const response = await client.searchItems(searchItemsRequest);

        if (!response.SearchResult?.Items) {
            return [];
        }

        // Transform Amazon response to our format
        return response.SearchResult.Items.map((item: any): AmazonProduct => {
            const price = item.Offers?.Listings?.[0]?.Price?.Amount || 0;
            const currency = item.Offers?.Listings?.[0]?.Price?.Currency || 'EUR';
            const imageUrl = item.Images?.Primary?.Large?.URL || '';
            const title = item.ItemInfo?.Title?.DisplayValue || 'Unknown Product';
            const browseNode = item.BrowseNodeInfo?.BrowseNodes?.[0]?.DisplayName;

            return {
                asin: item.ASIN,
                title,
                price: parseFloat(price),
                currency,
                imageUrl,
                affiliateUrl: item.DetailPageURL || '',
                category: mapAmazonCategoryToFindly(browseNode),
                description: item.ItemInfo?.Features?.DisplayValues?.join(' ') || undefined,
            };
        });
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
    const client = getAmazonAPIClient();
    if (!client) {
        throw new Error('Amazon PA-API not configured. Add credentials to .env.local');
    }

    try {
        const getItemsRequest = new GetItemsRequest();
        getItemsRequest['PartnerTag'] = process.env.AMAZON_ASSOCIATE_TAG!;
        getItemsRequest['PartnerType'] = PartnerType.ASSOCIATES;
        getItemsRequest['ItemIds'] = asins;
        getItemsRequest['Marketplace'] = process.env.AMAZON_MARKETPLACE || 'www.amazon.es';
        getItemsRequest['Resources'] = [
            GetItemsResource.ITEMINFOTITLE,
            GetItemsResource.OFFERSLISTINGSPRICE,
            GetItemsResource.IMAGESPRIMARYLARGE,
            GetItemsResource.BROWSENODEINFOBROWSENODES,
        ];

        const response = await client.getItems(getItemsRequest);

        if (!response.ItemsResult?.Items) {
            return [];
        }

        // Transform Amazon response to our format
        return response.ItemsResult.Items.map((item: any): AmazonProduct => {
            const price = item.Offers?.Listings?.[0]?.Price?.Amount || 0;
            const currency = item.Offers?.Listings?.[0]?.Price?.Currency || 'EUR';
            const imageUrl = item.Images?.Primary?.Large?.URL || '';
            const title = item.ItemInfo?.Title?.DisplayValue || 'Unknown Product';
            const browseNode = item.BrowseNodeInfo?.BrowseNodes?.[0]?.DisplayName;

            return {
                asin: item.ASIN,
                title,
                price: parseFloat(price),
                currency,
                imageUrl,
                affiliateUrl: item.DetailPageURL || '',
                category: mapAmazonCategoryToFindly(browseNode),
                description: item.ItemInfo?.Features?.DisplayValues?.join(' ') || undefined,
            };
        });
    } catch (error: any) {
        console.error('Amazon PA-API Error:', error.message);
        throw new Error(`Failed to get Amazon products: ${error.message}`);
    }
};
