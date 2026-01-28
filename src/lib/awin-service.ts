
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
// import { Database } from '@/types/supabase'; 
import { parse } from 'csv-parse';
import unzip from 'unzip-stream';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

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
const AWIN_FEED_KEY = process.env.AWIN_FEED_KEY;
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
    /**
     * Get the Feed ID (FID) for a specific advertiser by fetching the feed list
     */
    async getFeedId(advertiserId: number): Promise<number | null> {
        const apiKey = AWIN_FEED_KEY || AWIN_API_TOKEN;
        const listUrl = `https://productdata.awin.com/datafeed/list/apikey/${apiKey}`;

        try {
            console.log(`Fetching feed list to find FID for advertiser ${advertiserId}...`);
            const response = await fetch(listUrl);
            if (!response.ok) throw new Error(`Failed to fetch feed list: ${response.statusText}`);

            const text = await response.text();

            // Basic CSV parsing to find the line with the advertiser ID
            const lines = text.split('\n');
            let potentialFeeds: { id: number, name: string, count: number }[] = [];

            for (const line of lines) {
                const parts = line.split('","').map(p => p.replace(/^"|"$/g, ''));
                if (parts[0] === advertiserId.toString() && parts[3].toLowerCase() === 'active') {
                    potentialFeeds.push({
                        id: parseInt(parts[4]),
                        name: parts[5],
                        count: parseInt(parts[10]) || 0
                    });
                }
            }

            if (potentialFeeds.length === 0) {
                console.warn(`No active feed found for advertiser ${advertiserId}`);
                return null;
            }

            // Preference logic:
            // 1. Look for 'GENERAL' or 'UNIVERSAL' or 'SIN LIBROS'
            const generalFeed = potentialFeeds.find(f =>
                f.name.match(/GENERAL|UNIVERSAL|SIN LIBROS|MODA Y OCIO|Padrão|Default/i)
            );

            if (generalFeed) {
                console.log(`Selected General Feed: ${generalFeed.name} (${generalFeed.id}) with ${generalFeed.count} items`);
                return generalFeed.id;
            }

            // 2. Fallback to the largest feed
            const largestFeed = potentialFeeds.sort((a, b) => b.count - a.count)[0];
            console.log(`Selected Largest Feed: ${largestFeed.name} (${largestFeed.id}) with ${largestFeed.count} items`);
            return largestFeed.id;
        } catch (error) {
            console.error('Error fetching feed list:', error);
            return null;
        }
    }

    /**
     * Construct the Product Feed URL using the specific Feed ID (FID)
     */
    getFeedUrl(feedId: number): string {
        // Basic CSV feed with essential columns
        const columns = [
            'product_name',
            'description',
            'search_price',
            'currency',
            'merchant_image_url',
            'aw_product_id',
            'merchant_product_id',
            'merchant_category',
            'aw_deep_link', // The tracking link
            'merchant_deep_link'
        ].join(',');

        // Using ZIP format to save bandwidth
        // Use the specific Product Feed API Key
        const apiKey = AWIN_FEED_KEY || AWIN_API_TOKEN;
        return `https://productdata.awin.com/datafeed/download/apikey/${apiKey}/language/any/fid/${feedId}/columns/${columns}/format/csv/compression/zip`;
    }

    /**
     * Clean up stale 'running' logs for a specific platform
     */
    async cleanupStaleLogs(platform: string) {
        try {
            await supabase
                .from('sync_logs')
                .update({
                    status: 'error',
                    error_message: 'Interrupted by new sync or timeout'
                })
                .eq('platform', platform)
                .eq('status', 'running');
        } catch (error) {
            console.error(`Error cleaning up stale logs for ${platform}:`, error);
        }
    }

    mapCategory(rawCategory: string, productName: string): string | null {
        // 1. Try Direct Mapping from Merchant Category
        if (rawCategory) {
            const catLower = rawCategory.toLowerCase();

            // Split Movies, Books, Music (PRD v12.0 granularity)
            if (catLower.match(/música|music|cd|vinyl|disco|grabaciones|album/)) return 'music';
            if (catLower.match(/libros|books|literatura|novela|comic|manga/)) return 'books';
            if (catLower.match(/dvd|movies|pelicula|cine|blu-ray|streaming/)) return 'movies';

            // Tech
            if (catLower.match(/electronics|computers|phones|tecnologia|informatica|electronica|audio|video|consolas|gaming|videojuegos|informatica/)) return 'tech-electronics';

            // Fashion
            if (catLower.match(/apparel|clothing|shoes|accessories|ropa|moda|calzado|accesorios|joyeria|jewelry|relojes|watches/)) return 'fashion';

            // Home
            if (catLower.match(/home|garden|furniture|kitchen|hogar|jardin|muebles|cocina|decoracion|bricolaje/)) return 'home-garden';

            // Baby / Kids
            if (catLower.match(/toys|baby|games|juguetes|bebe|ninos|infantil/)) return 'baby-kids';

            // Sports
            if (catLower.match(/sports|fitness|deportes|gimnasio|aire libre|camping/)) return 'sports-outdoors';

            // Art / Collectibles
            if (catLower.match(/arts|hobbies|crafts|arte|ocio|coleccionismo|papeleria/)) return 'collectibles-art';

            // DIY
            if (catLower.match(/tools|hardware|herramientas/)) return 'diy';

            // New Categories from PRD
            if (catLower.match(/belleza|beauty|perfume|cosmetica|maquillaje/)) return 'beauty-personal-care';
            if (catLower.match(/motor|coche|moto|car|motorcycle|recambios/)) return 'motor-accessories';
            if (catLower.match(/viajes|travel|hotel|vuelo|experiencias|escapadas/)) return 'travel-experiences';
        }

        // 2. Fallback to Keyword Matching in Product Name
        const text = (rawCategory + ' ' + productName).toLowerCase();

        if (text.match(/\b(iphone|laptop|macbook|samsung|pixel|tablet|ordenador|portatil|gaming|switch|ps5|xbox|monitor)\b/)) return 'tech-electronics';
        if (text.match(/\b(shirt|dress|jeans|jacket|sneakers|shoes|bag|watch|ropa|camiseta|vestido|zapatos|bolso|reloj|joya)\b/)) return 'fashion';
        if (text.match(/\b(sofa|chair|table|lamp|bed|furniture|home|hogar|mueble|mesa|decoracion)\b/)) return 'home-garden';
        if (text.match(/\b(bike|bicycle|gym|fitness|yoga|sports|deporte|bici|gimnasio|futbol|tenis)\b/)) return 'sports-outdoors';
        if (text.match(/\b(toy|lego|doll|baby|juguete|bebe|nino|nina)\b/)) return 'baby-kids';
        if (text.match(/\b(book|libro|novela|comic)\b/)) return 'books';
        if (text.match(/\b(cd|vinyl|music|album|musica|disco)\b/)) return 'music';
        if (text.match(/\b(dvd|movie|pelicula|cine)\b/)) return 'movies';
        if (text.match(/\b(art|painting|collectible|arte|pintura|coleccion)\b/)) return 'collectibles-art';
        if (text.match(/\b(makeup|maquillaje|perfume|crema|beauty|belleza)\b/)) return 'beauty-personal-care';

        // PRD v12.0: Skip if truly unknown to maintain quality
        return null;
    }

    /**
     * Download and process the feed for a specific advertiser
     */
    async downloadAndProcessFeed(feedUrl: string, advertiserId: number, advertiserName: string, logId?: string): Promise<{ processed: number; added: number; skipped: number; errors: number }> {
        let stats = { processed: 0, added: 0, skipped: 0, errors: 0 };
        const tempDir = os.tmpdir();
        const tempZip = path.join(tempDir, `awin_feed_${advertiserId}_${Date.now()}.zip`);

        console.log(`Starting robust sync for ${advertiserName} (${advertiserId})...`);

        try {
            // 1. Download to local file (Robust approach)
            console.log(`⬇️ Downloading feed to ${tempZip}...`);
            const response = await fetch(feedUrl);
            if (!response.ok || !response.body) {
                throw new Error(`Failed to download feed: ${response.statusText}`);
            }

            const fileStream = fs.createWriteStream(tempZip);
            // @ts-ignore
            await pipeline(Readable.fromWeb(response.body), fileStream);
            console.log(`✅ Download complete (${advertiserName})`);

            // 2. Process the local file
            await new Promise<void>((resolve, reject) => {
                const seenUrls = new Set<string>(); // Prevent duplicate processing in same run

                fs.createReadStream(tempZip)
                    .pipe(unzip.Parse())
                    .on('entry', async (entry) => {
                        if (entry.path.endsWith('.csv')) {
                            console.log(`📄 Processing CSV: ${entry.path}`);
                            const parser = entry.pipe(parse({
                                columns: true,
                                skip_empty_lines: true,
                                trim: true,
                                relax_quotes: true
                            }));

                            try {
                                for await (const record of parser) {
                                    stats.processed++;

                                    try {
                                        // Skip duplicates early to save DB calls
                                        const sourceUrl = record.aw_deep_link;
                                        if (seenUrls.has(sourceUrl)) {
                                            stats.skipped++;
                                            continue;
                                        }
                                        seenUrls.add(sourceUrl);

                                        const category = this.mapCategory(record.merchant_category || '', record.product_name || '');

                                        if (!category) {
                                            stats.skipped++;
                                            continue;
                                        }

                                        const price = parseFloat(record.search_price);
                                        if (isNaN(price)) {
                                            stats.skipped++;
                                            continue;
                                        }

                                        const platformKey = advertiserName.toLowerCase().replace(/[^a-z0-9]/g, '');

                                        const productData = {
                                            title: record.product_name,
                                            description: record.description,
                                            price: price,
                                            currency: record.currency || 'EUR',
                                            image_url: record.merchant_image_url,
                                            source_url: sourceUrl,
                                            platform: platformKey,
                                            source_network: 'awin',
                                            category: category,
                                            condition: 'new',
                                        };

                                        const { error: upsertError } = await supabase
                                            .from('products')
                                            .upsert({
                                                ...productData,
                                                updated_at: new Date().toISOString()
                                            }, { onConflict: 'source_url' });

                                        if (upsertError) {
                                            stats.errors++;
                                            // Only log unique errors to avoid flooding
                                            if (stats.errors < 5) console.error(`DB Error (${advertiserName}):`, upsertError.message);
                                            continue;
                                        }

                                        stats.added++;

                                        // Periodic log update (every 100 items)
                                        if (logId && stats.processed % 100 === 0) {
                                            await supabase
                                                .from('sync_logs')
                                                .update({
                                                    items_found: stats.processed,
                                                    items_added: stats.added
                                                })
                                                .eq('id', logId);
                                        }

                                    } catch (err) {
                                        stats.errors++;
                                    }
                                }
                                resolve();
                            } catch (err) {
                                reject(err);
                            }
                        } else {
                            entry.autodrain();
                        }
                    })
                    .on('error', reject)
                    .on('close', resolve);
            });

        } catch (error) {
            console.error(`Error processing feed for ${advertiserName}:`, error);
        } finally {
            // Clean up temp file
            if (fs.existsSync(tempZip)) {
                try { fs.unlinkSync(tempZip); } catch (e) { }
            }
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
                // Dynamic discovery of Feed ID
                const feedId = await this.getFeedId(partner.id);

                if (!feedId) {
                    console.warn(`Skipping ${partner.name} (No active feed found)`);
                    continue;
                }

                const feedUrl = this.getFeedUrl(feedId);

                try {
                    // 1. Cleanup old running logs for this platform
                    const platformName = `awin-${partner.name}`;
                    await this.cleanupStaleLogs(platformName);

                    // 2. Log start and capture ID
                    const { data: logEntry, error: logError } = await supabase
                        .from('sync_logs')
                        .insert({
                            platform: platformName,
                            status: 'running',
                            items_found: 0,
                            items_added: 0
                        })
                        .select()
                        .single();

                    const logId = logEntry?.id;

                    const stats = await this.downloadAndProcessFeed(feedUrl, partner.id, partner.name, logId);

                    // Update existing log with final stats
                    if (logId) {
                        await supabase
                            .from('sync_logs')
                            .update({
                                status: 'success',
                                items_found: stats.processed,
                                items_added: stats.added,
                                error_message: stats.errors > 0 ? `${stats.errors} row errors` : null
                            })
                            .eq('id', logId);
                    }

                } catch (err: any) {
                    console.error(`Failed sync for ${partner.name}:`, err);
                    // Log failure - This might need to update the existing log if logId exists
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
