
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
// import { Database } from '@/types/supabase'; 
import { parse } from 'csv-parse';
import unzip from 'unzip-stream';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

// Start of Selection
// const supabase = createClient();

// Interfaces for Awin API responses
interface AwinAccount {
    accountId: number;
    accountName: string;
    accountType: string;
}

interface AwinProgramme {
    id: number;
    name: string;
    displayUrl: string;
    clickThroughUrl: string;
    primaryRegion: {
        name: string;
        countryCode: string;
    };
    currencyCode: string;
    status: string;
}

interface ProductFeed {
    advertiserId: number;
    advertiserName: string;
    url: string;
    lastImported: Date | null;
}

const AWIN_API_TOKEN = process.env.AWIN_API_TOKEN;
const AWIN_PUBLISHER_ID = process.env.AWIN_PUBLISHER_ID;
const BASE_URL = 'https://api.awin.com';

/**
 * Service to handle Awin API interactions and product sync
 */
export class AwinService {

    /**
     * Fetch all joined programmes (advertisers) for the publisher
     */
    async fetchJoinedProgrammes(): Promise<AwinProgramme[]> {
        if (!AWIN_API_TOKEN || !AWIN_PUBLISHER_ID) {
            throw new Error('Awin credentials (AWIN_API_TOKEN, AWIN_PUBLISHER_ID) are missing');
        }

        try {
            // Endpoint: /publishers/{publisherId}/programmes
            // Filter: relationship=joined
            const response = await fetch(
                `${BASE_URL}/publishers/${AWIN_PUBLISHER_ID}/programmes?relationship=joined`,
                {
                    headers: {
                        'Authorization': `Bearer ${AWIN_API_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch programmes: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data as AwinProgramme[];
        } catch (error) {
            console.error('Error fetching joined programmes:', error);
            throw error;
        }
    }

    /**
     * Construct the Product Feed URL for a specific advertiser
     */
    getFeedUrl(advertiserId: number): string {
        // Basic CSV feed with essential columns
        const columns = [
            'product_name',
            'description',
            'search_price',
            'currency',
            'merchant_image_url',
            'awin_product_id',
            'merchant_product_id',
            'merchant_category',
            'awin_deep_link', // The tracking link
            'merchant_deep_link'
        ].join(',');

        // Using ZIP format to save bandwidth
        return `https://productdata.awin.com/datafeed/download/apikey/${AWIN_API_TOKEN}/language/any/fid/${advertiserId}/columns/${columns}/format/csv/compression/zip`;
    }

    /**
     * Map Awin raw category to Findly category
     */
    mapCategory(rawCategory: string, productName: string): string | null {
        const text = (rawCategory + ' ' + productName).toLowerCase();

        if (text.match(/iphone|laptop|macbook|samsung|pixel|camera|audio|headphone|speaker|console|gaming|nintendo|playstation|xbox|tablet/)) return 'tech-electronics';
        if (text.match(/shirt|dress|jeans|jacket|coat|sneakers|shoes|boots|bag|purse|wallet|clothing|fashion|watch|jewelry/)) return 'fashion';
        if (text.match(/sofa|chair|table|desk|lamp|bed|mattress|furniture|garden|kitchen|cookware|home/)) return 'home-garden';
        if (text.match(/bike|bicycle|gym|fitness|yoga|tennis|football|soccer|basketball|sports|camping|tent/)) return 'sports-leisure';
        if (text.match(/toy|lego|doll|game|board game|puzzle|kid|baby|stroller|crib/)) return 'baby-kids';
        if (text.match(/book|cd|dvd|vinyl|movie|music|album/)) return 'movies-books-music';
        if (text.match(/drill|saw|hammer|tool|diy|hardware/)) return 'diy';
        if (text.match(/art|painting|sculpture|collectible|funko|antique/)) return 'collectibles-art';

        return null; // Discard if no match
    }

    /**
     * Download and process the feed for a specific advertiser
     */
    async downloadAndProcessFeed(feedUrl: string, advertiserId: number, advertiserName: string): Promise<{ processed: number; added: number; skipped: number; errors: number }> {
        let stats = { processed: 0, added: 0, skipped: 0, errors: 0 };

        console.log(`Starting sync for ${advertiserName} (${advertiserId})...`);

        try {
            const response = await fetch(feedUrl);
            if (!response.ok || !response.body) {
                throw new Error(`Failed to download feed: ${response.statusText}`);
            }

            // Create a NodeJS Readable stream from the Web Stream
            // @ts-ignore
            const nodeStream = Readable.fromWeb(response.body);

            // Streaming pipeline: Download -> Unzip -> Parse CSV -> Process Row
            await pipeline(
                nodeStream,
                // @ts-ignore
                unzip.Parse(),
                async function* (source: any) {
                    for await (const entry of source) {
                        if (entry.path.endsWith('.csv')) {
                            const parser = entry.pipe(parse({
                                columns: true,
                                skip_empty_lines: true,
                                trim: true,
                                relax_quotes: true
                            }));

                            for await (const record of parser) {
                                stats.processed++;

                                try {
                                    const service = new AwinService();
                                    const category = service.mapCategory(record.merchant_category || '', record.product_name || '');

                                    if (!category) {
                                        stats.skipped++;
                                        continue;
                                    }

                                    const price = parseFloat(record.search_price);
                                    if (isNaN(price)) {
                                        stats.skipped++; // Skip invalid price
                                        continue;
                                    }

                                    const platformKey = advertiserName.toLowerCase().replace(/[^a-z0-9]/g, '');

                                    const productData = {
                                        title: record.product_name,
                                        description: record.description,
                                        price: price,
                                        currency: record.currency || 'EUR',
                                        image_url: record.merchant_image_url,
                                        source_url: record.awin_deep_link, // TRACKING LINK
                                        platform: platformKey, // e.g. 'fnaces'
                                        source_network: 'awin',
                                        category: category,
                                        condition: 'new',
                                    };

                                    // Insert into Supabase (upsert)
                                    await supabase
                                        .from('products')
                                        .upsert({
                                            ...productData,
                                            // Ensure we update fields if it exists
                                            updated_at: new Date().toISOString()
                                        }, { onConflict: 'source_url' });

                                    stats.added++;

                                } catch (err) {
                                    stats.errors++;
                                    // console.error('Error processing row:', err); // Reduce log noise
                                }
                            }
                        } else {
                            entry.autodrain();
                        }
                    }
                }
            );

        } catch (error) {
            console.error(`Error processing feed for ${advertiserName}:`, error);
            // Don't throw entire failure if one feed fails, but maybe log it?
            // throw error; 
        }

        return stats;
    }

    /**
     * Main sync function
     */
    async syncProducts() {
        console.log('Starting Awin Universal Sync...');

        try {
            // 1. Get Partners
            const partners = await this.fetchJoinedProgrammes();
            console.log(`Found ${partners.length} joined partners.`);

            // 2. Iterate and Sync
            for (const partner of partners) {
                const feedUrl = this.getFeedUrl(partner.id);

                try {
                    // Log start
                    await supabase.from('sync_logs').insert({
                        platform: `awin-${partner.name}`,
                        status: 'running',
                        items_found: 0,
                        items_added: 0
                    });

                    const stats = await this.downloadAndProcessFeed(feedUrl, partner.id, partner.name);

                    // Log success
                    await supabase.from('sync_logs').insert({
                        platform: `awin-${partner.name}`,
                        status: 'success',
                        items_found: stats.processed,
                        items_added: stats.added,
                        error_message: stats.errors > 0 ? `${stats.errors} row errors` : null
                    });

                } catch (err: any) {
                    console.error(`Failed sync for ${partner.name}:`, err);
                    // Log failure
                    await supabase.from('sync_logs').insert({
                        platform: `awin-${partner.name}`,
                        status: 'error',
                        error_message: err.message
                    });
                }
            }

        } catch (err) {
            console.error('Critical Awin Sync Failure:', err);
        }
    }

}
