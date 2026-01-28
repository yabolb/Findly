
import dotenv from 'dotenv';
import path from 'path';
import { Readable } from 'stream';
import unzip from 'unzip-stream';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Robust Sync Script that downloads to file first
async function runRobustSync() {
    console.log('🚀 Starting Robust Awin Sync...');

    // Setup Supabase
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { AwinService } = await import('../src/lib/awin-service');
    const service = new AwinService();

    // 1. Get Feed ID (Hardware ID for ECI)
    const fid = 33801;
    const url = service.getFeedUrl(fid);
    const tempZip = 'feed_temp.zip';

    try {
        console.log('⬇️ Downloading feed to file (avoiding stream timeouts)...');
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

        const fileStream = fs.createWriteStream(tempZip);
        // @ts-ignore
        await pipeline(Readable.fromWeb(response.body), fileStream);
        console.log('✅ Download complete.');

        console.log('📂 Unzipping and Processing...');

        let processed = 0;
        let added = 0;

        // Use the existing logic but hook into it manually or just use the service but mock the URL?
        // Actually, let's just use the Service logic but modify it slightly to read from file?
        // OR simply call the service method which streams.
        // If download worked, maybe the issue was network stream timeout.

        // Let's call the standard sync now that we verified download works? 
        // No, let's rewrite the processing loop here to be 100% sure we see output.

        const stats = { processed: 0, added: 0, skipped: 0, errors: 0 };

        await new Promise((resolve, reject) => {
            // @ts-ignore
            const parse = require('csv-parse').parse;

            fs.createReadStream(tempZip)
                .pipe(unzip.Parse())
                .on('entry', async (entry) => {
                    if (entry.path.endsWith('.csv')) {
                        console.log(`FOUND CSV: ${entry.path}`);

                        const parser = entry.pipe(parse({
                            columns: true,
                            skip_empty_lines: true,
                            relax_quotes: true
                        }));

                        for await (const record of parser) {
                            stats.processed++;

                            // --- LOGIC FROM SERVICE ---
                            const category = service.mapCategory(record.merchant_category || '', record.product_name || '');

                            if (category && category !== 'others') {
                                // Upsert
                                const price = parseFloat(record.search_price);
                                if (!isNaN(price)) {
                                    await supabase.from('products').upsert({
                                        title: record.product_name,
                                        description: record.description,
                                        price: price,
                                        currency: record.currency || 'EUR',
                                        image_url: record.merchant_image_url,
                                        source_url: record.aw_deep_link, // Correct column
                                        platform: 'elcorteingleses',
                                        source_network: 'awin',
                                        category: category,
                                        updated_at: new Date().toISOString()
                                    }, { onConflict: 'source_url' });

                                    stats.added++;
                                }
                            }

                            if (stats.processed % 100 === 0) {
                                process.stdout.write(`\rProcessed: ${stats.processed} | Added: ${stats.added}`);
                            }
                        }
                    } else {
                        entry.autodrain();
                    }
                })
                .on('close', resolve)
                .on('error', reject);
        });

        console.log('\n✅ Sync Finished!');
        console.log(stats);

    } catch (e) {
        console.error('\n💥 Error:', e);
    } finally {
        if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
    }
}

runRobustSync();
